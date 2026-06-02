/**
 * SyncOffset Return Authority — return package (generated return documentation)
 *
 * Constitutional object: kind "return-package"
 * Distinct from BrokeragePackageKind `return-package` (brokerage document type id).
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ReturnPackageKind, ReturnPackageStatus } from "./return-status";

export type ReturnPackage = AuditableCoreObject & {
  readonly kind: "return-package";
  readonly status: ReturnPackageStatus;
  readonly returnId: ObjectId;
  readonly packageKind: ReturnPackageKind;
  readonly generatedAt: Timestamp;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
