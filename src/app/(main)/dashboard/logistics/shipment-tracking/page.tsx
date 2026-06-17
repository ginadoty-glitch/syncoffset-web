/** RUNTIME CLASSIFICATION: PRODUCTION — shipment tracking wired to shipments + vendors + runsheets. */

import { ShipmentTrackingWorkspace } from "@/components/shipments/shipment-tracking-workspace";
import { loadRunsheetOptions } from "@/lib/logistics/load-runsheet-options";
import { getActiveShow } from "@/lib/production/get-active-show";
import { loadShipmentLogs } from "@/lib/shipments/load-shipment-logs";
import { loadVendors } from "@/lib/vendors/load-vendors";

export const dynamic = "force-dynamic";

export default async function ShipmentTrackingPage() {
  const [shipments, vendors, runsheets, show] = await Promise.all([
    loadShipmentLogs(),
    loadVendors(),
    loadRunsheetOptions(),
    getActiveShow(),
  ]);
  return (
    <ShipmentTrackingWorkspace
      shipments={shipments}
      vendors={vendors.rows}
      runsheets={runsheets.rows}
      showName={show.name}
      loadError={shipments.loadError ?? vendors.loadError ?? runsheets.loadError}
    />
  );
}
