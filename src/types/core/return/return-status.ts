/**
 * SyncOffset Return Authority — lifecycle and package vocabulary (registry only)
 * @see docs/SYNCOFFSET_RETURN_AUTHORITY.md
 */

export type ReturnStatus =
  | "draft"
  | "scheduled"
  | "picked"
  | "loaded"
  | "in-transit"
  | "returned"
  | "partially-returned"
  | "closed"
  | "cancelled"
  | "lost"
  | "damaged";

export type ReturnStatusDefinition = {
  readonly status: ReturnStatus;
  readonly label: string;
};

export const RETURN_STATUS_REGISTRY: Record<ReturnStatus, ReturnStatusDefinition> = {
  draft: { status: "draft", label: "Draft" },
  scheduled: { status: "scheduled", label: "Scheduled" },
  picked: { status: "picked", label: "Picked" },
  loaded: { status: "loaded", label: "Loaded" },
  "in-transit": { status: "in-transit", label: "In Transit" },
  returned: { status: "returned", label: "Returned" },
  "partially-returned": { status: "partially-returned", label: "Partially Returned" },
  closed: { status: "closed", label: "Closed" },
  cancelled: { status: "cancelled", label: "Cancelled" },
  lost: { status: "lost", label: "Lost" },
  damaged: { status: "damaged", label: "Damaged" },
};

export type ReturnPackageKind =
  | "return-package"
  | "vendor-return-package"
  | "closeout-package"
  | "strike-package"
  | "damage-package";

export type ReturnPackageKindDefinition = {
  readonly kind: ReturnPackageKind;
  readonly label: string;
};

export const RETURN_PACKAGE_KIND_REGISTRY: Record<ReturnPackageKind, ReturnPackageKindDefinition> = {
  "return-package": { kind: "return-package", label: "Return Package" },
  "vendor-return-package": { kind: "vendor-return-package", label: "Vendor Return Package" },
  "closeout-package": { kind: "closeout-package", label: "Closeout Package" },
  "strike-package": { kind: "strike-package", label: "Strike Package" },
  "damage-package": { kind: "damage-package", label: "Damage Package" },
};

export type ReturnPackageStatus = "draft" | "issued" | "superseded" | "archived";
