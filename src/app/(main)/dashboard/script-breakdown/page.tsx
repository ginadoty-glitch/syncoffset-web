import Link from "next/link";

import { ListTree, Upload } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";
import { Button } from "@/components/ui/button";

export default function ScriptBreakdownPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Script Breakdown"
      description="Scene-by-scene breakdown of production elements, departments, and requirements."
      icon={ListTree}
      actions={
        <Button size="sm" asChild>
          <Link href="/ingestion/upload?kind=breakdown-package">
            <Upload className="mr-2 size-4" />
            Upload Breakdown
          </Link>
        </Button>
      }
    />
  );
}
