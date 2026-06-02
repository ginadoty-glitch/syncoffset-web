/**
 * SyncOffset Document Authority — immutable revision history (Rule 3)
 *
 * Distinct from core `callsheet-revision` and SourceDocumentKind `callsheet-revision`.
 * Constitutional object: kind "document-revision"
 *
 * @see docs/SYNCOFFSET_DOCUMENT_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CalendarRevisionColor } from "../production-calendar/calendar-revision-colors";

export type DocumentRevision = AuditableCoreObject & {
  readonly kind: "document-revision";
  readonly documentId: ObjectId;
  readonly revisionNumber: number;
  readonly revisionColor?: CalendarRevisionColor;
  readonly createdAt: Timestamp;
  readonly createdBy: string;
  /** Link to Article I `source-document` ingestion record when uploaded from file. */
  readonly sourceDocumentId?: ObjectId;
};
