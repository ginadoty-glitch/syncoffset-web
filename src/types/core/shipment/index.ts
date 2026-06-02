/**
 * SyncOffset Shipment Authority Layer — barrel export
 */

export type { Shipment } from "./shipment";
export type { ShipmentEvent } from "./shipment-event";
export type { ShipmentPackage } from "./shipment-package";
export {
  SHIPMENT_CANONICAL_RELATIONSHIP_PATHS,
  SHIPMENT_RELATIONSHIP_SCHEMA_REGISTRY,
  SHIPMENT_RELATIONSHIP_TARGETS,
} from "./shipment-relationship-contracts";
export type {
  ShipmentEventType,
  ShipmentEventTypeDefinition,
  ShipmentPackageKind,
  ShipmentPackageKindDefinition,
  ShipmentPackageStatus,
  ShipmentStatus,
  ShipmentStatusDefinition,
} from "./shipment-status";
export {
  SHIPMENT_EVENT_TYPE_REGISTRY,
  SHIPMENT_PACKAGE_KIND_REGISTRY,
  SHIPMENT_STATUS_REGISTRY,
} from "./shipment-status";
export type { ShipmentStop } from "./shipment-stop";
