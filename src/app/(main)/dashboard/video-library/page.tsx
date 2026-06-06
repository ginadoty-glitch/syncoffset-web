import { Film } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function VideoLibraryPage() {
  return (
    <CanonWorkspaceShell
      group="Media"
      title="Video Library"
      description="Video assets, walkthroughs, tech scouts, and BTS content."
      icon={Film}
    />
  );
}
