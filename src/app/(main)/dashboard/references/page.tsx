import { BookOpen } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function ReferencesPage() {
  return (
    <CanonWorkspaceShell
      group="Sets"
      title="References"
      description="Visual references, research materials, and inspiration collections."
      icon={BookOpen}
    />
  );
}
