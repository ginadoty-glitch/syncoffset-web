/**
 * SyncOffset Shoot Day Authority — shoot day package (approved execution documentation)
 *
 * `packageKind` `department-package` is shoot-day documentation — not creative `department-package` core object.
 * Constitutional object: kind "shootday-package"
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ShootDayPackageKind, ShootDayPackageStatus } from "./shootday-status";

export type ShootDayPackage = AuditableCoreObject & {
  readonly kind: "shootday-package";
  readonly status: ShootDayPackageStatus;
  readonly shootDayId: ObjectId;
  readonly packageKind: ShootDayPackageKind;
  readonly generatedAt: Timestamp;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
