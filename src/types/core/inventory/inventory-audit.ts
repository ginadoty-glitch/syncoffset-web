/**
 * SyncOffset Inventory Authority — location inventory audit
 *
 * Constitutional object: kind "inventory-audit"
 *
 * @see docs/SYNCOFFSET_INVENTORY_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type InventoryAudit = AuditableCoreObject & {
  readonly kind: "inventory-audit";
  readonly locationId: ObjectId;
  readonly auditDate: string;
  readonly performedBy: string;
  readonly setId?: ObjectId;
  readonly setNumber?: string;
  readonly inventoryRecordIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
