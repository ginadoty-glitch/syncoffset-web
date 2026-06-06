import { Calculator } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function PrelimBudgetPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Prelim Budget"
      description="Preliminary budget estimates and department allocations."
      icon={Calculator}
    />
  );
}
