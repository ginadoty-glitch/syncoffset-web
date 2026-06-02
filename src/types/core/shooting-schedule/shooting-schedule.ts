/**
 * SyncOffset Shooting Schedule Authority — approved scene ordering (what gets shot)
 *
 * Constitutional object: kind "shooting-schedule"
 * Distinct from Article I ingestion kind "shoot-schedule" (immutable uploaded file).
 *
 * Not a stripboard, scheduling engine, or Production Calendar (when production operates).
 *
 * @see docs/SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ShootingScheduleRevisionColor, ShootingScheduleStatus } from "./shooting-schedule-status";

export type ShootingSchedule = AuditableCoreObject & {
  readonly kind: "shooting-schedule";
  readonly status: ShootingScheduleStatus;
  readonly showId: ObjectId;
  readonly scheduleName: string;
  readonly revisionNumber: number;
  readonly revisionColor: ShootingScheduleRevisionColor;
  readonly scriptRevisionId: ObjectId;
  readonly notes: string;
  readonly sceneIds: ReadonlyArray<ObjectId>;
  readonly shootingScheduleRevisionIds: ReadonlyArray<ObjectId>;
  readonly shootingSchedulePackageIds: ReadonlyArray<ObjectId>;
  readonly productionCalendarIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
