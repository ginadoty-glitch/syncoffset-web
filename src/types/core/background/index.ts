/**
 * SyncOffset Background Performer Authority Layer — barrel export
 *
 * Three constitutional objects:
 *   BgRequirement      — production need (not a person)
 *   BackgroundPerformer — individual
 *   BgAssignment       — bridge between need and performer on a shoot day
 */

export type {
  BackgroundPerformer,
  BackgroundPerformerContact,
  BackgroundPerformerUnionStatus,
  BackgroundPerformerWardrobeSizes,
} from "./background-performer";
export type { BgAssignment } from "./bg-assignment";
export type { BgCategoryId, BgCategoryRegistryEntry } from "./bg-category";
export { BG_CATEGORY_REGISTRY, isBgCategoryId } from "./bg-category";
export type { BgCanonicalRelationshipPath, BgRelationshipPathStep } from "./bg-relationship-contracts";
export {
  BACKGROUND_PERFORMER_RELATIONSHIP_TARGETS,
  BG_CANONICAL_RELATIONSHIP_PATHS,
  BG_RELATIONSHIP_SCHEMA_REGISTRY,
} from "./bg-relationship-contracts";
export type { BgMakeupRequirement, BgRequirement, BgWardrobeRequirement } from "./bg-requirement";
export type {
  BackgroundPerformerAvailabilityStatus,
  BgAssignmentStatus,
  BgRequirementStatus,
} from "./bg-status";
