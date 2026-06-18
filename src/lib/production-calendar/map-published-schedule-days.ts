import { extractShadow } from "@/lib/schedule/extract-shadow";
import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";
import type { ShootDayEvent, ShootDayMarker } from "@/types/schedule";

import type { CalendarDayRow, CalendarDaySceneRow } from "./calendar-types";

function mapDayType(raw: string | null): CalendarDayType {
  const d = (raw ?? "").trim().toLowerCase().replace(/_/g, "-");
  if (d === "construction" || d.includes("construction")) return "prep";
  const known: CalendarDayType[] = [
    "prep",
    "shoot",
    "wrap",
    "travel",
    "company-move",
    "holiday",
    "dark-day",
    "tech-scout",
    "weather-hold",
    "strike",
    "pickup",
    "reshoot",
    "camera-test",
    "custom",
  ];
  if (known.includes(d as CalendarDayType)) return d as CalendarDayType;
  if (d.includes("tech") && d.includes("scout")) return "tech-scout";
  if (d.includes("dark")) return "dark-day";
  if (d.includes("holiday")) return "holiday";
  if (d.includes("prep")) return "prep";
  if (d.includes("construct")) return "prep";
  if (d.includes("wrap")) return "wrap";
  if (d.includes("travel")) return "travel";
  return "shoot";
}

export type PublishedScheduleDayRow = {
  id: string;
  strip_position: number;
  shoot_day: string;
  day_type: string | null;
  title: string;
  notes: string | null;
  meeting_url: string | null;
  map_url: string | null;
};

export function publishedScheduleDayToCalendarRow(row: PublishedScheduleDayRow): {
  row: CalendarDayRow;
  sceneLabels: string[];
  sceneRows: CalendarDaySceneRow[];
  markers: ShootDayMarker[];
  events: ShootDayEvent[];
} {
  const shadow = extractShadow(row.notes);
  const dateIso = row.shoot_day.slice(0, 10);
  const shootLocation = row.title.trim() || "TBD";

  const sceneRows: CalendarDaySceneRow[] = shadow.setups.map((s) => ({
    scene_number: s.scenes.join(", "),
    interior_exterior: s.intExt ?? "",
    description: s.setName,
    set_name: s.setName,
    location_label: shootLocation,
    day_night: s.dayNight ?? "",
    d_number: s.dNumber ?? "",
  }));

  const primaryUnit = shadow.units[0]?.unitLabel ?? "";

  return {
    row: {
      id: row.id,
      calendar_date: dateIso,
      day_number: row.strip_position < 100 ? row.strip_position + 1 : null,
      day_type: mapDayType(row.day_type),
      shoot_location: shootLocation,
      unit_label: primaryUnit,
      zone_color: shadow.zone,
      notes: shadow.cleanedNotes,
      markers: shadow.markers,
      total_pages: shadow.totalPages,
      split_day: shadow.splitDay,
      company_move: shadow.companyMove,
      company_move_destination: shadow.companyMoveDestination,
      company_move_type: shadow.companyMoveType,
    },
    sceneLabels: shadow.allScenes,
    sceneRows,
    markers: shadow.markers,
    events: shadow.events,
  };
}
