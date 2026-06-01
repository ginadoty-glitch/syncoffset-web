/**
 * SyncOffset Source Ingestion — barrel export
 */

export type {
  ImmutableSourceDocument,
  ImmutableSourceMetadata,
  SourceDocumentStatus,
} from "./immutable-source-document";
export type { ExtractionTargetKind, SourceIngestionRegistryEntry } from "./ingestion-registry";
export { SOURCE_INGESTION_REGISTRY } from "./ingestion-registry";
export type { RecordProvenance, SourceIngestionProvenance, SourceSystem } from "./provenance";
export type { SourceDocumentKind } from "./source-document-kind";
export type {
  BreakdownPackageSourceDocument,
  CallsheetRevisionSourceDocument,
  CastListSourceDocument,
  CrewListSourceDocument,
  DoodSourceDocument,
  LocationPackageSourceDocument,
  OneLinerSourceDocument,
  PermitSourceDocument,
  ReferenceMediaSourceDocument,
  ScriptRevisionSourceDocument,
  ShootScheduleSourceDocument,
  SourceDocument,
  SourceDocumentByKind,
  VendorDocumentSourceDocument,
} from "./source-documents";
export { isSourceDocumentKind } from "./source-documents";
export type { SourceFileMimeCategory, SourceFileReference } from "./source-file";
export type { SupersededByRelationship, VersionChainEntry } from "./version-chain";
