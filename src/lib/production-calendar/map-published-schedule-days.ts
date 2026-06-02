import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";

import type { CalendarDayRow } from "./calendar-types";

const SHADOW_JSON_PREFIX = "SYNCO_SHADOW_JSON:v1:";

type EmbeddedShadow = {
  scenes?: string[];
  unitLabel?: string | null;
  zone?: string;
};

function extractEmbeddedShadow(rawNotes: string | null): { cleanedNotes: string; meta: EmbeddedShadow | null } {
  if (!rawNotes?.trim()) return { cleanedNotes: "", meta: null };
  const idx = rawNotes.indexOf(SHADOW_JSON_PREFIX);
  if (idx < 0) return { cleanedNotes: rawNotes.trim(), meta: null };
  const cleanedNotes = rawNotes.slice(0, idx).trim();
  let meta: EmbeddedShadow | null = null;
  try {
    meta = JSON.parse(rawNotes.slice(idx + SHADOW_JSON_PREFIX.length).trim()) as EmbeddedShadow;
  } catch {
    meta = null;
  }
  return { cleanedNotes, meta };
}

function mapDayType(raw: string | null, intExtHint: string | null): CalendarDayType {
  const d = (raw ?? "").trim().toLowerCase();
  if (d === "prep" || d === "shoot" || d === "wrap" || d === "travel" || d === "company-move") {
    return d as CalendarDayType;
  }
  const ie = (intExtHint ?? "").toUpperCase();
  if (ie.startsWith("E")) return "shoot";
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
} {
  const parsed = extractEmbeddedShadow(row.notes);
  const dateIso = row.shoot_day.slice(0, 10);
  const titleBits = row.title
    .split(" · ")
    .map((s) => s.trim())
    .filter(Boolean);
  const shootLocation = titleBits[0] || row.title.trim() || "TBD";

  return {
    row: {
      id: row.id,
      calendar_date: dateIso,
      day_number: parsed.meta?.scenes?.length ? row.strip_position + 1 : row.strip_position + 1,
      day_type: mapDayType(row.day_type, row.day_type),
      shoot_location: shootLocation,
      unit_label: (parsed.meta?.unitLabel ?? "").trim(),
      zone_color: (parsed.meta?.zone ?? "unit-a").trim() || "unit-a",
      notes: parsed.cleanedNotes,
    },
    sceneLabels: parsed.meta?.scenes ?? [],
  };
}
