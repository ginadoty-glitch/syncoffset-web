/**
 * Print color-block palette — 24×36 wall calendar.
 *
 * On the printed calendar THE COLOR IS THE CELL: a day's whole cell is filled
 * with its location (or activity) color — a saturated header bar plus a light
 * body tint of the same hue. This matches the reference AD color-block
 * production calendar (Block 03), not a dashboard with colored labels.
 *
 * Location colors reuse the exact FNV-1a hash + palette ORDER as the screen's
 * `location-color.ts`, so the same location resolves to the same hue family on
 * both the dark screen calendar and the printed calendar.
 */

import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";

import { canonicalLocationKey } from "./location-color";

export type PrintBlockColor = {
  /** Saturated header bar fill. */
  bar: string;
  /** Light body tint (the cell fill). */
  tint: string;
  /** Readable text color on the tint. */
  ink: string;
  /** Text color on the saturated bar. */
  onBar: string;
};

const WHITE = "#ffffff";

/** Same order as LOCATION_PALETTE in location-color.ts (emerald, red, blue, …). */
const LOCATION_PALETTE: PrintBlockColor[] = [
  { bar: "#0f9d6b", tint: "#d8f3e7", ink: "#0b4f3a", onBar: WHITE }, // emerald
  { bar: "#d23b3b", tint: "#fbe0e0", ink: "#7f1d1d", onBar: WHITE }, // red
  { bar: "#2f6bd8", tint: "#dbe7fb", ink: "#1e3a8a", onBar: WHITE }, // blue
  { bar: "#e07b1a", tint: "#fde9d2", ink: "#7c3a0c", onBar: WHITE }, // orange
  { bar: "#7d4fd6", tint: "#e9e1fa", ink: "#4c1d95", onBar: WHITE }, // violet
  { bar: "#119c93", tint: "#d3f3f0", ink: "#134e4a", onBar: WHITE }, // teal
  { bar: "#d6519a", tint: "#fbe0ef", ink: "#831843", onBar: WHITE }, // pink
  { bar: "#cf9412", tint: "#f8edcb", ink: "#6e4d09", onBar: WHITE }, // amber
  { bar: "#1597b8", tint: "#d2f0f7", ink: "#155e75", onBar: WHITE }, // cyan
  { bar: "#6fa120", tint: "#e8f3cf", ink: "#3f5314", onBar: WHITE }, // lime
  { bar: "#b745c4", tint: "#f6dcf9", ink: "#701a75", onBar: WHITE }, // fuchsia
  { bar: "#2389c9", tint: "#d6ebf9", ink: "#075985", onBar: WHITE }, // sky
];

const NEUTRAL: PrintBlockColor = { bar: "#6b7280", tint: "#eceef1", ink: "#334155", onBar: WHITE };

/** Deterministic location color — consistent with the screen location chips. */
export function printLocationColor(rawTitle: string): PrintBlockColor {
  const key = canonicalLocationKey(rawTitle);
  if (!key || key === "TBD") return NEUTRAL;
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const idx = (hash >>> 0) % LOCATION_PALETTE.length;
  return LOCATION_PALETTE[idx];
}

/** Activity color for non-shoot days that aren't keyed to a single film location. */
const DAY_TYPE_PRINT_COLOR: Partial<Record<CalendarDayType, PrintBlockColor>> = {
  prep: { bar: "#cf9412", tint: "#f8edcb", ink: "#6e4d09", onBar: WHITE },
  "tech-scout": { bar: "#2f6bd8", tint: "#dbe7fb", ink: "#1e3a8a", onBar: WHITE },
  "camera-test": { bar: "#2f6bd8", tint: "#dbe7fb", ink: "#1e3a8a", onBar: WHITE },
  travel: { bar: "#7d4fd6", tint: "#e9e1fa", ink: "#4c1d95", onBar: WHITE },
  "company-move": { bar: "#7d4fd6", tint: "#e9e1fa", ink: "#4c1d95", onBar: WHITE },
  wrap: { bar: "#2389c9", tint: "#d6ebf9", ink: "#075985", onBar: WHITE },
  construction: { bar: "#cf9412", tint: "#f8edcb", ink: "#6e4d09", onBar: WHITE },
  pickup: { bar: "#0f9d6b", tint: "#d8f3e7", ink: "#0b4f3a", onBar: WHITE },
  reshoot: { bar: "#0f9d6b", tint: "#d8f3e7", ink: "#0b4f3a", onBar: WHITE },
};

export function dayTypePrintColor(dayType: CalendarDayType): PrintBlockColor {
  return DAY_TYPE_PRINT_COLOR[dayType] ?? NEUTRAL;
}

/** Off / non-operating days — filled cell + centered label (no header bar). */
export const OFF_DAY_TYPES = new Set<CalendarDayType>(["holiday", "dark-day", "weather-hold", "strike"]);

export function offDayColor(dayType: CalendarDayType): PrintBlockColor {
  if (dayType === "holiday") return { bar: "#d23b3b", tint: "#fbe0e0", ink: "#b91c1c", onBar: WHITE };
  if (dayType === "strike") return { bar: "#78716c", tint: "#ece9e4", ink: "#57534e", onBar: WHITE };
  // dark-day / weather-hold — company day off
  return { bar: "#e07b1a", tint: "#fdecd9", ink: "#b45309", onBar: WHITE };
}
