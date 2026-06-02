/**
 * SyncOffset Shooting Schedule Authority — issued revision record
 *
 * Distinct from SourceDocumentKind "shoot-schedule" (immutable uploaded schedule file).
 * Constitutional object: kind "shooting-schedule-revision"
 *
 * @see docs/SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ShootingScheduleRevisionColor } from "./shooting-schedule-status";

export type ShootingScheduleRevision = AuditableCoreObject & {
  readonly kind: "shooting-schedule-revision";
  readonly shootingScheduleId: ObjectId;
  readonly revisionNumber: number;
  readonly revisionColor: ShootingScheduleRevisionColor;
  readonly createdAt: Timestamp;
  readonly changeSummary: string;
  /** Optional link to immutable source-document when a shoot-schedule file was ingested (Article I). */
  readonly sourceDocumentId?: ObjectId;
  readonly documentId?: ObjectId;
  readonly documentRevisionId?: ObjectId;
};
