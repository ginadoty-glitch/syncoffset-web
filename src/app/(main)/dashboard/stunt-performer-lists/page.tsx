import { Shield } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function StuntPerformerListsPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Stunt Performer Lists"
      description="Stunt performers, coordinators, and stunt-related scheduling."
      icon={Shield}
    />
  );
}
