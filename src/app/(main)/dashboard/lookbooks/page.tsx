import { BookOpen } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function LookbooksPage() {
  return (
    <CanonWorkspaceShell
      group="Sets"
      title="Lookbooks"
      description="Visual lookbooks for set design, wardrobe, and production design reference."
      icon={BookOpen}
    />
  );
}
