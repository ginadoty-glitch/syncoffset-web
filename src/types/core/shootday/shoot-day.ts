/**
 * SyncOffset Shoot Day Authority — shoot day (production execution anchor)
 *
 * Scene governs intent. Shoot Day governs reality.
 * Constitutional object: kind "shoot-day"
 *
 * @see docs/SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ShootDayStatus } from "./shootday-status";

export type ShootDay = AuditableCoreObject & {
  readonly kind: "shoot-day";
  readonly status: ShootDayStatus;
  readonly shootDayNumber: string;
  readonly shootDate: string;
  readonly notes: string;
  readonly shootDayAssignmentIds: ReadonlyArray<ObjectId>;
  readonly shootDayPackageIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
