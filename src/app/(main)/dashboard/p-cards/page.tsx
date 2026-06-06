import { CreditCard } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function PCardsPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="P-Cards"
      description="Production credit card transactions and reconciliation."
      icon={CreditCard}
    />
  );
}
