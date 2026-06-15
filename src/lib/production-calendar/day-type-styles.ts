import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";
import { CALENDAR_DAY_TYPE_REGISTRY } from "@/types/core/production-calendar/calendar-day-type";

import { isSecondOrSplinterUnit } from "./unit-indicators";

/** Strip-calendar block colors — AD wall-calendar convention, not SaaS event colors. */
export const DAY_TYPE_BLOCK_CLASS: Record<CalendarDayType, string> = {
  prep: "bg-amber-500/25 border-amber-600/50",
  shoot: "bg-emerald-600/30 border-emerald-700/60",
  wrap: "bg-sky-600/25 border-sky-700/50",
  travel: "bg-violet-500/20 border-violet-600/40",
  "company-move": "bg-violet-500/20 border-violet-600/40",
  holiday: "bg-muted/40 border-border",
  "dark-day": "bg-muted/30 border-dashed border-border",
  "weather-hold": "bg-orange-500/20 border-orange-600/45",
  construction: "bg-amber-500/25 border-amber-600/50",
  strike: "bg-stone-500/25 border-stone-600/50",
  pickup: "bg-emerald-500/20 border-emerald-600/45",
  reshoot: "bg-emerald-500/30 border-emerald-700/55",
  "tech-scout": "bg-blue-500/20 border-blue-600/45",
  "camera-test": "bg-blue-400/20 border-blue-500/40",
  custom: "bg-card border-border",
};

/** Wall-calendar left-border color blocks (print-friendly). */
export const WALL_DAY_TYPE_BLOCK_CLASS: Record<CalendarDayType, string> = {
  prep: "wall-block-prep",
  shoot: "wall-block-shoot",
  wrap: "wall-block-wrap",
  travel: "wall-block-travel",
  "company-move": "wall-block-travel",
  holiday: "wall-block-holiday",
  "dark-day": "wall-block-dark-day",
  "weather-hold": "wall-block-dark-day",
  construction: "wall-block-prep",
  strike: "wall-block-wrap",
  pickup: "wall-block-shoot",
  reshoot: "wall-block-shoot",
  "tech-scout": "wall-block-tech-scout",
  "camera-test": "wall-block-tech-scout",
  custom: "wall-block-custom",
};

export const WALL_LEGEND_DAY_TYPES: CalendarDayType[] = [
  "prep",
  "shoot",
  "tech-scout",
  "travel",
  "wrap",
  "holiday",
  "dark-day",
];

export const ZONE_LEGEND: { id: string; label: string; className: string }[] = [
  { id: "van", label: "Van (Incl. N+W)", className: "bg-emerald-700" },
  { id: "north", label: "North", className: "bg-sky-700" },
  { id: "east", label: "East", className: "bg-amber-600" },
  { id: "island", label: "Island / Valley", className: "bg-violet-700" },
];

export const UNIT_LEGEND: { id: string; label: string; className: string }[] = [
  { id: "main", label: "Main Unit", className: "wall-unit-main" },
  { id: "second", label: "Second Unit", className: "wall-unit-second" },
  { id: "splinter", label: "Splinter Unit", className: "wall-unit-splinter" },
];

/**
 * Event blocks — wall calendars stack several colored event blocks inside one
 * day box (meetings, scouts, fittings, company move, etc.). Colors are grouped
 * into categories the top-of-calendar legend explains; the block text carries
 * the specific event ("Props Show & Tell"), the color carries the category.
 */
export type EventBlockCategory =
  | "company-move"
  | "meeting"
  | "scout"
  | "fitting"
  | "rehearsal"
  | "technical"
  | "safety"
  | "other";

export const EVENT_CATEGORY_STYLE: Record<EventBlockCategory, { block: string; swatch: string; label: string }> = {
  "company-move": { block: "bg-violet-500/25 border-violet-400", swatch: "bg-violet-500", label: "Company Move" },
  meeting: { block: "bg-indigo-500/25 border-indigo-400", swatch: "bg-indigo-500", label: "Meeting" },
  scout: { block: "bg-blue-500/25 border-blue-400", swatch: "bg-blue-500", label: "Scout / Survey" },
  fitting: { block: "bg-pink-500/25 border-pink-400", swatch: "bg-pink-500", label: "Fitting" },
  rehearsal: { block: "bg-orange-500/25 border-orange-400", swatch: "bg-orange-500", label: "Rehearsal" },
  technical: { block: "bg-cyan-500/25 border-cyan-400", swatch: "bg-cyan-500", label: "Technical" },
  safety: { block: "bg-red-500/25 border-red-400", swatch: "bg-red-500", label: "Safety" },
  other: { block: "bg-slate-500/25 border-slate-400", swatch: "bg-slate-500", label: "Other" },
};

const EVENT_TYPE_CATEGORY: Record<string, EventBlockCategory> = {
  production_meeting: "meeting",
  logistics_meeting: "meeting",
  props_show_and_tell: "meeting",
  show_and_tell: "meeting",
  safety_meeting: "safety",
  tech_scout: "scout",
  location_scout: "scout",
  costume_fitting: "fitting",
  rehearsal: "rehearsal",
  stunt_rehearsal: "rehearsal",
  pre_light: "technical",
  vfx_element_shoot: "technical",
  camera_test: "technical",
  other: "other",
};

export function eventBlockCategory(obligationType: string): EventBlockCategory {
  return EVENT_TYPE_CATEGORY[obligationType] ?? "other";
}

export const EVENT_LEGEND: EventBlockCategory[] = [
  "company-move",
  "meeting",
  "scout",
  "fitting",
  "rehearsal",
  "technical",
  "safety",
];

export function dayTypeLabel(dayType: CalendarDayType): string {
  return CALENDAR_DAY_TYPE_REGISTRY[dayType]?.label ?? dayType;
}

export function wallBlockClassForDay(dayType: CalendarDayType, unitLabel: string): string {
  if (isSecondOrSplinterUnit(unitLabel)) {
    const upper = unitLabel.toUpperCase();
    if (upper.includes("SPLINTER")) return "wall-block-splinter-unit";
    return "wall-block-second-unit";
  }
  return WALL_DAY_TYPE_BLOCK_CLASS[dayType] ?? WALL_DAY_TYPE_BLOCK_CLASS.custom;
}

export function formatSceneReferenceList(sceneNumbers: string[]): string {
  if (sceneNumbers.length === 0) return "";
  return `Sc. ${sceneNumbers.join(", ")}`;
}

export function formatProductionHeadline(
  dayType: CalendarDayType,
  dayNumber: number | null,
  shootLocation: string,
): string {
  const location = shootLocation.trim();
  if (dayType === "shoot" && dayNumber != null) {
    return location ? `DAY ${dayNumber} ${location}` : `DAY ${dayNumber}`;
  }
  const typeLabel = dayTypeLabel(dayType).toUpperCase();
  return location ? `${typeLabel} · ${location}` : typeLabel;
}
