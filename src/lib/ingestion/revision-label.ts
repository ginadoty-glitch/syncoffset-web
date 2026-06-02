import type { CalendarRevisionColor } from "@/types/core/production-calendar/calendar-revision-colors";

const COLOR_NAMES: CalendarRevisionColor[] = [
  "white",
  "blue",
  "pink",
  "yellow",
  "green",
  "goldenrod",
  "buff",
  "salmon",
  "cherry",
  "tan",
  "gray",
  "ivory",
  "double-white",
];

/** Best-effort revision color from filename (e.g. "Script_Blue.pdf"). */
export function parseRevisionColorFromFileName(fileName: string): CalendarRevisionColor | undefined {
  const lower = fileName.toLowerCase();
  for (const color of COLOR_NAMES) {
    if (lower.includes(color.replace("-", "")) || lower.includes(color)) {
      return color;
    }
  }
  return undefined;
}

/** Display label for timeline (e.g. "Rev 3", "Blue"). */
export function revisionTimelineLabel(
  revisionNumber: number,
  revisionColor?: CalendarRevisionColor | null,
  fileName?: string,
): string {
  const color = revisionColor ?? parseRevisionColorFromFileName(fileName ?? "");
  if (color) {
    return color.charAt(0).toUpperCase() + color.slice(1).replace("-", " ");
  }
  return `Rev ${revisionNumber}`;
}
