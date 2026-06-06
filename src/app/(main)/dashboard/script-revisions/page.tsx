import { FileText } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function ScriptRevisionsPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Script Revisions"
      description="Revision history, color pages, and change tracking for production scripts."
      icon={FileText}
    />
  );
}
