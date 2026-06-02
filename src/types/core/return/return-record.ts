/**
 * SyncOffset Return Authority — return record (recovery / strike / closeout)
 *
 * Purchase governs acquisition. Shipment governs movement. Return governs recovery.
 * Constitutional object: kind "return"
 *
 * @see docs/SYNCOFFSET_RETURN_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ReturnStatus } from "./return-status";

export type ReturnRecord = AuditableCoreObject & {
  readonly kind: "return";
  readonly status: ReturnStatus;
  readonly returnNumber: string;
  readonly returnName: string;
  readonly vendorId: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly notes: string;
  readonly returnLineIds: ReadonlyArray<ObjectId>;
  readonly returnPackageIds: ReadonlyArray<ObjectId>;
  readonly assetIds: ReadonlyArray<ObjectId>;
  readonly purchaseOrderId?: ObjectId;
  readonly shipmentId?: ObjectId;
  readonly brokerageRecordId?: ObjectId;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
