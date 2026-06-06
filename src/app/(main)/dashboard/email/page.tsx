import { Mail } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function EmailPage() {
  return (
    <CanonWorkspaceShell
      group="Communications"
      title="Email"
      description="Production email correspondence and distribution lists."
      icon={Mail}
    />
  );
}
