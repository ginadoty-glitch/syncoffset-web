import { Landmark } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function DepositsPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Deposits"
      description="Security deposits, damage deposits, and refund tracking."
      icon={Landmark}
    />
  );
}
