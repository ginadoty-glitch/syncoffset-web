/**
 * SyncOffset Cast Authority Layer — barrel export
 *
 * Four constitutional objects:
 *   Character       — scripted role (not a performer)
 *   CastRequirement — production need
 *   CastMember      — performer
 *   CastAssignment  — bridge to schedule
 */

export type { CastAssignment } from "./cast-assignment";
export type {
  CastAssignmentStatus,
  CastMemberAvailabilityStatus,
  CastMemberUnionStatus,
} from "./cast-contract-status";
export type { CastMember, CastMemberContact } from "./cast-member";
export {
  CAST_CANONICAL_RELATIONSHIP_PATHS,
  CAST_MEMBER_RELATIONSHIP_TARGETS,
  CAST_RELATIONSHIP_SCHEMA_REGISTRY,
  CHARACTER_RELATIONSHIP_TARGETS,
} from "./cast-relationship-contracts";
export type { CastRequirement } from "./cast-requirement";
export type { Character } from "./character";
export type { CharacterStatus } from "./character-status";
