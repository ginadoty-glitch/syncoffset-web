/**
 * SyncOffset Inventory Authority — generated inventory documentation only
 *
 * No workflow logic — package generation metadata only.
 * Constitutional object: kind "inventory-package"
 *
 * Distinct from Asset Authority `inventory-package` **package kind** on asset-package.
 *
 * @see docs/SYNCOFFSET_INVENTORY_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { InventoryPackageKind } from "./inventory-status";

export type InventoryPackage = AuditableCoreObject & {
  readonly kind: "inventory-package";
  readonly packageKind: InventoryPackageKind;
  readonly generatedAt: Timestamp;
  readonly inventoryRecordId?: ObjectId;
  readonly inventoryAuditId?: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
