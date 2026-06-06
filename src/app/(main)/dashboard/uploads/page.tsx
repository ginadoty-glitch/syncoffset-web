import { Upload } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function UploadsPage() {
  return (
    <CanonWorkspaceShell
      group="Media"
      title="Uploads"
      description="Media uploads, file processing, and storage management."
      icon={Upload}
    />
  );
}
