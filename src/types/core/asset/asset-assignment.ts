/**
 * SyncOffset Asset Authority — deployment of an asset
 *
 * Links set-bound assets to optional scene/day/location activity.
 * Constitutional kind: "asset-assignment"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { AssetAssignmentStatus } from "./asset-status";

export type AssetAssignment = AuditableCoreObject & {
  readonly kind: "asset-assignment";
  readonly status: AssetAssignmentStatus;
  readonly assetId: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly sceneId?: ObjectId;
  readonly shootDayId?: ObjectId;
  readonly locationId?: ObjectId;
  readonly assetInstanceId?: ObjectId;
  readonly shipmentId?: ObjectId;
  readonly transportOrderId?: ObjectId;
  readonly notes?: string;
};
