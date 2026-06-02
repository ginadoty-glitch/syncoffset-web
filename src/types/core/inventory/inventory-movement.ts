/**
 * SyncOffset Inventory Authority — immutable movement provenance
 *
 * Rule 4 — movement history is immutable provenance (append-only semantics at service layer).
 * Constitutional object: kind "inventory-movement"
 *
 * @see docs/SYNCOFFSET_INVENTORY_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type InventoryMovement = AuditableCoreObject & {
  readonly kind: "inventory-movement";
  readonly assetId: ObjectId;
  readonly inventoryRecordId: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly fromLocationId: ObjectId;
  readonly toLocationId: ObjectId;
  readonly timestamp: Timestamp;
  readonly transportOrderId?: ObjectId;
  readonly shipmentId?: ObjectId;
  readonly quantity: number;
  readonly notes?: string;
};
