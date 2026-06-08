import { getDefaultProductionId } from "@/lib/ingestion/production";
import { isMissingRelation } from "@/lib/operations/is-missing-relation";
import { createServiceClient } from "@/lib/supabase/server";

import type {
  DocumentRow,
  DriverRow,
  LegacyShipmentRow,
  LogisticsDeskSnapshot,
  RunsheetRow,
} from "./logistics-desk-types";

const RUNSHEET_SELECT =
  "id, show_id, kind, scheduled_date, po_number, work_order, set_info, pickup_vendor_name, pickup_address, dropoff_location_name, dropoff_address, driver_sub, items, notes, status, updated_at";

const DRIVER_SELECT = "id, user_sub, name, phone, status, designation";

const LEGACY_SHIPMENT_SELECT = "id, runsheet_id, origin, destination, status, carrier, tracking_number, eta, direction";

const DOCUMENT_SELECT = "id, title, document_type, uploaded_at, linked_runsheet_id, notes";

function emptySnapshot(loadError: string | null): LogisticsDeskSnapshot {
  return {
    showId: null,
    persistenceAvailable: false,
    loadError,
    runsheets: [],
    drivers: [],
    linkedShipments: [],
    documents: [],
  };
}

export async function loadLogisticsDeskSnapshot(): Promise<LogisticsDeskSnapshot> {
  let supabase: ReturnType<typeof createServiceClient>;
  let showId: string;

  try {
    supabase = createServiceClient();
    showId = await getDefaultProductionId();
  } catch (error) {
    return emptySnapshot(error instanceof Error ? error.message : "Supabase is not configured.");
  }

  const { data: runsheetRows, error: runsheetError } = await supabase
    .from("runsheets")
    .select(RUNSHEET_SELECT)
    .eq("show_id", showId)
    .order("updated_at", { ascending: false });

  if (isMissingRelation(runsheetError)) {
    return {
      ...emptySnapshot("Transport order persistence is not available on this project."),
      showId,
    };
  }

  if (runsheetError) {
    return { ...emptySnapshot(runsheetError.message), showId };
  }

  const runsheets = (runsheetRows ?? []) as RunsheetRow[];
  const runsheetIds = runsheets.map((r) => r.id);

  const [driversResult, shipmentsResult, documentsResult] = await Promise.all([
    supabase.from("drivers").select(DRIVER_SELECT).eq("show_id", showId),
    runsheetIds.length > 0
      ? supabase.from("shipments").select(LEGACY_SHIPMENT_SELECT).eq("show_id", showId).in("runsheet_id", runsheetIds)
      : Promise.resolve({ data: [], error: null }),
    runsheetIds.length > 0
      ? supabase.from("documents").select(DOCUMENT_SELECT).eq("show_id", showId).in("linked_runsheet_id", runsheetIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (driversResult.error && !isMissingRelation(driversResult.error)) {
    return { ...emptySnapshot(driversResult.error.message), showId };
  }

  if (shipmentsResult.error && !isMissingRelation(shipmentsResult.error)) {
    return { ...emptySnapshot(shipmentsResult.error.message), showId };
  }

  if (documentsResult.error && !isMissingRelation(documentsResult.error)) {
    return { ...emptySnapshot(documentsResult.error.message), showId };
  }

  return {
    showId,
    persistenceAvailable: true,
    loadError: null,
    runsheets,
    drivers: (driversResult.data ?? []) as DriverRow[],
    linkedShipments: (shipmentsResult.data ?? []) as LegacyShipmentRow[],
    documents: (documentsResult.data ?? []) as DocumentRow[],
  };
}
