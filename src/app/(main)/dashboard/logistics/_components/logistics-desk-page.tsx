import { loadLogisticsDeskSnapshot } from "../_lib/load-logistics-desk-snapshot";
import { resolveLogisticsDeskData } from "../_lib/resolve-logistics-desk-data";
import { Logistics } from "./logistics";

export const dynamic = "force-dynamic";

/** Shared logistics desk — Transport Orders manifest + detail + intelligence rail. */
export async function LogisticsDeskPage() {
  const snapshot = await loadLogisticsDeskSnapshot();
  const desk = resolveLogisticsDeskData(snapshot);

  return (
    <Logistics
      shipments={desk.shipments}
      driverAssignments={desk.driverAssignments}
      dataSource={desk.dataSource}
      fallbackReason={desk.fallbackReason}
      persistenceAvailable={desk.persistenceAvailable}
    />
  );
}
