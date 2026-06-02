/**
 * SyncOffset Brokerage Authority — generated customs documentation
 *
 * Commercial Invoice and clearance packages originate here — not Shipment Authority.
 * Distinct from `generated-output` kind `brokerage-package` (output artifact).
 *
 * Constitutional object: kind "brokerage-package"
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { BrokeragePackageKind, BrokeragePackageStatus } from "./brokerage-status";

export type BrokeragePackage = AuditableCoreObject & {
  readonly kind: "brokerage-package";
  readonly status: BrokeragePackageStatus;
  readonly brokerageRecordId: ObjectId;
  readonly packageKind: BrokeragePackageKind;
  readonly generatedAt: Timestamp;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
