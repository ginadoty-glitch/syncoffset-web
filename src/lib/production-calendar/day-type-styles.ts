import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";
import { CALENDAR_DAY_TYPE_REGISTRY } from "@/types/core/production-calendar/calendar-day-type";

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
  construction: "bg-amber-700/25 border-amber-800/50",
  strike: "bg-stone-500/25 border-stone-600/50",
  pickup: "bg-emerald-500/20 border-emerald-600/45",
  reshoot: "bg-emerald-500/30 border-emerald-700/55",
  "tech-scout": "bg-blue-500/20 border-blue-600/45",
  "camera-test": "bg-blue-400/20 border-blue-500/40",
  custom: "bg-card border-border",
};

export const ZONE_LEGEND: { id: string; label: string; className: string }[] = [
  { id: "unit-a", label: "Unit A", className: "bg-emerald-700" },
  { id: "unit-b", label: "Unit B", className: "bg-sky-700" },
  { id: "second-unit", label: "2nd Unit", className: "bg-violet-700" },
  { id: "prep-week", label: "Prep Block", className: "bg-amber-600" },
  { id: "wrap-week", label: "Wrap Block", className: "bg-sky-600" },
];

export function dayTypeLabel(dayType: CalendarDayType): string {
  return CALENDAR_DAY_TYPE_REGISTRY[dayType]?.label ?? dayType;
}
