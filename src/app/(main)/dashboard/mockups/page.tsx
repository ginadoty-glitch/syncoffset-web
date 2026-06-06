import { Palette } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function MockupsPage() {
  return (
    <CanonWorkspaceShell
      group="Sets"
      title="Mockups"
      description="Set mockups, scale models, and pre-visualization materials."
      icon={Palette}
    />
  );
}
