/**
 * SyncOffset Shipment Authority — generated shipment documentation
 *
 * Constitutional object: kind "shipment-package"
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ShipmentPackageKind, ShipmentPackageStatus } from "./shipment-status";

export type ShipmentPackage = AuditableCoreObject & {
  readonly kind: "shipment-package";
  readonly status: ShipmentPackageStatus;
  readonly shipmentId: ObjectId;
  readonly packageKind: ShipmentPackageKind;
  readonly generatedAt: Timestamp;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
