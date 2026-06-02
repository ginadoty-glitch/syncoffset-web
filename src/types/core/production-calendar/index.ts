/**
 * SyncOffset Production Calendar Authority — barrel export
 *
 * ProductionCalendar — master planning calendar for a show
 * CalendarDay — single production date (may exist without Shoot Day)
 * CalendarRevision — revision history (Rule 5)
 * CalendarPackage — approved calendar exports
 */

export type { CalendarDay } from "./calendar-day";
export type { CalendarDayType, CalendarDayTypeDefinition } from "./calendar-day-type";
export { CALENDAR_DAY_TYPE_REGISTRY } from "./calendar-day-type";
export type { CalendarPackage } from "./calendar-package";
export type { CalendarRevision } from "./calendar-revision";
export type { CalendarRevisionColor, CalendarRevisionColorDefinition } from "./calendar-revision-colors";
export { CALENDAR_REVISION_COLOR_REGISTRY } from "./calendar-revision-colors";
export type {
  CalendarPackageKind,
  CalendarPackageStatus,
  ProductionCalendarStatus,
} from "./calendar-status";
export {
  CALENDAR_PACKAGE_KIND_REGISTRY,
  PRODUCTION_CALENDAR_STATUS_REGISTRY,
} from "./calendar-status";
export type { ProductionCalendar } from "./production-calendar";
export {
  PRODUCTION_CALENDAR_CANONICAL_RELATIONSHIP_PATHS,
  PRODUCTION_CALENDAR_RELATIONSHIP_SCHEMA_REGISTRY,
  PRODUCTION_CALENDAR_RELATIONSHIP_TARGETS,
} from "./production-calendar-relationship-contracts";
