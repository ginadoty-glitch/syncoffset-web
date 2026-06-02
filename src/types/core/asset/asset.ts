/**
 * SyncOffset Asset Authority — production item on a set
 *
 * Assets belong to Sets — not Scenes. Sets support Scenes.
 * Constitutional object: kind "asset"
 *
 * @see docs/SYNCOFFSET_ASSET_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { AssetCategoryId } from "./asset-category";
import type { AssetStatus } from "./asset-status";

export type Asset = AuditableCoreObject & {
  readonly kind: "asset";
  readonly status: AssetStatus;
  readonly assetNumber: string;
  readonly assetName: string;
  readonly categoryId: AssetCategoryId;
  readonly customCategoryLabel?: string;
  readonly departmentId: ObjectId;
  readonly setId: ObjectId;
  /** Constitutional set-number trace — mirrors ProductionSet.setNumber */
  readonly setNumber: string;
  readonly notes: string;
  readonly assetInstanceIds: ReadonlyArray<ObjectId>;
  readonly assetAssignmentIds: ReadonlyArray<ObjectId>;
  readonly assetPackageIds: ReadonlyArray<ObjectId>;
  readonly budgetRequirementId?: ObjectId;
  readonly breakdownElementId?: ObjectId;
  readonly vendorIds: ReadonlyArray<ObjectId>;
  readonly purchaseOrderIds: ReadonlyArray<ObjectId>;
  readonly purchaseLineIds: ReadonlyArray<ObjectId>;
  readonly shipmentIds: ReadonlyArray<ObjectId>;
  readonly returnIds: ReadonlyArray<ObjectId>;
};
