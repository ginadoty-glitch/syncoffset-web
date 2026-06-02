/**
 * SyncOffset Vendor Authority — vendor agreement (standing terms)
 *
 * Negotiated production terms — not payroll, invoicing, or payment execution.
 * Constitutional object: kind "vendor-agreement"
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { VendorAgreementStatus } from "./vendor-status";

export type VendorAgreementType = "master" | "rental" | "purchase" | "service" | "customs" | "transport";

export type VendorAgreement = AuditableCoreObject & {
  readonly kind: "vendor-agreement";
  readonly status: VendorAgreementStatus;
  readonly vendorId: ObjectId;
  readonly agreementType: VendorAgreementType;
  readonly agreementLabel: string;
  readonly effectiveDate: string;
  readonly expirationDate?: string;
  readonly sourceDocumentId?: ObjectId;
  readonly termsSummary?: string;
  readonly signedAt?: Timestamp;
  readonly signedBy?: string;
  readonly notes?: string;
};
