/**
 * SyncOffset Asset Authority — lifecycle vocabulary (registry only, no behavior)
 * @see docs/SYNCOFFSET_ASSET_AUTHORITY.md
 */

export type AssetStatus =
  | "requested"
  | "quoted"
  | "approved"
  | "ordered"
  | "picked-up"
  | "in-transit"
  | "received"
  | "installed"
  | "on-set"
  | "wrapped"
  | "returned"
  | "lost"
  | "damaged"
  | "disposed";

export type AssetStatusDefinition = {
  readonly status: AssetStatus;
  readonly label: string;
};

export const ASSET_STATUS_REGISTRY: Record<AssetStatus, AssetStatusDefinition> = {
  requested: { status: "requested", label: "Requested" },
  quoted: { status: "quoted", label: "Quoted" },
  approved: { status: "approved", label: "Approved" },
  ordered: { status: "ordered", label: "Ordered" },
  "picked-up": { status: "picked-up", label: "Picked Up" },
  "in-transit": { status: "in-transit", label: "In Transit" },
  received: { status: "received", label: "Received" },
  installed: { status: "installed", label: "Installed" },
  "on-set": { status: "on-set", label: "On Set" },
  wrapped: { status: "wrapped", label: "Wrapped" },
  returned: { status: "returned", label: "Returned" },
  lost: { status: "lost", label: "Lost" },
  damaged: { status: "damaged", label: "Damaged" },
  disposed: { status: "disposed", label: "Disposed" },
};

export type AssetInstanceStatus = "available" | "assigned" | "in-transit" | "on-set" | "returned" | "lost" | "damaged";

export type AssetAssignmentStatus = "pending" | "confirmed" | "on-set" | "completed" | "cancelled";

export type AssetPackageStatus = "draft" | "issued" | "superseded" | "archived";

export type AssetPackageKind =
  | "asset-report"
  /** Asset inventory report — not Inventory Authority core kind `inventory-package`. */
  | "asset-inventory-report"
  | "prep-package"
  | "strike-package"
  | "return-package"
  | "custom";

export type AssetPackageKindDefinition = {
  readonly kind: AssetPackageKind;
  readonly label: string;
};

export const ASSET_PACKAGE_KIND_REGISTRY: Record<AssetPackageKind, AssetPackageKindDefinition> = {
  "asset-report": { kind: "asset-report", label: "Asset Report" },
  "asset-inventory-report": { kind: "asset-inventory-report", label: "Asset Inventory Report" },
  "prep-package": { kind: "prep-package", label: "Prep Package" },
  "strike-package": { kind: "strike-package", label: "Strike Package" },
  "return-package": { kind: "return-package", label: "Return Package" },
  custom: { kind: "custom", label: "Custom" },
};
