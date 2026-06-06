import { Package } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function WrapPacksPage() {
  return (
    <CanonWorkspaceShell
      group="Logistics"
      title="Wrap Packs"
      description="End-of-production wrap logistics, return shipments, and disposal manifests."
      icon={Package}
    />
  );
}
