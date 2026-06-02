/**
 * SyncOffset Shipment Authority — movement of production materials
 *
 * Purchase creates intent. Shipment creates movement. Delivery creates availability.
 * Constitutional object: kind "shipment"
 *
 * @see docs/SYNCOFFSET_SHIPMENT_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ShipmentStatus } from "./shipment-status";

export type Shipment = AuditableCoreObject & {
  readonly kind: "shipment";
  readonly status: ShipmentStatus;
  readonly shipmentNumber: string;
  readonly shipmentName: string;
  readonly purchaseOrderId: ObjectId;
  readonly originLocationId: ObjectId;
  readonly destinationLocationId: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly notes: string;
  readonly vendorIds: ReadonlyArray<ObjectId>;
  readonly assetIds: ReadonlyArray<ObjectId>;
  readonly shipmentStopIds: ReadonlyArray<ObjectId>;
  readonly shipmentEventIds: ReadonlyArray<ObjectId>;
  readonly shipmentPackageIds: ReadonlyArray<ObjectId>;
  readonly returnIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
  readonly transportOrderIds: ReadonlyArray<ObjectId>;
};
