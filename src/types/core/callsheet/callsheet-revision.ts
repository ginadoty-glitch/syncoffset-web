/**
 * SyncOffset Callsheet Authority — issued revision record
 *
 * Distinct from source `callsheet-revision` ingestion kind (immutable uploaded file).
 * Constitutional object: kind "callsheet-revision"
 *
 * @see docs/SYNCOFFSET_CALLSHEET_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CallsheetRevisionColor } from "./callsheet-status";

export type CallsheetRevision = AuditableCoreObject & {
  readonly kind: "callsheet-revision";
  readonly callsheetId: ObjectId;
  readonly revisionNumber: number;
  readonly revisionColor: CallsheetRevisionColor;
  readonly createdAt: Timestamp;
  readonly changeSummary: string;
  /** Optional link to immutable source document when a file was ingested (Article I). */
  readonly sourceDocumentId?: ObjectId;
};
