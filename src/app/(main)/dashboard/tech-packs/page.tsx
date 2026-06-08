import Link from "next/link";

import { Upload, Wrench } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";
import { Button } from "@/components/ui/button";

export default function TechPacksPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Tech Packs"
      description="Technical packages, engineering drawings, and construction specifications."
      icon={Wrench}
      actions={
        <Button size="sm" asChild>
          <Link href="/ingestion/upload?kind=reference-media">
            <Upload className="mr-2 size-4" />
            Upload Tech Pack
          </Link>
        </Button>
      }
    />
  );
}
