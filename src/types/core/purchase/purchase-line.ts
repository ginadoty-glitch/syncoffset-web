/**
 * SyncOffset Purchase Authority — purchase line (item or service on a PO)
 *
 * Constitutional object: kind "purchase-line"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type PurchaseLine = AuditableCoreObject & {
  readonly kind: "purchase-line";
  readonly purchaseOrderId: ObjectId;
  readonly description: string;
  readonly quantity: number;
  readonly unitCost: number;
  readonly notes: string;
  readonly assetId?: ObjectId;
  readonly budgetRequirementId?: ObjectId;
};
