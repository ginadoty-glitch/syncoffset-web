import { TrendingUp } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function CostReportPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Cost Report"
      description="Weekly cost reports, actual vs. estimated, and department burn rates."
      icon={TrendingUp}
    />
  );
}
