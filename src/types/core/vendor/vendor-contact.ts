/**
 * SyncOffset Vendor Authority — vendor contact (person at vendor)
 *
 * Constitutional object: kind "vendor-contact"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { VendorContactRole } from "./vendor-status";

export type VendorContactInformation = {
  readonly phone?: string;
  readonly email?: string;
  readonly officePhone?: string;
};

export type VendorContact = AuditableCoreObject & {
  readonly kind: "vendor-contact";
  readonly vendorId: ObjectId;
  readonly contactName: string;
  readonly role: VendorContactRole;
  readonly title?: string;
  readonly contactInformation: VendorContactInformation;
  readonly isPrimary: boolean;
  readonly notes?: string;
};
