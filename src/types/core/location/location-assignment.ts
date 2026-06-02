/**
 * SyncOffset Location Authority — location assignment (location ↔ production activity)
 *
 * Links an approved location to shoot day and scene activity.
 * Constitutional kind: "location-assignment"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { LocationAssignmentStatus } from "./location-status";

export type LocationAssignment = AuditableCoreObject & {
  readonly kind: "location-assignment";
  readonly status: LocationAssignmentStatus;
  readonly locationId: ObjectId;
  readonly locationRequirementId?: ObjectId;
  readonly shootDayId: ObjectId;
  readonly sceneId?: ObjectId;
  readonly companyMoveId?: ObjectId;
  readonly notes?: string;
};
