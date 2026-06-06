import { Film } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function DailiesPage() {
  return (
    <CanonWorkspaceShell
      group="Media"
      title="Dailies"
      description="Daily footage reviews, selects, and editorial notes."
      icon={Film}
    />
  );
}
