/**
 * SyncOffset Source Ingestion — canonical source document kinds
 *
 * Distinct from CoreObjectKind: all sources persist as kind "document"
 * with a SourceDocumentKind discriminator.
 *
 * @see docs/SYNCOFFSET_CORE_OBJECT_REGISTRY.md — Document (immutable)
 */

export type SourceDocumentKind =
  | "script-revision"
  | "shoot-schedule"
  | "one-liner"
  | "callsheet-revision"
  | "breakdown-package"
  | "location-package"
  | "crew-list"
  | "cast-list"
  | "dood"
  | "vendor-document"
  | "permit"
  | "reference-media";
