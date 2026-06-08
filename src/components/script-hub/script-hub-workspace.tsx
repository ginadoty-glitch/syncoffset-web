"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEPARTMENT_LENSES, filterItemsByDepartmentLens } from "@/lib/script-hub/department-lenses";
import type {
  BreakdownItemStatus,
  DepartmentLensId,
  SceneStatus,
  ScriptHubBreakdownItemRow,
  ScriptHubData,
  ScriptImportKind,
  ScriptSourceType,
} from "@/lib/script-hub/types";
import { cn } from "@/lib/utils";

function hubHref(scriptId: string, sceneId?: string | null): string {
  const params = new URLSearchParams({ scriptId });
  if (sceneId) params.set("sceneId", sceneId);
  return `/dashboard/script-hub?${params.toString()}`;
}

function formatRevision(script: NonNullable<ScriptHubData["selectedScript"]>): string {
  const parts = [script.version_label];
  if (script.revision_color?.trim()) parts.push(script.revision_color.trim());
  return parts.join(" · ");
}

function formatImportKind(kind: ScriptImportKind): string {
  switch (kind) {
    case "full_script":
      return "Full script";
    case "revision_pages":
      return "Revision pages";
    case "pdf_breakdown":
      return "PDF breakdown";
    default:
      return kind;
  }
}

function formatSourceType(sourceType: ScriptSourceType): string {
  switch (sourceType) {
    case "pasted":
      return "Pasted";
    case "uploaded":
      return "Uploaded";
    case "pdf_breakdown":
      return "PDF breakdown";
    default:
      return sourceType;
  }
}

function formatUpdatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function sceneStatusTone(status: SceneStatus): string {
  switch (status) {
    case "active":
      return "border-border bg-muted/40 text-muted-foreground";
    case "superseded":
      return "border-[var(--desk-marigold)]/40 bg-[var(--desk-marigold)]/10 text-[var(--desk-marigold)]";
    case "omitted":
      return "border-[var(--desk-risk)]/40 bg-[var(--desk-risk)]/10 text-[var(--desk-risk)]";
    default:
      return "border-border bg-muted/40 text-muted-foreground";
  }
}

function itemStatusTone(status: BreakdownItemStatus): string {
  switch (status) {
    case "draft":
      return "border-[var(--desk-marigold)]/40 bg-[var(--desk-marigold)]/10 text-[var(--desk-marigold)]";
    case "approved":
      return "border-[var(--desk-jade)]/40 bg-[var(--desk-jade)]/10 text-[var(--desk-jade)]";
    case "ignored":
      return "border-border bg-muted/30 text-muted-foreground";
    default:
      return "border-border bg-muted/30 text-muted-foreground";
  }
}

function formatSlotLabel(value: string | null): string {
  if (!value?.trim()) return "—";
  return value.replace(/_/g, " ");
}

function formatMoney(value: number | null, quantity: number): string | null {
  if (value == null || Number.isNaN(Number(value))) return null;
  const unit = Number(value);
  const total = unit * (quantity > 0 ? quantity : 1);
  return `$${unit.toFixed(2)} ea · $${total.toFixed(2)} est`;
}

function sceneMetaParts(scene: ScriptHubData["scenes"][number]): string[] {
  const bd = scene.breakdown_draft ?? {};
  const intExt = typeof bd.int_ext === "string" ? bd.int_ext.trim() : null;
  const subLoc = typeof bd.sub_location === "string" ? bd.sub_location.trim() : null;
  return [
    intExt ?? null,
    scene.time_of_day?.trim() ?? null,
    subLoc ? `(${subLoc})` : null,
    scene.location_name?.trim() ?? null,
  ].filter(Boolean) as string[];
}

export function ScriptHubWorkspace({ data, showName }: { data: ScriptHubData; showName?: string | null }) {
  const { selectedScript, scenes, breakdownItems, selectedSceneId, budgetByItemId } = data;
  const [departmentLens, setDepartmentLens] = useState<DepartmentLensId>("all");
  const [rawTextOpen, setRawTextOpen] = useState(false);

  const selectedScene = useMemo(() => scenes.find((s) => s.id === selectedSceneId) ?? null, [scenes, selectedSceneId]);

  const filteredBreakdownItems = useMemo(
    () => filterItemsByDepartmentLens(breakdownItems, departmentLens),
    [breakdownItems, departmentLens],
  );

  return (
    <div className="flex h-[calc(100vh-var(--dashboard-header-height)-3rem)] min-h-[480px] flex-col gap-4">
      <header className="flex shrink-0 items-start justify-between gap-4">
        <div>
          {showName ? <h1 className="font-extrabold text-2xl tracking-tight">{showName}</h1> : null}
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Production · Script</p>
          {showName ? (
            <h2 className="text-xl tracking-tight">Script</h2>
          ) : (
            <h1 className="text-2xl tracking-tight">Script</h1>
          )}
          <p className="text-muted-foreground text-sm">
            {data.scripts.length > 0
              ? `${data.sceneCount} scenes · ${data.breakdownItemCount} breakdown items`
              : "Production script viewer and scene breakdown workspace."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/ingestion/upload?kind=script-revision">
              <FileText className="mr-2 size-4" />
              Upload Revision
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/ingestion/upload?kind=script-revision">
              <Upload className="mr-2 size-4" />
              Upload Script
            </Link>
          </Button>
        </div>
      </header>

      {data.loadError ? (
        <div
          className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-destructive text-sm"
          role="alert"
        >
          {data.loadError}
        </div>
      ) : null}

      {!data.loadError && data.scripts.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-8 text-center text-muted-foreground text-sm">
          No scripts in <code className="rounded bg-muted px-1 text-xs">production_scripts</code> for this production.
        </div>
      ) : null}

      {!data.loadError && selectedScript ? (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left — script summary */}
          <aside className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 lg:col-span-3">
            <p className="text-muted-foreground text-xs uppercase tracking-widest">Script</p>

            {data.scripts.length > 1 ? (
              <nav className="flex flex-col gap-1 border-border border-b pb-3" aria-label="Scripts">
                {data.scripts.map((script) => (
                  <Link
                    key={script.id}
                    href={hubHref(script.id)}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-sm transition-colors",
                      script.id === selectedScript.id
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    {script.title}
                  </Link>
                ))}
              </nav>
            ) : null}

            {data.previousScriptTitle ? (
              <p className="rounded-md border border-[var(--desk-marigold)]/30 bg-[var(--desk-marigold)]/5 px-2 py-1.5 text-[var(--desk-marigold)] text-xs">
                Lineage · prior draft <span className="font-medium text-foreground">{data.previousScriptTitle}</span>
              </p>
            ) : null}

            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">Script name</dt>
                <dd className="font-medium">{selectedScript.title}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Revision</dt>
                <dd>{formatRevision(selectedScript)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Import kind</dt>
                <dd>{formatImportKind(selectedScript.import_kind)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Source type</dt>
                <dd>{formatSourceType(selectedScript.source_type)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Source document</dt>
                <dd className="break-all">{selectedScript.source_document_name?.trim() || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Updated</dt>
                <dd className="tabular-nums">{formatUpdatedAt(selectedScript.updated_at)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Scene count</dt>
                <dd className="tabular-nums">{data.sceneCount}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Breakdown item count</dt>
                <dd className="tabular-nums">{data.breakdownItemCount}</dd>
              </div>
            </dl>
          </aside>

          {/* Center — scene list */}
          <section className="flex min-h-0 flex-col rounded-lg border border-border bg-card lg:col-span-5">
            <div className="border-border border-b px-4 py-3">
              <h2 className="font-medium text-sm">Scenes</h2>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {scenes.length === 0 ? (
                <p className="px-4 py-6 text-muted-foreground text-sm">No scenes for this script.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {scenes.map((scene) => {
                    const isSelected = scene.id === selectedSceneId;
                    const meta = sceneMetaParts(scene);
                    return (
                      <li key={scene.id}>
                        <Link
                          href={hubHref(selectedScript.id, scene.id)}
                          className={cn(
                            "block px-4 py-3 transition-colors hover:bg-muted/50",
                            isSelected && "bg-muted/80",
                          )}
                          aria-current={isSelected ? "true" : undefined}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="shrink-0 font-mono text-muted-foreground text-xs tabular-nums">
                              {scene.scene_number ?? "—"}
                            </span>
                            <span className="min-w-0 flex-1 font-medium text-sm leading-snug">
                              {scene.scene_heading}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
                                sceneStatusTone(scene.scene_status),
                              )}
                            >
                              {scene.scene_status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-muted-foreground text-xs">
                            {scene.location_name ? <span>{scene.location_name}</span> : null}
                            {scene.time_of_day ? <span>{scene.time_of_day}</span> : null}
                            {meta.map((part) => (
                              <span key={part}>{part}</span>
                            ))}
                          </div>
                          {scene.change_summary?.trim() ? (
                            <p className="mt-1.5 text-muted-foreground text-xs leading-snug">
                              {scene.change_summary.trim()}
                            </p>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {selectedScene ? (
              <div className="border-border border-t px-4 py-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left text-sm"
                  onClick={() => setRawTextOpen((open) => !open)}
                  aria-expanded={rawTextOpen}
                >
                  <span className="font-medium">Scene raw text</span>
                  <span className="text-muted-foreground text-xs">{rawTextOpen ? "Hide" : "Show"}</span>
                </button>
                {rawTextOpen ? (
                  <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-muted/20 p-3 font-mono text-xs leading-relaxed">
                    {selectedScene.raw_text.trim() || "—"}
                  </pre>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Right — breakdown items */}
          <section className="flex min-h-0 flex-col rounded-lg border border-border bg-card lg:col-span-4">
            <div className="space-y-3 border-border border-b px-4 py-3">
              <div>
                <h2 className="font-medium text-sm">Breakdown items</h2>
                {selectedSceneId ? (
                  <p className="text-muted-foreground text-xs">
                    Scene {selectedScene?.scene_number ?? selectedScene?.scene_heading ?? selectedSceneId}
                  </p>
                ) : null}
              </div>
              <fieldset className="flex flex-wrap gap-1.5 border-0 p-0">
                <legend className="sr-only">Department lenses</legend>
                <LensPill active={departmentLens === "all"} label="All" onClick={() => setDepartmentLens("all")} />
                {DEPARTMENT_LENSES.map((lens) => (
                  <LensPill
                    key={lens.id}
                    active={departmentLens === lens.id}
                    label={lens.label}
                    onClick={() => setDepartmentLens(lens.id)}
                  />
                ))}
              </fieldset>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {!selectedSceneId ? (
                <p className="px-4 py-6 text-muted-foreground text-sm">Select a scene.</p>
              ) : filteredBreakdownItems.length === 0 ? (
                <p className="px-4 py-6 text-muted-foreground text-sm">
                  {breakdownItems.length === 0
                    ? "No breakdown items for this scene."
                    : "No items match this department lens."}
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {filteredBreakdownItems.map((item) => (
                    <BreakdownItemRow key={item.id} item={item} budgetLink={budgetByItemId[item.id] ?? null} />
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function LensPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2 py-0.5 text-[11px] transition-colors",
        active
          ? "border-[var(--desk-marigold)]/50 bg-[var(--desk-marigold)]/10 text-foreground"
          : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40",
      )}
    >
      {label}
    </button>
  );
}

function BreakdownItemRow({
  item,
  budgetLink,
}: {
  item: ScriptHubBreakdownItemRow;
  budgetLink: ScriptHubData["budgetByItemId"][string] | null;
}) {
  const costLabel = formatMoney(item.estimated_unit_cost, item.quantity);

  return (
    <li className="px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 flex-1 font-medium text-sm leading-snug">{item.label}</p>
        <span
          className={cn(
            "shrink-0 rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
            itemStatusTone(item.status),
          )}
        >
          {item.status}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {budgetLink ? (
          <span className="rounded border border-[var(--desk-jade)]/40 bg-[var(--desk-jade)]/10 px-1.5 py-0.5 text-[10px] text-[var(--desk-jade)]">
            Budget linked · {budgetLink.status}
          </span>
        ) : (
          <span className="rounded border border-border bg-muted/20 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            No budget line
          </span>
        )}
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <div>
          <dt className="text-muted-foreground">Department</dt>
          <dd>{item.department ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Category</dt>
          <dd>{item.category ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Quantity</dt>
          <dd className="tabular-nums">
            {item.quantity}
            {item.unit?.trim() ? ` ${item.unit}` : ""}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Estimated cost</dt>
          <dd className="tabular-nums">{costLabel ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Item slot</dt>
          <dd>{formatSlotLabel(item.item_slot)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Source column</dt>
          <dd>{formatSlotLabel(item.source_column)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted-foreground">Element type</dt>
          <dd>{item.element_type ?? "—"}</dd>
        </div>
        {item.notes?.trim() ? (
          <div className="col-span-2">
            <dt className="text-muted-foreground">Notes</dt>
            <dd className="leading-snug">{item.notes.trim()}</dd>
          </div>
        ) : null}
      </dl>
    </li>
  );
}
