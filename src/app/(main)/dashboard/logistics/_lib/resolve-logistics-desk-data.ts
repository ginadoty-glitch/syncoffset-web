import type { LogisticsDeskSnapshot, ResolvedLogisticsDeskData } from "./logistics-desk-types";
import { buildLogisticsDeskViewModel } from "./map-logistics-desk";

/**
 * Prefer live transport order data when the loader succeeds.
 * Phase 1C: no mock fallback — empty manifest when Supabase has no rows.
 */
export function resolveLogisticsDeskData(snapshot: LogisticsDeskSnapshot): ResolvedLogisticsDeskData {
  const viewModel = buildLogisticsDeskViewModel(snapshot);

  if (snapshot.loadError === null) {
    return {
      shipments: viewModel.shipments,
      driverAssignments: viewModel.driverAssignments,
      dataSource: "live",
      fallbackReason: viewModel.shipments.length === 0 ? "No transport orders found for this production." : null,
      loadError: null,
      persistenceAvailable: viewModel.persistenceAvailable,
    };
  }

  return {
    shipments: [],
    driverAssignments: viewModel.driverAssignments,
    dataSource: "live",
    fallbackReason: `Supabase load failed — ${snapshot.loadError}`,
    loadError: snapshot.loadError,
    persistenceAvailable: viewModel.persistenceAvailable,
  };
}
