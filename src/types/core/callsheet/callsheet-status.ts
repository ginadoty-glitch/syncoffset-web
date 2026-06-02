/**
 * SyncOffset Callsheet Authority — lifecycle, distribution, and package vocabulary (registry only)
 * @see docs/SYNCOFFSET_CALLSHEET_AUTHORITY.md
 */

export type CallsheetStatus = "draft" | "review" | "approved" | "issued" | "revised" | "superseded" | "archived";

export type CallsheetStatusDefinition = {
  readonly status: CallsheetStatus;
  readonly label: string;
};

export const CALLSHEET_STATUS_REGISTRY: Record<CallsheetStatus, CallsheetStatusDefinition> = {
  draft: { status: "draft", label: "Draft" },
  review: { status: "review", label: "Review" },
  approved: { status: "approved", label: "Approved" },
  issued: { status: "issued", label: "Issued" },
  revised: { status: "revised", label: "Revised" },
  superseded: { status: "superseded", label: "Superseded" },
  archived: { status: "archived", label: "Archived" },
};

export type CallsheetDistributionMethod = "email" | "sms" | "mobile-app" | "download" | "print" | "custom";

export type CallsheetDistributionMethodDefinition = {
  readonly method: CallsheetDistributionMethod;
  readonly label: string;
};

export const CALLSHEET_DISTRIBUTION_METHOD_REGISTRY: Record<
  CallsheetDistributionMethod,
  CallsheetDistributionMethodDefinition
> = {
  email: { method: "email", label: "Email" },
  sms: { method: "sms", label: "SMS" },
  "mobile-app": { method: "mobile-app", label: "Mobile App" },
  download: { method: "download", label: "Download" },
  print: { method: "print", label: "Print" },
  custom: { method: "custom", label: "Custom" },
};

export type CallsheetRecipientGroup =
  | "production"
  | "cast"
  | "background"
  | "crew"
  | "vendors"
  | "transportation"
  | "locations"
  | "all"
  | "custom";

export type CallsheetRecipientGroupDefinition = {
  readonly group: CallsheetRecipientGroup;
  readonly label: string;
};

export const CALLSHEET_RECIPIENT_GROUP_REGISTRY: Record<CallsheetRecipientGroup, CallsheetRecipientGroupDefinition> = {
  production: { group: "production", label: "Production" },
  cast: { group: "cast", label: "Cast" },
  background: { group: "background", label: "Background" },
  crew: { group: "crew", label: "Crew" },
  vendors: { group: "vendors", label: "Vendors" },
  transportation: { group: "transportation", label: "Transportation" },
  locations: { group: "locations", label: "Locations" },
  all: { group: "all", label: "All" },
  custom: { group: "custom", label: "Custom" },
};

export type CallsheetPackageKind =
  | "callsheet-package"
  | "distribution-package"
  | "mobile-package"
  | "print-package"
  | "pdf-package";

export type CallsheetPackageKindDefinition = {
  readonly kind: CallsheetPackageKind;
  readonly label: string;
};

export const CALLSHEET_PACKAGE_KIND_REGISTRY: Record<CallsheetPackageKind, CallsheetPackageKindDefinition> = {
  "callsheet-package": { kind: "callsheet-package", label: "Callsheet Package" },
  "distribution-package": { kind: "distribution-package", label: "Distribution Package" },
  "mobile-package": { kind: "mobile-package", label: "Mobile Package" },
  "print-package": { kind: "print-package", label: "Print Package" },
  "pdf-package": { kind: "pdf-package", label: "PDF Package" },
};

export type CallsheetPackageStatus = "draft" | "issued" | "superseded" | "archived";

export type CallsheetRevisionColor =
  | "white"
  | "blue"
  | "pink"
  | "yellow"
  | "green"
  | "goldenrod"
  | "buff"
  | "salmon"
  | "cherry"
  | "tan"
  | "gray"
  | "ivory"
  | "double-white";

export type CallsheetRevisionColorDefinition = {
  readonly color: CallsheetRevisionColor;
  readonly label: string;
};

export const CALLSHEET_REVISION_COLOR_REGISTRY: Record<CallsheetRevisionColor, CallsheetRevisionColorDefinition> = {
  white: { color: "white", label: "White" },
  blue: { color: "blue", label: "Blue" },
  pink: { color: "pink", label: "Pink" },
  yellow: { color: "yellow", label: "Yellow" },
  green: { color: "green", label: "Green" },
  goldenrod: { color: "goldenrod", label: "Goldenrod" },
  buff: { color: "buff", label: "Buff" },
  salmon: { color: "salmon", label: "Salmon" },
  cherry: { color: "cherry", label: "Cherry" },
  tan: { color: "tan", label: "Tan" },
  gray: { color: "gray", label: "Gray" },
  ivory: { color: "ivory", label: "Ivory" },
  "double-white": { color: "double-white", label: "Double White" },
};
