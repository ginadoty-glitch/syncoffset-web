import Link from "next/link";

import { Calendar, Upload } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";
import { Button } from "@/components/ui/button";

export default function CastDoodsPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Cast DOODs"
      description="Day Out Of Days reports for cast members."
      icon={Calendar}
      actions={
        <Button size="sm" asChild>
          <Link href="/ingestion/upload?kind=dood">
            <Upload className="mr-2 size-4" />
            Upload DOOD
          </Link>
        </Button>
      }
    />
  );
}
