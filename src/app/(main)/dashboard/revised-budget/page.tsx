import { DollarSign } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function RevisedBudgetPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Revised Budget"
      description="Budget revisions, variance tracking, and reallocation history."
      icon={DollarSign}
    />
  );
}
