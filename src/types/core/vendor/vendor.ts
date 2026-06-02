/**
 * SyncOffset Vendor Authority — vendor (company or service provider)
 *
 * Constitutional object: kind "vendor"
 * Distinct from vendor-contact (person) and vendor-agreement (terms).
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { VendorCategoryId } from "./vendor-category";
import type { VendorStatus } from "./vendor-status";

export type Vendor = AuditableCoreObject & {
  readonly kind: "vendor";
  readonly status: VendorStatus;
  readonly vendorName: string;
  readonly category: VendorCategoryId;
  readonly customCategoryLabel?: string;
  readonly vendorContactIds: ReadonlyArray<ObjectId>;
  readonly vendorAgreementIds: ReadonlyArray<ObjectId>;
  readonly locationIds: ReadonlyArray<ObjectId>;
  readonly accountNumber?: string;
  readonly notes?: string;
};
