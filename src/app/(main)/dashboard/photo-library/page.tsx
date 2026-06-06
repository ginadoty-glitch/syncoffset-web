import { Image } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function PhotoLibraryPage() {
  return (
    <CanonWorkspaceShell
      group="Media"
      title="Photo Library"
      description="Production photography, set photos, and continuity stills."
      icon={Image}
    />
  );
}
