import { eachDayOfInterval, endOfMonth, endOfWeek, format, parseISO, startOfMonth, startOfWeek } from "date-fns";

import { getDefaultProductionId } from "@/lib/ingestion/production";
import { isMissingRelation } from "@/lib/operations/is-missing-relation";
import type {
  CalendarDayDepartmentFlag,
  CalendarDayObligationRow,
  CalendarDaySceneRow,
  ProductionCalendarDayCell,
  ProductionCalendarMonthData,
  ScheduleDateRange,
} from "@/lib/production-calendar/calendar-types";
import { canonicalLocationKey, locationDisplayLabel } from "@/lib/production-calendar/location-color";
import {
  type PublishedScheduleDayRow,
  publishedScheduleDayToCalendarRow,
} from "@/lib/production-calendar/map-published-schedule-days";
import { createServiceClient } from "@/lib/supabase/server";
import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";

function toIsoDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

function buildMonthGrid(year: number, month: number): Date[] {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export async function loadProductionCalendarMonth(year: number, month: number): Promise<ProductionCalendarMonthData> {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(monthStart);
  const rangeStart = toIsoDate(startOfWeek(monthStart, { weekStartsOn: 0 }));
  const rangeEnd = toIsoDate(endOfWeek(monthEnd, { weekStartsOn: 0 }));

  const emptyCells: ProductionCalendarDayCell[] = buildMonthGrid(year, month).map((d) => ({
    date: toIsoDate(d),
    inMonth: d.getMonth() === month - 1,
    day: null,
    scenes: [],
    obligations: [],
    departmentFlags: [],
    workOrderCount: 0,
    transportCount: 0,
  }));

  const base: ProductionCalendarMonthData = {
    year,
    month,
    monthLabel: format(monthStart, "MMMM yyyy"),
    calendarName: null,
    cells: emptyCells,
    persistenceAvailable: false,
    tablesAvailable: false,
    loadError: null,
    scheduleRange: null,
  };

  let supabase: ReturnType<typeof createServiceClient>;
  let showId: string;

  try {
    supabase = createServiceClient();
    showId = await getDefaultProductionId();
  } catch (error) {
    return {
      ...base,
      loadError: error instanceof Error ? error.message : "Supabase is not configured.",
    };
  }

  const { data: publishedRev, error: revError } = await supabase
    .from("production_schedule_revisions")
    .select("id, revision_name, revision_number")
    .eq("show_id", showId)
    .eq("revision_scope", "published")
    .maybeSingle();

  if (isMissingRelation(revError)) {
    return {
      ...base,
      loadError:
        "Apply migrations 20260520100000_production_schedule_shadow.sql and 20260521100000_schedule_revision_publish_phase2.sql.",
    };
  }

  if (revError) {
    return { ...base, loadError: revError.message };
  }

  if (!publishedRev?.id) {
    return { ...base, persistenceAvailable: true, tablesAvailable: true };
  }

  const revisionId = publishedRev.id as string;
  const calendarName =
    (publishedRev.revision_name as string | null)?.trim() ||
    (publishedRev.revision_number != null ? `Revision ${publishedRev.revision_number}` : "Published schedule");

  // Prep schedules live in their own (unpublished) revision and never supersede
  // the shooting schedule. Surface the LATEST prep revision alongside the
  // published shooting schedule so prep days + shoot days share the calendar.
  const revisionIds: string[] = [revisionId];
  const { data: prepDocs } = await supabase
    .from("source_documents")
    .select("id")
    .eq("production_id", showId)
    .eq("source_document_kind", "prep-schedule");
  const prepDocIds = (prepDocs ?? []).map((d) => d.id as string);
  if (prepDocIds.length > 0) {
    const { data: prepRev } = await supabase
      .from("production_schedule_revisions")
      .select("id")
      .eq("show_id", showId)
      .in("external_source_document_key", prepDocIds)
      .order("imported_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (prepRev?.id) revisionIds.push(prepRev.id as string);
  }

  // Fetch the full date range across both revisions (for navigation)
  const [firstDayResult, lastDayResult, dayCountResult] = await Promise.all([
    supabase
      .from("production_schedule_days")
      .select("shoot_day")
      .in("revision_id", revisionIds)
      .order("shoot_day", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("production_schedule_days")
      .select("shoot_day")
      .in("revision_id", revisionIds)
      .order("shoot_day", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("production_schedule_days")
      .select("id", { count: "exact", head: true })
      .in("revision_id", revisionIds),
  ]);

  let scheduleRange: ScheduleDateRange | null = null;
  if (firstDayResult.data?.shoot_day && lastDayResult.data?.shoot_day) {
    const firstParsed = parseISO(firstDayResult.data.shoot_day as string);
    scheduleRange = {
      firstDate: firstDayResult.data.shoot_day as string,
      lastDate: lastDayResult.data.shoot_day as string,
      firstMonth: { year: firstParsed.getFullYear(), month: firstParsed.getMonth() + 1 },
      totalDays: dayCountResult.count ?? 0,
    };
  }

  const { data: dayRows, error: daysError } = await supabase
    .from("production_schedule_days")
    .select("id, strip_position, shoot_day, day_type, title, notes, meeting_url, map_url")
    .in("revision_id", revisionIds)
    .gte("shoot_day", `${rangeStart}T00:00:00`)
    .lte("shoot_day", `${rangeEnd}T23:59:59`)
    .order("strip_position", { ascending: true });

  if (isMissingRelation(daysError)) {
    return { ...base, loadError: daysError?.message ?? "production_schedule_days table missing." };
  }

  if (daysError) {
    return { ...base, persistenceAvailable: true, loadError: daysError.message };
  }

  const dayByDate = new Map<string, ReturnType<typeof publishedScheduleDayToCalendarRow>>();
  const scenesByDate = new Map<string, CalendarDaySceneRow[]>();
  const obligationsByDate = new Map<string, CalendarDayObligationRow[]>();

  for (const raw of (dayRows ?? []) as PublishedScheduleDayRow[]) {
    const mapped = publishedScheduleDayToCalendarRow(raw);
    dayByDate.set(mapped.row.calendar_date, mapped);

    if (mapped.events.length > 0) {
      obligationsByDate.set(
        mapped.row.calendar_date,
        mapped.events.map((e) => ({
          obligation_type: e.eventType,
          label: e.title,
          time_label: e.startTime ?? null,
        })),
      );
    }

    if (mapped.sceneRows.length > 0) {
      scenesByDate.set(mapped.row.calendar_date, mapped.sceneRows);
    } else if (mapped.sceneLabels.length > 0) {
      scenesByDate.set(
        mapped.row.calendar_date,
        mapped.sceneLabels.map((label) => ({
          scene_number: label,
          interior_exterior: "",
          description: label,
          set_name: null,
          location_label: mapped.row.shoot_location,
        })),
      );
    }
  }

  // Location transitions — derived from location-key deltas (not companyMove fields).
  // Within the loaded grid window, walk shoot days in date order; when a day's
  // canonical location differs from the prior shoot day, mark it as an arrival.
  const shootEntries = [...dayByDate.values()]
    .filter((m) => m.row.day_type === "shoot")
    .sort((a, b) => a.row.calendar_date.localeCompare(b.row.calendar_date));
  let prevLocationKey: string | null = null;
  let prevLocationLabel = "";
  for (const entry of shootEntries) {
    const key = canonicalLocationKey(entry.row.shoot_location);
    if (key) {
      if (prevLocationKey !== null && key !== prevLocationKey) {
        entry.row.move_from_label = prevLocationLabel;
      }
      prevLocationKey = key;
      prevLocationLabel = locationDisplayLabel(entry.row.shoot_location);
    }
  }

  const [workOrdersResult, transportResult] = await Promise.all([
    supabase
      .from("work_orders")
      .select("id, required_by_date, assigned_to, title")
      .eq("production_id", showId)
      .gte("required_by_date", rangeStart)
      .lte("required_by_date", rangeEnd),
    supabase
      .from("transport_orders")
      .select("id, created_at, title, status")
      .eq("production_id", showId)
      .gte("created_at", `${rangeStart}T00:00:00`)
      .lte("created_at", `${rangeEnd}T23:59:59`),
  ]);

  const workOrdersByDate = new Map<string, { count: number; flags: CalendarDayDepartmentFlag[] }>();
  for (const row of workOrdersResult.data ?? []) {
    const date = (row as { required_by_date: string | null }).required_by_date;
    if (!date) continue;
    const entry = workOrdersByDate.get(date) ?? { count: 0, flags: [] };
    entry.count += 1;
    const assigned = (row as { assigned_to: string }).assigned_to;
    if (assigned && entry.flags.length < 2) {
      entry.flags.push({ department: assigned.split("—")[0]?.trim() || "WO", label: (row as { title: string }).title });
    }
    workOrdersByDate.set(date, entry);
  }

  const transportByDate = new Map<string, number>();
  for (const row of transportResult.data ?? []) {
    const created = (row as { created_at: string }).created_at;
    const date = toIsoDate(parseISO(created));
    transportByDate.set(date, (transportByDate.get(date) ?? 0) + 1);
  }

  const cells: ProductionCalendarDayCell[] = buildMonthGrid(year, month).map((d) => {
    const date = toIsoDate(d);
    const mapped = dayByDate.get(date);
    const day = mapped?.row ?? null;
    const wo = workOrdersByDate.get(date);
    const transportCount = transportByDate.get(date) ?? 0;
    const departmentFlags: CalendarDayDepartmentFlag[] = [...(wo?.flags ?? [])];
    if (transportCount > 0) {
      departmentFlags.push({
        department: "Transport",
        label: `${transportCount} move${transportCount === 1 ? "" : "s"}`,
      });
    }

    return {
      date,
      inMonth: d.getMonth() === month - 1,
      day: day
        ? {
            ...day,
            day_type: day.day_type as CalendarDayType,
          }
        : null,
      scenes: day ? (scenesByDate.get(date) ?? []) : [],
      obligations: day ? (obligationsByDate.get(date) ?? []) : [],
      departmentFlags,
      workOrderCount: wo?.count ?? 0,
      transportCount,
    };
  });

  return {
    year,
    month,
    monthLabel: format(monthStart, "MMMM yyyy"),
    calendarName,
    cells,
    persistenceAvailable: true,
    tablesAvailable: true,
    loadError: null,
    scheduleRange,
  };
}
