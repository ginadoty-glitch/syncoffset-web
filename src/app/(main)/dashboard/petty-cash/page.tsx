import { Coins } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function PettyCashPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Petty Cash"
      description="Petty cash disbursements, receipts, and reconciliation."
      icon={Coins}
    />
  );
}
