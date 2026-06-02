/**
 * SyncOffset Purchase Authority — lifecycle vocabulary (registry only, no behavior)
 * @see docs/SYNCOFFSET_PURCHASE_AUTHORITY.md
 */

export type PurchaseOrderStatus =
  | "draft"
  | "quoted"
  | "approved"
  | "issued"
  | "partially-received"
  | "received"
  | "closed"
  | "cancelled";

export type PurchaseOrderStatusDefinition = {
  readonly status: PurchaseOrderStatus;
  readonly label: string;
};

export const PURCHASE_ORDER_STATUS_REGISTRY: Record<PurchaseOrderStatus, PurchaseOrderStatusDefinition> = {
  draft: { status: "draft", label: "Draft" },
  quoted: { status: "quoted", label: "Quoted" },
  approved: { status: "approved", label: "Approved" },
  issued: { status: "issued", label: "Issued" },
  "partially-received": { status: "partially-received", label: "Partially Received" },
  received: { status: "received", label: "Received" },
  closed: { status: "closed", label: "Closed" },
  cancelled: { status: "cancelled", label: "Cancelled" },
};

export type PurchasePackageStatus = "draft" | "issued" | "superseded" | "archived";

export type PurchasePackageKind =
  | "purchase-summary"
  | "vendor-package"
  | "buyer-package"
  | "purchase-department-package"
  | "receiving-package"
  | "custom";

export type PurchasePackageKindDefinition = {
  readonly kind: PurchasePackageKind;
  readonly label: string;
};

export const PURCHASE_PACKAGE_KIND_REGISTRY: Record<PurchasePackageKind, PurchasePackageKindDefinition> = {
  "purchase-summary": { kind: "purchase-summary", label: "Purchase Summary" },
  "vendor-package": { kind: "vendor-package", label: "Vendor Package" },
  "buyer-package": { kind: "buyer-package", label: "Buyer Package" },
  "purchase-department-package": {
    kind: "purchase-department-package",
    label: "Department Package",
  },
  "receiving-package": {
    kind: "receiving-package",
    label: "Receiving Package",
  },
  custom: { kind: "custom", label: "Custom" },
};
