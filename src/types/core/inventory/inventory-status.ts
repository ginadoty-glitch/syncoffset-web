/**
 * SyncOffset Inventory Authority — status, condition, and package vocabulary (registry only)
 *
 * Rule 2 — location, quantity, condition, availability belong here, not Asset Authority.
 *
 * @see docs/SYNCOFFSET_INVENTORY_AUTHORITY.md
 */

export type InventoryStatus =
  | "in-stock"
  | "allocated"
  | "on-set"
  | "in-transit"
  | "checked-out"
  | "missing"
  | "damaged"
  | "retired";

export type InventoryStatusDefinition = {
  readonly statusId: InventoryStatus;
  readonly label: string;
};

export const INVENTORY_STATUS_REGISTRY: Record<InventoryStatus, InventoryStatusDefinition> = {
  "in-stock": { statusId: "in-stock", label: "In Stock" },
  allocated: { statusId: "allocated", label: "Allocated" },
  "on-set": { statusId: "on-set", label: "On Set" },
  "in-transit": { statusId: "in-transit", label: "In Transit" },
  "checked-out": { statusId: "checked-out", label: "Checked Out" },
  missing: { statusId: "missing", label: "Missing" },
  damaged: { statusId: "damaged", label: "Damaged" },
  retired: { statusId: "retired", label: "Retired" },
};

export type InventoryCondition = "new" | "excellent" | "good" | "fair" | "poor" | "damaged" | "unserviceable";

export type InventoryConditionDefinition = {
  readonly conditionId: InventoryCondition;
  readonly label: string;
};

export const INVENTORY_CONDITION_REGISTRY: Record<InventoryCondition, InventoryConditionDefinition> = {
  new: { conditionId: "new", label: "New" },
  excellent: { conditionId: "excellent", label: "Excellent" },
  good: { conditionId: "good", label: "Good" },
  fair: { conditionId: "fair", label: "Fair" },
  poor: { conditionId: "poor", label: "Poor" },
  damaged: { conditionId: "damaged", label: "Damaged" },
  unserviceable: { conditionId: "unserviceable", label: "Unserviceable" },
};

export type InventoryPackageKind =
  | "inventory-report-package"
  | "audit-package"
  | "movement-history-package"
  | "availability-package"
  | "set-inventory-package";

export type InventoryPackageKindDefinition = {
  readonly packageKind: InventoryPackageKind;
  readonly label: string;
};

export const INVENTORY_PACKAGE_KIND_REGISTRY: Record<InventoryPackageKind, InventoryPackageKindDefinition> = {
  "inventory-report-package": {
    packageKind: "inventory-report-package",
    label: "Inventory Report Package",
  },
  "audit-package": { packageKind: "audit-package", label: "Audit Package" },
  "movement-history-package": {
    packageKind: "movement-history-package",
    label: "Movement History Package",
  },
  "availability-package": { packageKind: "availability-package", label: "Availability Package" },
  "set-inventory-package": { packageKind: "set-inventory-package", label: "Set Inventory Package" },
};
