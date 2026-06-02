/**
 * SyncOffset Production Calendar Authority — approved calendar export package
 *
 * Constitutional object: kind "calendar-package"
 *
 * @see docs/SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CalendarPackageKind, CalendarPackageStatus } from "./calendar-status";

export type CalendarPackage = AuditableCoreObject & {
  readonly kind: "calendar-package";
  readonly status: CalendarPackageStatus;
  readonly calendarId: ObjectId;
  readonly packageKind: CalendarPackageKind;
  readonly generatedAt: Timestamp;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
