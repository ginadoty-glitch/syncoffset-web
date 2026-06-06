import { FileText } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function PosPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="POs"
      description="Purchase orders, vendor commitments, and approval status."
      icon={FileText}
    />
  );
}
