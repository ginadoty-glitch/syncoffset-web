/**
 * SyncOffset Purchase Authority Layer — barrel export
 *
 * PurchaseOrder — production purchasing document
 * PurchaseLine — line item or service
 * PurchasePackage — generated purchasing documentation
 */

export type { PurchaseLine } from "./purchase-line";
export type { PurchaseOrder } from "./purchase-order";
export type { PurchasePackage } from "./purchase-package";
export {
  PURCHASE_CANONICAL_RELATIONSHIP_PATHS,
  PURCHASE_RELATIONSHIP_SCHEMA_REGISTRY,
  PURCHASE_RELATIONSHIP_TARGETS,
} from "./purchase-relationship-contracts";
export type {
  PurchaseOrderStatus,
  PurchaseOrderStatusDefinition,
  PurchasePackageKind,
  PurchasePackageKindDefinition,
  PurchasePackageStatus,
} from "./purchase-status";
export {
  PURCHASE_ORDER_STATUS_REGISTRY,
  PURCHASE_PACKAGE_KIND_REGISTRY,
} from "./purchase-status";
