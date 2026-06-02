/**
 * SyncOffset Purchase Authority — purchase package (generated purchasing documentation)
 *
 * Distinct from creative `department-package` — use `purchase-department-package` kind id.
 * Constitutional object: kind "purchase-package"
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { PurchasePackageKind, PurchasePackageStatus } from "./purchase-status";

export type PurchasePackage = AuditableCoreObject & {
  readonly kind: "purchase-package";
  readonly status: PurchasePackageStatus;
  readonly purchaseOrderId: ObjectId;
  readonly packageKind: PurchasePackageKind;
  readonly generatedAt: Timestamp;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
