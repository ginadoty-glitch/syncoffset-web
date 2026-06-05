import type { DriverAssignment, DriverStatus, VehicleType } from "../_components/operational-data";
import type {
  AttachedDocument,
  DocumentRow,
  DriverRow,
  LegacyShipmentRow,
  LogisticsDeskSnapshot,
  LogisticsDeskViewModel,
  ManifestItem,
  RunsheetRow,
  Shipment,
  ShipmentLocation,
  ShipmentStatus,
} from "./logistics-desk-types";

const EMPTY_COORDINATES: ShipmentLocation["coordinates"] = [0, 0];

const VEHICLE_TYPES: VehicleType[] = ["3-ton", "5-ton", "10-ton", "cube-van", "van", "sedan", "low-loader", "trailer"];

function pickText(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "—";
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  return parts
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapRunsheetStatus(status: string, legacyStatus?: string | null): ShipmentStatus {
  if (legacyStatus) {
    switch (legacyStatus) {
      case "in_transit":
        return "En Route";
      case "customs":
        return "Awaiting Clearance";
      case "delivered":
        return "Completed";
      case "preparing":
        return "Scheduled";
      default:
        break;
    }
  }

  switch (status) {
    case "dispatched":
      return "Dispatched";
    case "completed":
      return "Completed";
    default:
      return "Scheduled";
  }
}

function mapDriverStatus(status: string): DriverStatus {
  switch (status) {
    case "active":
      return "active";
    case "break":
      return "standby";
    case "offline":
      return "off-duty";
    default:
      return "standby";
  }
}

function mapDesignationToVehicleType(designation: string): VehicleType {
  if (VEHICLE_TYPES.includes(designation as VehicleType)) {
    return designation as VehicleType;
  }
  return "van";
}

function summarizeRunsheetItems(items: unknown): string {
  if (!Array.isArray(items) || items.length === 0) return "—";

  const labels: string[] = [];
  for (const entry of items.slice(0, 3)) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const description =
      typeof row.description === "string"
        ? row.description
        : typeof row.name === "string"
          ? row.name
          : typeof row.label === "string"
            ? row.label
            : null;
    if (description?.trim()) labels.push(description.trim());
  }

  if (labels.length > 0) {
    const suffix = items.length > labels.length ? ` +${items.length - labels.length} more` : "";
    return labels.join(" · ") + suffix;
  }

  return `${items.length} item(s)`;
}

function parseManifestItems(items: unknown): ManifestItem[] {
  if (!Array.isArray(items)) return [];

  const out: ManifestItem[] = [];
  for (const entry of items) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const description = pickText(
      typeof row.description === "string" ? row.description : null,
      typeof row.name === "string" ? row.name : null,
    );
    if (description === "—") continue;
    out.push({
      description,
      qty: typeof row.qty === "string" ? row.qty : typeof row.quantity === "number" ? String(row.quantity) : "—",
      dept: typeof row.dept === "string" ? row.dept : typeof row.department === "string" ? row.department : "—",
      note: typeof row.note === "string" ? row.note : undefined,
    });
  }
  return out;
}

function mapDocumentType(documentType: string): AttachedDocument["type"] {
  switch (documentType) {
    case "ci":
      return "ci";
    case "pod":
      return "movement-order";
    case "runsheet":
      return "revision";
    case "photo":
      return "permit";
    default:
      return "permit";
  }
}

function mapDocumentsForRunsheet(docs: DocumentRow[]): AttachedDocument[] {
  return docs.map((doc) => ({
    name: doc.title,
    ref: doc.id.slice(0, 8),
    type: mapDocumentType(doc.document_type),
    issued: formatTimestamp(doc.uploaded_at),
  }));
}

function buildLocation(display: string): ShipmentLocation {
  return {
    coordinates: EMPTY_COORDINATES,
    display,
    country: "",
    countryCode: "—",
  };
}

function progressForStatus(status: ShipmentStatus): number {
  if (status === "Completed") return 100;
  if (status === "Dispatched" || status === "En Route") return 50;
  return 0;
}

function indexByRunsheetId<T extends { runsheet_id: string | null }>(rows: T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) {
    if (row.runsheet_id) map.set(row.runsheet_id, row);
  }
  return map;
}

function groupDocumentsByRunsheet(documents: DocumentRow[]): Map<string, DocumentRow[]> {
  const map = new Map<string, DocumentRow[]>();
  for (const doc of documents) {
    if (!doc.linked_runsheet_id) continue;
    const list = map.get(doc.linked_runsheet_id) ?? [];
    list.push(doc);
    map.set(doc.linked_runsheet_id, list);
  }
  return map;
}

export function mapRunsheetRowToShipment(
  runsheet: RunsheetRow,
  legacyShipment: LegacyShipmentRow | undefined,
  documents: DocumentRow[],
): Shipment {
  const customerName = pickText(runsheet.set_info, runsheet.pickup_vendor_name);
  const status = mapRunsheetStatus(runsheet.status, legacyShipment?.status);
  const originDisplay = pickText(runsheet.pickup_address, runsheet.pickup_vendor_name, legacyShipment?.origin);
  const destinationDisplay = pickText(
    runsheet.dropoff_address,
    runsheet.dropoff_location_name,
    legacyShipment?.destination,
  );

  return {
    id: runsheet.id,
    customer: {
      name: customerName,
      initials: initialsFromName(customerName),
      id: pickText(runsheet.po_number, runsheet.work_order, runsheet.id.slice(0, 8)),
      tier: "Standard",
      tierLabel: "—",
    },
    origin: buildLocation(originDisplay === "—" ? "Pickup not set" : originDisplay),
    destination: buildLocation(destinationDisplay === "—" ? "Dropoff not set" : destinationDisplay),
    cargo: summarizeRunsheetItems(runsheet.items),
    handling: {
      label: "Handling",
      note: "—",
      tags: [],
    },
    weight: "—",
    eta: formatTimestamp(legacyShipment?.eta ?? runsheet.scheduled_date),
    etaMeta: "",
    status,
    progress: progressForStatus(status),
    mode: "land",
    routeType: "road",
    transportNumber: pickText(runsheet.po_number, runsheet.work_order),
    operationalNote: runsheet.notes?.trim() ?? "",
    urgency: "normal",
    route: [],
    manifest: parseManifestItems(runsheet.items),
    productionLog: [],
    documents: mapDocumentsForRunsheet(documents),
  };
}

export function mapRunsheetRowsToShipments(snapshot: LogisticsDeskSnapshot): Shipment[] {
  const legacyByRunsheet = indexByRunsheetId(snapshot.linkedShipments);
  const docsByRunsheet = groupDocumentsByRunsheet(snapshot.documents);

  return snapshot.runsheets.map((runsheet) =>
    mapRunsheetRowToShipment(runsheet, legacyByRunsheet.get(runsheet.id), docsByRunsheet.get(runsheet.id) ?? []),
  );
}

export function buildDriverAssignments(snapshot: LogisticsDeskSnapshot): DriverAssignment[] {
  const driversBySub = new Map(snapshot.drivers.map((driver) => [driver.user_sub, driver]));

  const assignments: DriverAssignment[] = [];
  for (const runsheet of snapshot.runsheets) {
    if (!runsheet.driver_sub?.trim()) continue;
    const driver = driversBySub.get(runsheet.driver_sub.trim());
    assignments.push(mapDriverAssignment(runsheet, driver));
  }
  return assignments;
}

function mapDriverAssignment(runsheet: RunsheetRow, driver: DriverRow | undefined): DriverAssignment {
  const driverName = driver?.name?.trim() || "Unassigned";
  return {
    id: driver?.id ?? `${runsheet.id}-driver`,
    driverName,
    vehicle: "—",
    vehicleType: mapDesignationToVehicleType(driver?.designation ?? "van"),
    phone: driver?.phone?.trim() || "—",
    radioChannel: "—",
    status: mapDriverStatus(driver?.status ?? "offline"),
    linkedOrderId: runsheet.id,
  };
}

export function buildLogisticsDeskViewModel(snapshot: LogisticsDeskSnapshot): LogisticsDeskViewModel {
  return {
    shipments: mapRunsheetRowsToShipments(snapshot),
    driverAssignments: buildDriverAssignments(snapshot),
    loadError: snapshot.loadError,
    persistenceAvailable: snapshot.persistenceAvailable,
  };
}
