/**
 * SyncOffset Shipment Authority — shipment event (movement history record)
 *
 * Append-only movement history — authoritative source for movement timeline.
 * Constitutional object: kind "shipment-event"
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ShipmentEventType } from "./shipment-status";

export type ShipmentEvent = AuditableCoreObject & {
  readonly kind: "shipment-event";
  readonly shipmentId: ObjectId;
  readonly eventType: ShipmentEventType;
  readonly occurredAt: Timestamp;
  readonly notes: string;
  readonly shipmentStopId?: ObjectId;
  readonly locationId?: ObjectId;
};
