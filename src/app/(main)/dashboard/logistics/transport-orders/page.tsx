import { Truck } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function TransportOrdersPage() {
  return (
    <CanonWorkspaceShell
      group="Logistics"
      title="Transport Orders"
      description="Transport orders for crew, equipment, and material moves."
      icon={Truck}
    />
  );
}
