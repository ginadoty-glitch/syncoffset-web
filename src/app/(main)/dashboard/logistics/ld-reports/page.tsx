import { AlertTriangle } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function LdReportsPage() {
  return (
    <CanonWorkspaceShell
      group="Logistics"
      title="L&amp;D Reports"
      description="Loss and damage reports for production equipment and materials."
      icon={AlertTriangle}
    />
  );
}
