/**
 * SyncOffset Production Calendar Authority — calendar day operation types (registry only)
 *
 * Describes what production does on a date — not workflow state.
 * A Calendar Day is not necessarily a Shoot Day (Rule 3).
 *
 * @see docs/SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md
 */

export type CalendarDayType =
  | "prep"
  | "shoot"
  | "wrap"
  | "travel"
  | "company-move"
  | "holiday"
  | "dark-day"
  | "weather-hold"
  | "construction"
  | "strike"
  | "pickup"
  | "reshoot"
  | "tech-scout"
  | "camera-test"
  | "custom";

export type CalendarDayTypeDefinition = {
  readonly dayType: CalendarDayType;
  readonly label: string;
  readonly description: string;
};

export const CALENDAR_DAY_TYPE_REGISTRY: Record<CalendarDayType, CalendarDayTypeDefinition> = {
  prep: {
    dayType: "prep",
    label: "Prep",
    description: "Department or stage prep before principal photography.",
  },
  shoot: {
    dayType: "shoot",
    label: "Shoot",
    description: "Principal photography day — may generate a Shoot Day when executed.",
  },
  wrap: {
    dayType: "wrap",
    label: "Wrap",
    description: "Wrap activities for a unit, stage, or show segment.",
  },
  travel: {
    dayType: "travel",
    label: "Travel",
    description: "Company travel between bases or locations — no shoot day required.",
  },
  "company-move": {
    dayType: "company-move",
    label: "Company Move",
    description: "Production company move day — distinct from location company-move object.",
  },
  holiday: {
    dayType: "holiday",
    label: "Holiday",
    description: "Scheduled holiday — production does not operate.",
  },
  "dark-day": {
    dayType: "dark-day",
    label: "Dark Day",
    description: "Scheduled off day with no production activity.",
  },
  "weather-hold": {
    dayType: "weather-hold",
    label: "Weather Hold",
    description: "Hold for weather — planning placeholder without execution.",
  },
  construction: {
    dayType: "construction",
    label: "Construction",
    description: "Set or location construction — no shoot day required.",
  },
  strike: {
    dayType: "strike",
    label: "Strike",
    description: "Strike or teardown day for sets or locations.",
  },
  pickup: {
    dayType: "pickup",
    label: "Pickup",
    description: "Pickup shots scheduled on the master calendar.",
  },
  reshoot: {
    dayType: "reshoot",
    label: "Reshoot",
    description: "Additional photography day for previously shot material.",
  },
  "tech-scout": {
    dayType: "tech-scout",
    label: "Tech Scout",
    description: "Technical scout — planning only.",
  },
  "camera-test": {
    dayType: "camera-test",
    label: "Camera Test",
    description: "Camera or lens test day.",
  },
  custom: {
    dayType: "custom",
    label: "Custom",
    description: "Production-defined day type — label in notes.",
  },
};
