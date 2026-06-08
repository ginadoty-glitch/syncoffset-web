import Link from "next/link";

import { FileText, Upload } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";
import { Button } from "@/components/ui/button";

export default function ScriptRevisionsPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Script Revisions"
      description="Revision history, color pages, and change tracking for production scripts."
      icon={FileText}
      actions={
        <Button size="sm" asChild>
          <Link href="/ingestion/upload?kind=script-revision">
            <Upload className="mr-2 size-4" />
            Upload Revision
          </Link>
        </Button>
      }
    />
  );
}
