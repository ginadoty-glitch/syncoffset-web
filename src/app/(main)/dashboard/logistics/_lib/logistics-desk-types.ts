/**
 * Logistics desk — shared view-model types and Supabase row shapes.
 * Shipment types are canonical here; shipment-data.ts re-exports for mock rollback.
 */

import type { LucideIcon } from "lucide-react";

import type { DriverAssignment } from "../_components/operational-data";

// ─── Transport order view model ───────────────────────────────────────────────

export type ShipmentStatus =
  | "Scheduled"
  | "En Route"
  | "Dispatched"
  | "Completed"
  | "Held — Delayed"
  | "On Hold"
  | "Awaiting Clearance";

export type TransportMode = "land" | "air" | "sea";
export type RouteType = "road" | "flight" | "ship";
export type CustomerTier = "Priority" | "Standard" | "Non-priority";
export type Urgency = "priority" | "watch" | "normal";

export type GeoCoordinate = [longitude: number, latitude: number];

export type ShipmentLocation = {
  coordinates: GeoCoordinate;
  display: string;
  country: string;
  countryCode: string;
};

export type ShipmentCustomer = {
  name: string;
  initials: string;
  id: string;
  tier: CustomerTier;
  tierLabel: string;
};

export type HandlingTag = {
  label: string;
  icon: LucideIcon;
};

export type ShipmentHandling = {
  label: string;
  note: string;
  tags: HandlingTag[];
};

export type RouteWaypoint = {
  location: string;
  time: string;
  note: string;
  state: "completed" | "active" | "pending" | "restricted";
};

export type ManifestItem = {
  description: string;
  qty: string;
  dept: string;
  note?: string;
};

export type ProductionLogEntry = {
  time: string;
  from: string;
  message: string;
  type: "dispatch" | "update" | "alert" | "confirmation";
};

export type AttachedDocument = {
  name: string;
  ref: string;
  type: "call-sheet" | "movement-order" | "permit" | "ci" | "revision";
  issued: string;
};

export type Shipment = {
  id: string;
  customer: ShipmentCustomer;
  origin: ShipmentLocation;
  destination: ShipmentLocation;
  cargo: string;
  handling: ShipmentHandling;
  weight: string;
  eta: string;
  etaMeta: string;
  status: ShipmentStatus;
  progress: number;
  mode: TransportMode;
  routeType: RouteType;
  transportNumber: string;
  operationalNote: string;
  urgency: Urgency;
  route: RouteWaypoint[];
  manifest: ManifestItem[];
  productionLog: ProductionLogEntry[];
  documents: AttachedDocument[];
};

// ─── Supabase row shapes ──────────────────────────────────────────────────────

export type RunsheetRow = {
  id: string;
  show_id: string;
  kind: string;
  scheduled_date: string | null;
  po_number: string | null;
  work_order: string | null;
  set_info: string | null;
  pickup_vendor_name: string | null;
  pickup_address: string | null;
  dropoff_location_name: string | null;
  dropoff_address: string | null;
  driver_sub: string | null;
  items: unknown;
  notes: string | null;
  status: string;
  updated_at: string;
};

export type DriverRow = {
  id: string;
  user_sub: string;
  name: string;
  phone: string | null;
  status: string;
  designation: string;
};

export type LegacyShipmentRow = {
  id: string;
  runsheet_id: string | null;
  origin: string;
  destination: string;
  status: string;
  carrier: string | null;
  tracking_number: string | null;
  eta: string | null;
  direction: string;
};

export type DocumentRow = {
  id: string;
  title: string;
  document_type: string;
  uploaded_at: string;
  linked_runsheet_id: string | null;
  notes: string | null;
};

export type LogisticsDeskSnapshot = {
  showId: string | null;
  persistenceAvailable: boolean;
  loadError: string | null;
  runsheets: RunsheetRow[];
  drivers: DriverRow[];
  linkedShipments: LegacyShipmentRow[];
  documents: DocumentRow[];
};

export type LogisticsDeskViewModel = {
  shipments: Shipment[];
  driverAssignments: DriverAssignment[];
  loadError: string | null;
  persistenceAvailable: boolean;
};

export type LogisticsDeskDataSource = "live" | "mock";

export type ResolvedLogisticsDeskData = {
  shipments: Shipment[];
  driverAssignments: DriverAssignment[];
  dataSource: LogisticsDeskDataSource;
  /** Human-readable reason when `dataSource` is mock. */
  fallbackReason: string | null;
  /** Original loader error, preserved for diagnostics when falling back. */
  loadError: string | null;
  persistenceAvailable: boolean;
};
