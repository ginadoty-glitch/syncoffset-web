/** RUNTIME CLASSIFICATION: PRODUCTION — shipment tracking wired to shipments + vendors. */

import { ShipmentTrackingWorkspace } from "@/components/shipments/shipment-tracking-workspace";
import { getActiveShow } from "@/lib/production/get-active-show";
import { loadShipmentLogs } from "@/lib/shipments/load-shipment-logs";
import { loadVendors } from "@/lib/vendors/load-vendors";

export const dynamic = "force-dynamic";

export default async function ShipmentTrackingPage() {
  const [shipments, vendors, show] = await Promise.all([loadShipmentLogs(), loadVendors(), getActiveShow()]);
  return (
    <ShipmentTrackingWorkspace
      shipments={shipments}
      vendors={vendors.rows}
      showName={show.name}
      loadError={shipments.loadError ?? vendors.loadError}
    />
  );
}
