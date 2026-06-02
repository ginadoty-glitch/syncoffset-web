/**
 * SyncOffset Brokerage Authority — brokerage record (customs / import / export file)
 *
 * Shipment governs movement. Brokerage governs legality.
 * Constitutional object: kind "brokerage-record"
 *
 * @see docs/SYNCOFFSET_BROKERAGE_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { BrokerageStatus } from "./brokerage-status";

export type BrokerageRecord = AuditableCoreObject & {
  readonly kind: "brokerage-record";
  readonly status: BrokerageStatus;
  readonly brokerageNumber: string;
  readonly brokerageName: string;
  readonly shipmentId: ObjectId;
  readonly vendorId: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly notes: string;
  readonly purchaseOrderId?: ObjectId;
  readonly brokerageLineIds: ReadonlyArray<ObjectId>;
  readonly brokeragePackageIds: ReadonlyArray<ObjectId>;
  readonly assetIds: ReadonlyArray<ObjectId>;
  readonly returnIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
