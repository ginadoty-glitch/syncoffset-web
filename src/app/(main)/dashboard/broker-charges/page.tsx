import { Receipt } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function BrokerChargesPage() {
  return (
    <CanonWorkspaceShell
      group="Brokerage"
      title="Broker Charges"
      description="Brokerage fees, duties, and customs processing charges."
      icon={Receipt}
    />
  );
}
