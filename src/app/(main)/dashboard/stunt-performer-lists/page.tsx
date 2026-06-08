import Link from "next/link";

import { Shield, Upload } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";
import { Button } from "@/components/ui/button";

export default function StuntPerformerListsPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Stunt Performer Lists"
      description="Stunt performers, coordinators, and stunt-related scheduling."
      icon={Shield}
      actions={
        <Button size="sm" asChild>
          <Link href="/ingestion/upload?kind=crew-list">
            <Upload className="mr-2 size-4" />
            Upload Stunt List
          </Link>
        </Button>
      }
    />
  );
}
