/**
 * SyncOffset Purchase Authority — purchase order (production purchasing document)
 *
 * Bridge between planning (budget) and execution (vendor, asset, shipment).
 * A Purchase Order may exist without an Asset.
 *
 * Constitutional object: kind "purchase-order"
 * @see docs/SYNCOFFSET_PURCHASE_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { PurchaseOrderStatus } from "./purchase-status";

export type PurchaseOrder = AuditableCoreObject & {
  readonly kind: "purchase-order";
  readonly status: PurchaseOrderStatus;
  readonly purchaseOrderNumber: string;
  readonly showCode: string;
  readonly departmentId: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly vendorId: ObjectId;
  readonly budgetRequirementId: ObjectId;
  readonly notes: string;
  readonly purchaseLineIds: ReadonlyArray<ObjectId>;
  readonly purchasePackageIds: ReadonlyArray<ObjectId>;
  readonly shipmentIds: ReadonlyArray<ObjectId>;
  readonly returnIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
