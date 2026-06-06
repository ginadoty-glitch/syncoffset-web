import type { LogisticsDeskSnapshot, ResolvedLogisticsDeskData } from "./logistics-desk-types";
import { buildLogisticsDeskViewModel } from "./map-logistics-desk";

/**
 * Prefer live transport order data when the loader succeeds and returns rows.
 * Phase 1C: no mock fallback — empty manifest when Supabase has no rows.
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
    shipments: [],
    driverAssignments: viewModel.driverAssignments,
    dataSource: "live",
    fallbackReason,
    loadError: snapshot.loadError,
    persistenceAvailable: viewModel.persistenceAvailable,
  };
}
