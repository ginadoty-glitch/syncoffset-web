import { Video } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function AuditionsPage() {
  return (
    <CanonWorkspaceShell
      group="Media"
      title="Auditions"
      description="Audition recordings, casting sessions, and callback materials."
      icon={Video}
    />
  );
}
