import { List } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function OneLineSchedulePage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="One-Line Schedule"
      description="Condensed single-line schedule for quick production overview."
      icon={List}
    />
  );
}
