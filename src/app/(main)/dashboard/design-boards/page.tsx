import { Palette } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function DesignBoardsPage() {
  return (
    <CanonWorkspaceShell
      group="Sets"
      title="Design Boards"
      description="Set design boards, material selections, and construction planning."
      icon={Palette}
    />
  );
}
