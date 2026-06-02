/**
 * SyncOffset Asset Authority — tracked unit of an asset
 *
 * Example: Asset "Police Desk" → instances Desk A, Desk B, Desk C
 * Constitutional object: kind "asset-instance"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { AssetInstanceStatus } from "./asset-status";

export type AssetInstance = AuditableCoreObject & {
  readonly kind: "asset-instance";
  readonly status: AssetInstanceStatus;
  readonly assetId: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly instanceLabel: string;
  readonly serialNumber?: string;
  readonly locationId?: ObjectId;
  readonly vendorId?: ObjectId;
  readonly notes?: string;
};
