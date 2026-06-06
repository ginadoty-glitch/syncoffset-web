import { Package } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function HandCarriesPage() {
  return (
    <CanonWorkspaceShell
      group="Brokerage"
      title="Hand Carries"
      description="Hand-carry manifests for items transported by crew across borders."
      icon={Package}
    />
  );
}
