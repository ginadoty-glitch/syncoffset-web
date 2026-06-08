import Link from "next/link";

import { Map as MapIcon, Upload } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";
import { Button } from "@/components/ui/button";

export default function MapsPage() {
  return (
    <CanonWorkspaceShell
      group="Logistics"
      title="Maps"
      description="Production maps, base camp layouts, and location routing."
      icon={MapIcon}
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/ingestion/upload?kind=reference-media&label=Site+Plan">
              <Upload className="mr-2 size-4" />
              Upload Site Plan
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/ingestion/upload?kind=reference-media&label=Map">
              <Upload className="mr-2 size-4" />
              Upload Map
            </Link>
          </Button>
        </>
      }
    />
  );
}
