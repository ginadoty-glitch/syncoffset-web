import { Image } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function MoodBoardsPage() {
  return (
    <CanonWorkspaceShell
      group="Sets"
      title="Mood Boards"
      description="Creative mood boards and visual direction references."
      icon={Image}
    />
  );
}
