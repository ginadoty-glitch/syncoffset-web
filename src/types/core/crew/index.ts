/**
 * SyncOffset Crew Authority Layer — barrel export
 *
 * Four constitutional objects:
 *   Department       — organizational unit (owns crew)
 *   CrewRequirement  — labor need
 *   CrewMember       — person
 *   CrewAssignment   — bridge to shoot day / callsheet
 */

export type { CrewAssignment } from "./crew-assignment";
export type { CrewMember, CrewMemberContact } from "./crew-member";
export {
  CREW_CANONICAL_RELATIONSHIP_PATHS,
  CREW_MEMBER_RELATIONSHIP_TARGETS,
  CREW_RELATIONSHIP_SCHEMA_REGISTRY,
  DEPARTMENT_OWNERSHIP_TARGETS,
} from "./crew-relationship-contracts";
export type { CrewRequirement } from "./crew-requirement";
export type {
  CrewAssignmentStatus,
  CrewMemberAvailabilityStatus,
  CrewMemberUnionStatus,
  CrewRequirementStatus,
} from "./crew-status";
export type { Department } from "./department";
export type { ProductionDepartmentDefinition, ProductionDepartmentId } from "./department-registry";
export { isProductionDepartmentId, PRODUCTION_DEPARTMENT_REGISTRY } from "./department-registry";
