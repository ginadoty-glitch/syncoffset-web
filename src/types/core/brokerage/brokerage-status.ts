/**
 * SyncOffset Brokerage Authority — lifecycle and package vocabulary (registry only)
 * @see docs/SYNCOFFSET_BROKERAGE_AUTHORITY.md
 */

export type BrokerageStatus =
  | "draft"
  | "review"
  | "pending-documents"
  | "submitted"
  | "under-review"
  | "cleared"
  | "partially-cleared"
  | "held"
  | "returned"
  | "cancelled";

export type BrokerageStatusDefinition = {
  readonly status: BrokerageStatus;
  readonly label: string;
};

export const BROKERAGE_STATUS_REGISTRY: Record<BrokerageStatus, BrokerageStatusDefinition> = {
  draft: { status: "draft", label: "Draft" },
  review: { status: "review", label: "Review" },
  "pending-documents": { status: "pending-documents", label: "Pending Documents" },
  submitted: { status: "submitted", label: "Submitted" },
  "under-review": { status: "under-review", label: "Under Review" },
  cleared: { status: "cleared", label: "Cleared" },
  "partially-cleared": { status: "partially-cleared", label: "Partially Cleared" },
  held: { status: "held", label: "Held" },
  returned: { status: "returned", label: "Returned" },
  cancelled: { status: "cancelled", label: "Cancelled" },
};

export type BrokeragePackageKind =
  | "commercial-invoice"
  | "broker-package"
  | "customs-package"
  | "export-package"
  | "import-package"
  | "clearance-package"
  | "return-package";

export type BrokeragePackageKindDefinition = {
  readonly kind: BrokeragePackageKind;
  readonly label: string;
};

export const BROKERAGE_PACKAGE_KIND_REGISTRY: Record<BrokeragePackageKind, BrokeragePackageKindDefinition> = {
  "commercial-invoice": { kind: "commercial-invoice", label: "Commercial Invoice" },
  "broker-package": { kind: "broker-package", label: "Broker Package" },
  "customs-package": { kind: "customs-package", label: "Customs Package" },
  "export-package": { kind: "export-package", label: "Export Package" },
  "import-package": { kind: "import-package", label: "Import Package" },
  "clearance-package": { kind: "clearance-package", label: "Clearance Package" },
  "return-package": { kind: "return-package", label: "Return Package" },
};

export type BrokeragePackageStatus = "draft" | "issued" | "superseded" | "archived";
