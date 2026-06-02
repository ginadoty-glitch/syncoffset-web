/**
 * SyncOffset Vendor Authority Layer — barrel export
 *
 * Vendor — company or service provider
 * VendorContact — person at vendor
 * VendorAgreement — standing production terms
 */

export type { Vendor } from "./vendor";
export type { VendorAgreement, VendorAgreementType } from "./vendor-agreement";
export type { VendorCategoryDefinition, VendorCategoryId } from "./vendor-category";
export { isVendorCategoryId, VENDOR_CATEGORY_REGISTRY } from "./vendor-category";
export type { VendorContact, VendorContactInformation } from "./vendor-contact";
export type { VendorOperationalTargetKind } from "./vendor-relationship-contracts";
export {
  VENDOR_CANONICAL_RELATIONSHIP_PATHS,
  VENDOR_RELATIONSHIP_SCHEMA_REGISTRY,
  VENDOR_RELATIONSHIP_TARGETS,
} from "./vendor-relationship-contracts";
export type {
  VendorAgreementStatus,
  VendorContactRole,
  VendorStatus,
} from "./vendor-status";
