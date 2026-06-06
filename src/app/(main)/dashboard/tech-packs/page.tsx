import { Wrench } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function TechPacksPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Tech Packs"
      description="Technical packages, engineering drawings, and construction specifications."
      icon={Wrench}
    />
  );
}
