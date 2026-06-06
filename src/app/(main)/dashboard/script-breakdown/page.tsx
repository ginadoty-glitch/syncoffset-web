import { ListTree } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function ScriptBreakdownPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Script Breakdown"
      description="Scene-by-scene breakdown of production elements, departments, and requirements."
      icon={ListTree}
    />
  );
}
