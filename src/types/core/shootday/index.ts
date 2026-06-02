/**
 * SyncOffset Shoot Day Authority Layer — barrel export (v1.0 constitutional)
 *
 * Supersedes legacy `src/types/core/services/shootday*` service contracts for core object shape.
 * Service interfaces remain deprecated under `services/` for migration reference.
 */

export type { ShootDay } from "./shoot-day";
export type { ShootDayAssignment } from "./shootday-assignment";
export type { ShootDayPackage } from "./shootday-package";
export {
  SHOOTDAY_CANONICAL_RELATIONSHIP_PATHS,
  SHOOTDAY_RELATIONSHIP_SCHEMA_REGISTRY,
  SHOOTDAY_RELATIONSHIP_TARGETS,
} from "./shootday-relationship-contracts";
export type {
  ShootDayAssignmentStatus,
  ShootDayPackageKind,
  ShootDayPackageKindDefinition,
  ShootDayPackageStatus,
  ShootDayStatus,
  ShootDayStatusDefinition,
} from "./shootday-status";
export { SHOOTDAY_PACKAGE_KIND_REGISTRY, SHOOTDAY_STATUS_REGISTRY } from "./shootday-status";
