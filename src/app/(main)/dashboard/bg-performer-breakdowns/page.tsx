import { Users } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function BgPerformerBreakdownsPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="BG Performer Breakdowns"
      description="Background performer requirements by scene, type, and shoot day."
      icon={Users}
    />
  );
}
