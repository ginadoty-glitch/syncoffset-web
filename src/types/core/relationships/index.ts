/**
 * SyncOffset Relationship Graph — barrel export
 *
 * Objects remain authoritative (AuditableCoreObject).
 * PlatformRelationship edges connect objects without duplicating data.
 * Relationships are never source-of-truth.
 */

export type {
  RelationshipDirection,
  RelationshipOrientation,
  RelationshipPerspective,
  RelationshipTraversal,
} from "./relationship-direction";
export type {
  PlatformRelationship,
  RelationshipEndpoint,
  RelationshipNodeKind,
} from "./relationship-edge";
export type { RelationshipKind, RelationshipKindDefinition } from "./relationship-kind";
export { isRelationshipKind, RELATIONSHIP_KIND_REGISTRY } from "./relationship-kind";
export type {
  CanonicalRelationshipPath,
  RelationshipPathId,
  RelationshipPathStep,
} from "./relationship-path";
export { CANONICAL_RELATIONSHIP_PATHS, getCanonicalRelationshipPath } from "./relationship-path";
export type {
  AssetsBySceneQuery,
  AuthorityRecordsByGeneratedOutputQuery,
  CastBySceneQuery,
  CompanyMovesByShootDayQuery,
  GeneratedOutputsByCallsheetRevisionQuery,
  GeneratedOutputsBySourceDocumentQuery,
  LocationsByShootDayQuery,
  MediaAssetsByLocationQuery,
  MediaByShootDayQuery,
  PermitsByLocationQuery,
  RelationshipQuery,
  RelationshipQueryBase,
  RelationshipQueryResult,
  RelationshipQueryService,
  ScenesByLocationQuery,
  ScenesByShootDayQuery,
  ShootDaysByLocationQuery,
} from "./relationship-query";
export { isRelationshipQueryType } from "./relationship-query";
export type { RelationshipSchemaEntry } from "./relationship-schema-registry";
export { RELATIONSHIP_SCHEMA_REGISTRY } from "./relationship-schema-registry";
export type { RelationshipStrength, RelationshipStrengthDefinition } from "./relationship-strength";
export {
  RELATIONSHIP_STRENGTH_ORDER,
  RELATIONSHIP_STRENGTH_REGISTRY,
} from "./relationship-strength";
