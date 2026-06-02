/**
 * SyncOffset Shooting Schedule Authority — barrel export
 *
 * ShootingSchedule — what gets shot (scene ordering intent)
 * ShootingScheduleRevision — revision history (Rule 5)
 * ShootingSchedulePackage — exports / distribution bundles (Rule 4)
 */

export type { ShootingSchedule } from "./shooting-schedule";
export type { ShootingSchedulePackage } from "./shooting-schedule-package";
export {
  SHOOTING_SCHEDULE_CANONICAL_RELATIONSHIP_PATHS,
  SHOOTING_SCHEDULE_RELATIONSHIP_SCHEMA_REGISTRY,
  SHOOTING_SCHEDULE_RELATIONSHIP_TARGETS,
} from "./shooting-schedule-relationship-contracts";
export type { ShootingScheduleRevision } from "./shooting-schedule-revision";
export type {
  ShootingSchedulePackageKind,
  ShootingSchedulePackageStatus,
  ShootingScheduleRevisionColor,
  ShootingScheduleStatus,
} from "./shooting-schedule-status";
export {
  SHOOTING_SCHEDULE_PACKAGE_KIND_REGISTRY,
  SHOOTING_SCHEDULE_REVISION_COLOR_REGISTRY,
  SHOOTING_SCHEDULE_STATUS_REGISTRY,
} from "./shooting-schedule-status";
