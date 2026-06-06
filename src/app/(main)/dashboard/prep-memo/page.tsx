import { ClipboardList } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function PrepMemoPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Prep Memo"
      description="Department prep memos, scheduling notes, and pre-production coordination."
      icon={ClipboardList}
    />
  );
}
