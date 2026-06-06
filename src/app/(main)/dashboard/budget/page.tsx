import { DollarSign } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function BudgetPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Budget"
      description="Approved production budget with line-item detail."
      icon={DollarSign}
    />
  );
}
