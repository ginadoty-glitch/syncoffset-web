/**
 * SyncOffset Inventory Authority — barrel export
 *
 * InventoryRecord — possession (location, quantity, condition, availability)
 * InventoryMovement — immutable movement provenance
 * InventoryAudit — location audit
 * InventoryPackage — generated documentation only
 */

export type { InventoryAudit } from "./inventory-audit";
export type { InventoryMovement } from "./inventory-movement";
export type { InventoryPackage } from "./inventory-package";
export type { InventoryRecord } from "./inventory-record";
export {
  INVENTORY_CANONICAL_RELATIONSHIP_PATHS,
  INVENTORY_RELATIONSHIP_SCHEMA_REGISTRY,
  INVENTORY_RELATIONSHIP_TARGETS,
} from "./inventory-relationship-contracts";
export type { InventoryCondition, InventoryPackageKind, InventoryStatus } from "./inventory-status";
export {
  INVENTORY_CONDITION_REGISTRY,
  INVENTORY_PACKAGE_KIND_REGISTRY,
  INVENTORY_STATUS_REGISTRY,
} from "./inventory-status";
