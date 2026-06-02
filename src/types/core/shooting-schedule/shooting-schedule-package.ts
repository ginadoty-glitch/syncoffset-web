/**
 * SyncOffset Shooting Schedule Authority — export / distribution package
 *
 * Exported schedule files are packages — not the constitutional ShootingSchedule object (Rule 4).
 * Constitutional object: kind "shooting-schedule-package"
 *
 * @see docs/SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ShootingSchedulePackageKind, ShootingSchedulePackageStatus } from "./shooting-schedule-status";

export type ShootingSchedulePackage = AuditableCoreObject & {
  readonly kind: "shooting-schedule-package";
  readonly status: ShootingSchedulePackageStatus;
  readonly shootingScheduleId: ObjectId;
  readonly packageKind: ShootingSchedulePackageKind;
  readonly generatedAt: Timestamp;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
};
