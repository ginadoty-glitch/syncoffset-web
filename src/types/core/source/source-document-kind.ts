/**
 * SyncOffset Source Ingestion — canonical source document kinds
 *
 * Distinct from Document Authority: ingestion persists as kind `source-document`
 * with a SourceDocumentKind discriminator — logical records use kind `document`.
 *
 * @see docs/SYNCOFFSET_CORE_OBJECT_REGISTRY.md — Document (immutable)
 */

export type SourceDocumentKind =
  | "script-revision"
  /** Immutable uploaded schedule file — constitutional object is core kind `shooting-schedule` (Shooting Schedule Authority). */
  | "shoot-schedule"
  | "one-liner"
  /** Immutable uploaded callsheet file — distinct from core `callsheet-revision` object (Callsheet Authority). */
  | "callsheet-revision"
  | "breakdown-package"
  | "location-package"
  | "crew-list"
  | "cast-list"
  | "dood"
  | "vendor-document"
  | "permit"
  | "reference-media";
