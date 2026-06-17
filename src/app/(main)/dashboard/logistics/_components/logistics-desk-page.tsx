import { loadVendors } from "@/lib/vendors/load-vendors";

import { loadLogisticsDeskSnapshot } from "../_lib/load-logistics-desk-snapshot";
import { resolveLogisticsDeskData } from "../_lib/resolve-logistics-desk-data";
import { Logistics } from "./logistics";

export const dynamic = "force-dynamic";

/** Shared logistics desk — Transport Orders manifest + detail + intelligence rail. */
export async function LogisticsDeskPage() {
  const [snapshot, vendorsResult] = await Promise.all([loadLogisticsDeskSnapshot(), loadVendors()]);
  const desk = resolveLogisticsDeskData(snapshot);

  return (
    <Logistics
      shipments={desk.shipments}
      driverAssignments={desk.driverAssignments}
      drivers={snapshot.drivers}
      vendors={vendorsResult.rows}
      dataSource={desk.dataSource}
      fallbackReason={desk.fallbackReason}
      persistenceAvailable={desk.persistenceAvailable}
    />
  );
}
