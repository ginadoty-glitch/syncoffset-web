import { Bell } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function BudgetAlertsPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Budget Alerts"
      description="Budget threshold alerts, overages, and variance warnings."
      icon={Bell}
    />
  );
}
