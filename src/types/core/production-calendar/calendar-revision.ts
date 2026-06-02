/**
 * SyncOffset Production Calendar Authority — calendar revision record
 *
 * Supports multiple revisions per calendar (Rule 5).
 * Constitutional object: kind "calendar-revision"
 *
 * @see docs/SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CalendarRevisionColor } from "./calendar-revision-colors";

export type CalendarRevision = AuditableCoreObject & {
  readonly kind: "calendar-revision";
  readonly calendarId: ObjectId;
  readonly revisionNumber: number;
  readonly revisionColor: CalendarRevisionColor;
  readonly createdAt: Timestamp;
  readonly changeSummary: string;
};
