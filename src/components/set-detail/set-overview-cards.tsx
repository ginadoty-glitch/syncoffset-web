import { Box, FileText, Film, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AssetRow, SceneRow, SetDocumentItem } from "@/lib/sets/workspace-types";

import { SetSectionEmpty } from "./set-section-empty";

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-[10px] uppercase tracking-wider">{label}</span>
      <span className="font-medium font-mono text-lg tabular-nums">{value}</span>
    </div>
  );
}

export function SetOverviewCards({
  assets,
  documents,
  scenes,
  hasSet,
}: {
  assets: AssetRow[];
  documents: SetDocumentItem[];
  scenes: SceneRow[];
  hasSet: boolean;
}) {
  const activeStatuses = new Set(["on-set", "installed", "received", "ordered", "approved"]);
  const returnedCount = assets.filter((a) => a.status === "returned" || a.status === "wrapped").length;
  const activeCount = assets.filter((a) => activeStatuses.has(a.status)).length;
  const pendingDocs = documents.filter((d) => d.status_id === "review" || d.status_id === "draft").length;
  const approvedDocs = documents.filter((d) => d.status_id === "approved" || d.status_id === "issued").length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Box className="size-4 text-muted-foreground" />
            Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasSet || assets.length === 0 ? (
            <p className="text-muted-foreground text-xs">No assets assigned</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <Metric label="Total" value={assets.length} />
              <Metric label="Active" value={activeCount} />
              <Metric label="Returned" value={returnedCount} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="size-4 text-muted-foreground" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasSet || documents.length === 0 ? (
            <p className="text-muted-foreground text-xs">No documents linked</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <Metric label="Total" value={documents.length} />
              <Metric label="Pending" value={pendingDocs} />
              <Metric label="Approved" value={approvedDocs} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Film className="size-4 text-muted-foreground" />
            Scene usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasSet || scenes.length === 0 ? (
            <p className="text-muted-foreground text-xs">No scene usage available</p>
          ) : (
            <Metric label="Scenes" value={scenes.length} />
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Wallet className="size-4 text-muted-foreground" />
            Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SetSectionEmpty
            icon={Wallet}
            title="Accounting unavailable"
            description="Planned, committed, actual, and forecast roll up when production-cost persistence is connected."
          />
        </CardContent>
      </Card>
    </div>
  );
}
