/**
 * SyncOffset Vendor Authority — lifecycle status vocabulary
 */

export type VendorStatus = "active" | "preferred" | "on-hold" | "inactive" | "archived";

export type VendorAgreementStatus = "draft" | "active" | "expiring" | "expired" | "terminated" | "archived";

export type VendorContactRole =
  | "primary"
  | "sales"
  | "account-manager"
  | "dispatch"
  | "billing"
  | "customs"
  | "emergency"
  | "other";
