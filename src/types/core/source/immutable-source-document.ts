/**
 * SyncOffset Source Ingestion — immutable source document base
 *
 * Article I: source documents are never overwritten.
 * All platform source types extend this contract + AuditableCoreObject fields.
 * Persists as CoreObjectKind `source-document` — resolves to Document Authority via DocumentRevision.
 *
 * Note: operations/callsheet-revision.ts models issued operational scheduling
 * records derived from sources — not this ingestion layer.
 */

import type { ObjectId, RefCode, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject, CoreObjectStatus } from "../base";
import type { SourceIngestionProvenance } from "./provenance";
import type { SourceDocumentKind } from "./source-document-kind";
import type { SourceFileReference } from "./source-file";
import type { SupersededByRelationship, VersionChainEntry } from "./version-chain";

/** Lifecycle for immutable sources — no "draft" edits after receipt. */
export type SourceDocumentStatus = Extract<CoreObjectStatus, "draft" | "active" | "issued" | "superseded" | "archived">;

/**
 * Metadata fixed at ingestion; never mutated after status becomes "issued".
 */
export type ImmutableSourceMetadata = {
  readonly isImmutable: true;
  readonly originalFileName: string;
  readonly uploadedAt: Timestamp;
  readonly uploadedBy: string;
  readonly author?: string;
  readonly title?: string;
  readonly ref?: RefCode;
  /**
   * Extraction runs append here; extraction does not replace the source file.
   * Future table: source_extraction_history (append-only).
   */
  readonly extractionHistoryIds: ReadonlyArray<ObjectId>;
};

/**
 * Base contract for every immutable production source document.
 */
export type ImmutableSourceDocument = AuditableCoreObject & {
  readonly kind: "source-document";
  readonly sourceDocumentKind: SourceDocumentKind;
  readonly status: SourceDocumentStatus;
  readonly immutable: ImmutableSourceMetadata;
  readonly sourceFile: SourceFileReference;
  readonly versionChain: ReadonlyArray<VersionChainEntry>;
  readonly supersession: SupersededByRelationship;
  readonly ingestion: SourceIngestionProvenance;
};
