/**
 * SyncOffset Production Calendar Authority — revision colors (registry only)
 *
 * Standard production calendar revision colors (industry convention).
 * @see docs/SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md
 */

export type CalendarRevisionColor =
  | "white"
  | "blue"
  | "pink"
  | "yellow"
  | "green"
  | "goldenrod"
  | "buff"
  | "salmon"
  | "cherry"
  | "tan"
  | "gray"
  | "ivory"
  | "double-white";

export type CalendarRevisionColorDefinition = {
  readonly color: CalendarRevisionColor;
  readonly label: string;
};

export const CALENDAR_REVISION_COLOR_REGISTRY: Record<CalendarRevisionColor, CalendarRevisionColorDefinition> = {
  white: { color: "white", label: "White" },
  blue: { color: "blue", label: "Blue" },
  pink: { color: "pink", label: "Pink" },
  yellow: { color: "yellow", label: "Yellow" },
  green: { color: "green", label: "Green" },
  goldenrod: { color: "goldenrod", label: "Goldenrod" },
  buff: { color: "buff", label: "Buff" },
  salmon: { color: "salmon", label: "Salmon" },
  cherry: { color: "cherry", label: "Cherry" },
  tan: { color: "tan", label: "Tan" },
  gray: { color: "gray", label: "Gray" },
  ivory: { color: "ivory", label: "Ivory" },
  "double-white": { color: "double-white", label: "Double White" },
};
