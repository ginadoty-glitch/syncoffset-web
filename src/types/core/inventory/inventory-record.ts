/**
 * SyncOffset Inventory Authority — possession record for an asset
 *
 * Rule 1 — Asset stores identity; Inventory stores possession.
 * Rule 3 — always traceable to Set via setId and setNumber.
 *
 * Constitutional object: kind "inventory-record"
 *
 * @see docs/SYNCOFFSET_INVENTORY_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { InventoryCondition, InventoryStatus } from "./inventory-status";

export type InventoryRecord = AuditableCoreObject & {
  readonly kind: "inventory-record";
  readonly assetId: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly locationId: ObjectId;
  readonly quantity: number;
  readonly conditionId: InventoryCondition;
  readonly statusId: InventoryStatus;
  readonly inventoryMovementIds: ReadonlyArray<ObjectId>;
  readonly inventoryAuditIds: ReadonlyArray<ObjectId>;
  readonly inventoryPackageIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
