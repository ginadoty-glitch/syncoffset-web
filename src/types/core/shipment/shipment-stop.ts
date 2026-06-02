/**
 * SyncOffset Shipment Authority — shipment stop (pickup, transfer, delivery, …)
 *
 * Constitutional object: kind "shipment-stop"
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type ShipmentStop = AuditableCoreObject & {
  readonly kind: "shipment-stop";
  readonly shipmentId: ObjectId;
  readonly stopNumber: number;
  readonly locationId: ObjectId;
  readonly arrivalPlanned: Timestamp;
  readonly departurePlanned: Timestamp;
  readonly notes: string;
};
