import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";
import type { ShootDayEvent, ShootDayMarker, ShootDaySetup, ShootDayUnit, WorkPeriod } from "@/types/schedule";

import type { CalendarDayRow, CalendarDaySceneRow } from "./calendar-types";

const V1_PREFIX = "SYNCO_SHADOW_JSON:v1:";
const V2_PREFIX = "SYNCO_SHADOW_JSON:v2:";

// ── v1 legacy shape ──

type V1SetEntry = { name: string; intExt?: string; dayNight?: string };

type V1Shadow = {
  scenes?: string[];
  unitLabel?: string | null;
  zone?: string;
  sets?: V1SetEntry[];
  markers?: string[];
  tdbs?: string[];
};

// ── v2 canonical shape ──

type V2Shadow = {
  v: 2;
  setups: ShootDaySetup[];
  units: ShootDayUnit[];
  markers: ShootDayMarker[];
  events: ShootDayEvent[];
  zone: string | null;
  companyMove: boolean;
  companyMoveDestination: string | null;
  secondaryLocation?: string | null;
  totalPages?: string | null;
  splitDay?: boolean;
  workPeriods?: WorkPeriod[];
  preLightNotes?: string[];
  vfxElements?: string[];
  omittedScenes?: string[];
  blockId?: string;
  localId?: string;
};

// ── Normalized output ──

type NormalizedShadow = {
  setups: ShootDaySetup[];
  units: ShootDayUnit[];
  markers: ShootDayMarker[];
  events: ShootDayEvent[];
  zone: string;
  companyMove: boolean;
  companyMoveDestination: string | null;
  totalPages: string | null;
  splitDay: boolean;
  cleanedNotes: string;
  allScenes: string[];
};

function extractShadow(rawNotes: string | null): NormalizedShadow {
  const empty: NormalizedShadow = {
    setups: [],
    units: [],
    markers: [],
    events: [],
    zone: "unit-a",
    companyMove: false,
    companyMoveDestination: null,
    totalPages: null,
    splitDay: false,
    cleanedNotes: rawNotes?.trim() ?? "",
    allScenes: [],
  };
  if (!rawNotes?.trim()) return empty;

  const v2Idx = rawNotes.indexOf(V2_PREFIX);
  if (v2Idx >= 0) {
    const cleaned = rawNotes.slice(0, v2Idx).trim();
    try {
      const meta = JSON.parse(rawNotes.slice(v2Idx + V2_PREFIX.length).trim()) as V2Shadow;
      const allScenes = meta.setups.flatMap((s) => s.scenes);
      return {
        setups: meta.setups,
        units: meta.units,
        markers: meta.markers,
        events: meta.events ?? [],
        zone: meta.zone?.trim() || "unit-a",
        companyMove: meta.companyMove,
        companyMoveDestination: meta.companyMoveDestination,
        totalPages: meta.totalPages ?? null,
        splitDay: meta.splitDay ?? false,
        cleanedNotes: cleaned,
        allScenes,
      };
    } catch {
      return { ...empty, cleanedNotes: cleaned };
    }
  }

  const v1Idx = rawNotes.indexOf(V1_PREFIX);
  if (v1Idx >= 0) {
    const cleaned = rawNotes.slice(0, v1Idx).trim();
    try {
      const meta = JSON.parse(rawNotes.slice(v1Idx + V1_PREFIX.length).trim()) as V1Shadow;
      const setups: ShootDaySetup[] = (meta.sets ?? []).map((s, i) => ({
        setName: s.name,
        intExt: (s.intExt as ShootDaySetup["intExt"]) || "INT",
        dayNight: (s.dayNight as ShootDaySetup["dayNight"]) || undefined,
        scenes: [],
        sortOrder: i,
      }));
      const units: ShootDayUnit[] = meta.unitLabel ? [{ unitLabel: meta.unitLabel }] : [];
      const markers: ShootDayMarker[] = (meta.markers ?? []).map((m) => ({
        label: m,
        markerType: "milestone" as const,
      }));
      let notesText = cleaned;
      if (meta.tdbs && meta.tdbs.length > 0) {
        notesText = [notesText, ...meta.tdbs].filter(Boolean).join(" · ");
      }
      return {
        setups,
        units,
        markers,
        events: [],
        zone: meta.zone?.trim() || "unit-a",
        companyMove: false,
        companyMoveDestination: null,
        totalPages: null,
        splitDay: false,
        cleanedNotes: notesText,
        allScenes: meta.scenes ?? [],
      };
    } catch {
      return { ...empty, cleanedNotes: cleaned };
    }
  }

  return empty;
}

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
    },
    sceneLabels: shadow.allScenes,
    sceneRows,
    markers: shadow.markers,
    events: shadow.events,
  };
}
