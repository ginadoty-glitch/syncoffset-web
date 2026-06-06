import { Users } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function CastListsPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Cast Lists"
      description="Cast members, roles, availability, and contact information."
      icon={Users}
    />
  );
}
