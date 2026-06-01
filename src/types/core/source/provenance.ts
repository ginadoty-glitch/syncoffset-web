/**
 * SyncOffset Source Ingestion — Provenance contracts
 *
 * Article I / VI: generated records and outputs must trace to immutable sources.
 * Article IV: ingestion preserves origin system and import actor.
 *
 * @see docs/SYNCOFFSET_DATA_CONSTITUTION.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";

/** External production systems that may supply source files. */
export type SourceSystem =
  | "scriptation"
  | "scenechronize"
  | "movie-magic-scheduling"
  | "ep-scheduling"
  | "studiobinder"
  | "excel"
  | "pdf"
  | "manual-upload";

/**
 * Provenance attached to immutable source documents at ingestion time.
 * Self-referential: sourceDocumentId is the document's own id once persisted.
 */
export type SourceIngestionProvenance = {
  readonly sourceDocumentId: ObjectId;
  readonly sourceDocumentIds?: ReadonlyArray<ObjectId>;
  readonly sourceSystem: SourceSystem;
  readonly sourceVersion: string;
  readonly importedAt: Timestamp;
  readonly importedBy: string;
};

/**
 * Provenance for extracted core objects and generated outputs.
 * Links operational records back to one or more immutable sources.
 */
export type RecordProvenance = {
  readonly sourceDocumentId: ObjectId;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly sourceSystem: SourceSystem;
  readonly sourceVersion: string;
  readonly importedAt: Timestamp;
  readonly importedBy: string;
  /** Core object IDs produced by extraction (e.g. shoot-day, scene). */
  readonly sourceRecordIds?: ReadonlyArray<ObjectId>;
};

/**
 * Alias for output-specific provenance — same shape, semantic clarity at call sites.
 */
export type GeneratedOutputProvenance = RecordProvenance;
