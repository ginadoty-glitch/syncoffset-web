import { ClipboardList } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function WorkRequestsPage() {
  return (
    <CanonWorkspaceShell
      group="Logistics"
      title="Work Requests"
      description="Department work requests for transport, construction, and support services."
      icon={ClipboardList}
    />
  );
}
