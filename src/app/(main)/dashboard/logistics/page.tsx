/** RUNTIME CLASSIFICATION: PRODUCTION — runsheets + drivers via Supabase; mock fallback retained. */
import { Logistics } from "./_components/logistics";
import { loadLogisticsDeskSnapshot } from "./_lib/load-logistics-desk-snapshot";
import { resolveLogisticsDeskData } from "./_lib/resolve-logistics-desk-data";

export const dynamic = "force-dynamic";

export default async function Page() {
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
