/**
 * SyncOffset Shipment Authority — lifecycle, event, and package vocabulary (registry only)
 * @see docs/SYNCOFFSET_SHIPMENT_AUTHORITY.md
 */

export type ShipmentStatus =
  | "draft"
  | "scheduled"
  | "ready-for-pickup"
  | "picked-up"
  | "in-transit"
  | "at-stop"
  | "delivered"
  | "partially-delivered"
  | "returned"
  | "delayed"
  | "cancelled"
  | "lost"
  | "damaged";

export type ShipmentStatusDefinition = {
  readonly status: ShipmentStatus;
  readonly label: string;
};

export const SHIPMENT_STATUS_REGISTRY: Record<ShipmentStatus, ShipmentStatusDefinition> = {
  draft: { status: "draft", label: "Draft" },
  scheduled: { status: "scheduled", label: "Scheduled" },
  "ready-for-pickup": { status: "ready-for-pickup", label: "Ready for Pickup" },
  "picked-up": { status: "picked-up", label: "Picked Up" },
  "in-transit": { status: "in-transit", label: "In Transit" },
  "at-stop": { status: "at-stop", label: "At Stop" },
  delivered: { status: "delivered", label: "Delivered" },
  "partially-delivered": { status: "partially-delivered", label: "Partially Delivered" },
  returned: { status: "returned", label: "Returned" },
  delayed: { status: "delayed", label: "Delayed" },
  cancelled: { status: "cancelled", label: "Cancelled" },
  lost: { status: "lost", label: "Lost" },
  damaged: { status: "damaged", label: "Damaged" },
};

export type ShipmentEventType =
  | "created"
  | "scheduled"
  | "picked-up"
  | "departed"
  | "arrived"
  | "transferred"
  | "customs-held"
  | "released"
  | "delivered"
  | "returned"
  | "lost"
  | "damaged"
  | "cancelled";

export type ShipmentEventTypeDefinition = {
  readonly eventType: ShipmentEventType;
  readonly label: string;
};

export const SHIPMENT_EVENT_TYPE_REGISTRY: Record<ShipmentEventType, ShipmentEventTypeDefinition> = {
  created: { eventType: "created", label: "Created" },
  scheduled: { eventType: "scheduled", label: "Scheduled" },
  "picked-up": { eventType: "picked-up", label: "Picked Up" },
  departed: { eventType: "departed", label: "Departed" },
  arrived: { eventType: "arrived", label: "Arrived" },
  transferred: { eventType: "transferred", label: "Transferred" },
  "customs-held": { eventType: "customs-held", label: "Customs Held" },
  released: { eventType: "released", label: "Released" },
  delivered: { eventType: "delivered", label: "Delivered" },
  returned: { eventType: "returned", label: "Returned" },
  lost: { eventType: "lost", label: "Lost" },
  damaged: { eventType: "damaged", label: "Damaged" },
  cancelled: { eventType: "cancelled", label: "Cancelled" },
};

export type ShipmentPackageKind =
  | "transport-package"
  | "delivery-package"
  | "pod-package"
  | "shipping-package"
  | "receiving-package";

export type ShipmentPackageKindDefinition = {
  readonly kind: ShipmentPackageKind;
  readonly label: string;
};

export const SHIPMENT_PACKAGE_KIND_REGISTRY: Record<ShipmentPackageKind, ShipmentPackageKindDefinition> = {
  "transport-package": { kind: "transport-package", label: "Transport Package" },
  "delivery-package": { kind: "delivery-package", label: "Delivery Package" },
  "pod-package": { kind: "pod-package", label: "POD Package" },
  "shipping-package": { kind: "shipping-package", label: "Shipping Package" },
  "receiving-package": { kind: "receiving-package", label: "Receiving Package" },
};

export type ShipmentPackageStatus = "draft" | "issued" | "superseded" | "archived";
