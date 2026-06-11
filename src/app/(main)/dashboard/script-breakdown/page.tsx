import Link from "next/link";

import { Upload } from "lucide-react";

import { ScriptIntelligence } from "@/components/script-breakdown/script-intelligence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getActiveShow } from "@/lib/production/get-active-show";
import { loadScriptHub } from "@/lib/script-hub/load-script-hub";

export const dynamic = "force-dynamic";

function intExtFromHeading(heading: string): string | null {
  const m = heading.match(/^(?:\*+\s*)?(INT\.?\/?EXT\.?|EXT\.?\/?INT\.?|INT\.?|EXT\.?)\s/i);
  return m?.[1]?.replace(/\./g, "").toUpperCase() ?? null;
}

export default async function ScriptBreakdownPage() {
  const [data, show] = await Promise.all([loadScriptHub(), getActiveShow()]);

  const hasScenes = data.scenes.length > 0;

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex shrink-0 items-start justify-between gap-4">
        <div>
          <h1 className="font-extrabold text-2xl tracking-tight">{show.name}</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
          <h2 className="text-xl tracking-tight">Script Breakdown</h2>
          <p className="text-muted-foreground text-sm">
            {hasScenes
              ? `${data.sceneCount} scenes · ${data.selectedScript?.title ?? "Script"} · ${data.selectedScript?.version_label ?? ""}`
              : "Scene-by-scene breakdown of production elements, departments, and requirements."}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {data.selectedScript && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/script-hub?scriptId=${data.selectedScript.id}`}>Open Script →</Link>
            </Button>
          )}
          <Button size="sm" asChild>
            <Link href="/ingestion/upload?kind=script-revision&label=Script+Revision">
              <Upload className="mr-2 size-4" />
              Upload Script
            </Link>
          </Button>
        </div>
      </header>

      {data.loadError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive text-sm">
          {data.loadError}
        </div>
      )}

      {hasScenes && <ScriptIntelligence scenes={data.scenes} />}

      {!hasScenes ? (
        <div className="rounded-lg border border-dashed px-6 py-16 text-center text-muted-foreground text-sm">
          No scenes yet. Upload a script to populate the breakdown.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Scene</TableHead>
                <TableHead className="w-[70px]">INT/EXT</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[100px]">Day/Night</TableHead>
                <TableHead className="w-[70px]">Pages</TableHead>
                <TableHead>Heading</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[120px] text-right">Breakdown Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.scenes.map((scene) => {
                const bd = (scene.breakdown_draft ?? {}) as Record<string, unknown>;
                const ie =
                  (typeof bd.int_ext === "string" && bd.int_ext.trim()) || intExtFromHeading(scene.scene_heading);
                const pages = typeof bd.pages === "string" && bd.pages.trim() ? bd.pages.trim() : null;
                const itemCount = data.itemCountBySceneId[scene.id] ?? 0;
                return (
                  <TableRow key={scene.id}>
                    <TableCell className="font-mono font-semibold text-sm">{scene.scene_number ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{ie || "—"}</TableCell>
                    <TableCell className="font-medium text-sm">{scene.location_name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{scene.time_of_day ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs tabular-nums">{pages ?? "—"}</TableCell>
                    <TableCell className="max-w-[300px] truncate text-muted-foreground text-xs">
                      {scene.scene_heading}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[10px] uppercase">
                        {scene.scene_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {itemCount > 0 ? (
                        <Link
                          href={`/dashboard/script-hub?scriptId=${scene.script_id}&sceneId=${scene.id}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {itemCount} item{itemCount === 1 ? "" : "s"}
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/script-hub?scriptId=${scene.script_id}&sceneId=${scene.id}`}
                          className="text-muted-foreground underline-offset-2 hover:underline"
                        >
                          + Add
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
