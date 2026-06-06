import { List } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function SetListsPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Set Lists"
      description="Set inventory lists and accounting reconciliation."
      icon={List}
    />
  );
}
