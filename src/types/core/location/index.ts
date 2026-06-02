/**
 * SyncOffset Location Authority Layer — barrel export
 *
 * Location — physical filming or production site
 * LocationRequirement — need from script/breakdown/package
 * LocationPackage — approved location documentation
 * LocationAssignment — location linked to shoot day activity
 */

export type { Location, LocationAddress } from "./location";
export type { LocationAssignment } from "./location-assignment";
export type { LocationPackage } from "./location-package";
export {
  LOCATION_CANONICAL_RELATIONSHIP_PATHS,
  LOCATION_RELATIONSHIP_SCHEMA_REGISTRY,
  LOCATION_RELATIONSHIP_TARGETS,
} from "./location-relationship-contracts";
export type { LocationRequirement } from "./location-requirement";
export type {
  LocationAssignmentStatus,
  LocationPackageStatus,
  LocationRequirementStatus,
  LocationStatus,
  LocationTypeDefinition,
  LocationTypeId,
} from "./location-status";
export { LOCATION_TYPE_REGISTRY } from "./location-status";
