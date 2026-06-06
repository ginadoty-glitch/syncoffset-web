import { Map as MapIcon } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function MapsPage() {
  return (
    <CanonWorkspaceShell
      group="Logistics"
      title="Maps"
      description="Production maps, base camp layouts, and location routing."
      icon={MapIcon}
    />
  );
}
