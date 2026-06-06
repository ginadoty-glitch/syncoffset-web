import { Shield } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function CarmPage() {
  return (
    <CanonWorkspaceShell
      group="Brokerage"
      title="CARM"
      description="CARM submissions and Canadian customs compliance documentation."
      icon={Shield}
    />
  );
}
