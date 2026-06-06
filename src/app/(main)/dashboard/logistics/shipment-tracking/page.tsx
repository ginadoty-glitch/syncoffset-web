import { Package } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function ShipmentTrackingPage() {
  return (
    <CanonWorkspaceShell
      group="Logistics"
      title="Shipment Tracking"
      description="Inbound and outbound shipment status, tracking, and delivery confirmation."
      icon={Package}
    />
  );
}
