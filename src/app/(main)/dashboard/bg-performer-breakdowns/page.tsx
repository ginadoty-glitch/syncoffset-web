import Link from "next/link";

import { Upload, Users } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";
import { Button } from "@/components/ui/button";

export default function BgPerformerBreakdownsPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="BG Performer Breakdowns"
      description="Background performer requirements by scene, type, and shoot day."
      icon={Users}
      actions={
        <Button size="sm" asChild>
          <Link href="/ingestion/upload?kind=breakdown-package">
            <Upload className="mr-2 size-4" />
            Upload BG Breakdown
          </Link>
        </Button>
      }
    />
  );
}
