import { driverAssignments as mockDriverAssignments } from "../_components/operational-data";
import { shipments as mockShipments } from "../_components/shipment-data";
import type { LogisticsDeskSnapshot, ResolvedLogisticsDeskData } from "./logistics-desk-types";
import { buildLogisticsDeskViewModel } from "./map-logistics-desk";

/**
 * Prefer live transport order data when the loader succeeds and returns rows.
 * Otherwise fall back to mock manifest + driver assignments for rollback safety.
 */
export function resolveLogisticsDeskData(snapshot: LogisticsDeskSnapshot): ResolvedLogisticsDeskData {
  const viewModel = buildLogisticsDeskViewModel(snapshot);
  const hasLiveData = snapshot.loadError === null && viewModel.shipments.length > 0;

  if (hasLiveData) {
    return {
      shipments: viewModel.shipments,
      driverAssignments: viewModel.driverAssignments,
      dataSource: "live",
      fallbackReason: null,
      loadError: null,
      persistenceAvailable: viewModel.persistenceAvailable,
    };
  }

  const fallbackReason =
    snapshot.loadError !== null
      ? `Supabase load failed — ${snapshot.loadError}`
      : "No transport orders found for this production.";

  return {
    shipments: mockShipments,
    driverAssignments: mockDriverAssignments,
    dataSource: "mock",
    fallbackReason,
    loadError: snapshot.loadError,
    persistenceAvailable: snapshot.persistenceAvailable,
  };
}
