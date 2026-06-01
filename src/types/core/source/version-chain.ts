/**
 * SyncOffset Source Ingestion — version chain and supersession
 *
 * Revisions create new documents; prior versions remain addressable.
 * No in-place overwrite of source files.
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { SourceDocumentKind } from "./source-document-kind";

/** Single node in an immutable version history chain. */
export type VersionChainEntry = {
  readonly documentId: ObjectId;
  readonly versionNumber: number;
  readonly versionLabel?: string;
  readonly recordedAt: Timestamp;
  readonly sourceDocumentKind: SourceDocumentKind;
};

/**
 * Supersession edges between immutable source documents.
 * supersededById points to the newer document that replaces this one for operational use.
 */
export type SupersededByRelationship = {
  readonly supersededById?: ObjectId;
  readonly supersedesDocumentId?: ObjectId;
};
