/**
 * SyncOffset Shoot Day Authority — shoot day assignment (participation record)
 *
 * Assignments document participation — they do not create ownership of scenes, assets, or people.
 * Constitutional kind: "shootday-assignment"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CoreObjectKind } from "../kinds";
import type { ShootDayAssignmentStatus } from "./shootday-status";

export type ShootDayAssignment = AuditableCoreObject & {
  readonly kind: "shootday-assignment";
  readonly assignmentStatus: ShootDayAssignmentStatus;
  readonly shootDayId: ObjectId;
  readonly targetKind: CoreObjectKind;
  readonly targetId: ObjectId;
  readonly notes: string;
};
