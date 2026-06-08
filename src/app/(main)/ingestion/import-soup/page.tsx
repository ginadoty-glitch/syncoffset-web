"use client";

import { useState } from "react";

import { CheckCircle2, Database, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { importSoupProductionData } from "@/server/soup-import-action";

export default function ImportSoupPage() {
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<{ tables: Record<string, number>; errors: string[] } | null>(null);

  async function handleImport() {
    setState("running");
    try {
      const res = await importSoupProductionData();
      setResult(res);
      setState(res.ok ? "done" : "error");
    } catch (e) {
      setResult({ tables: {}, errors: [e instanceof Error ? e.message : "Unknown error"] });
      setState("error");
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-[900px] flex-col gap-6 px-4 py-8 md:px-6">
      <header>
        <p className="text-muted-foreground text-xs uppercase tracking-widest">Ingestion</p>
        <h1 className="text-2xl tracking-tight">Import Production Data — Alphabet Soup</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Populates schedule days, locations, crew contacts, and prep tasks from the 4 production documents.
        </p>
      </header>

      <div className="rounded-lg border border-border p-6">
        <h2 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Import Summary</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Database className="size-4 text-muted-foreground" />
            <span className="font-medium">shows</span> — update production metadata (1 record)
          </li>
          <li className="flex items-center gap-2">
            <Database className="size-4 text-muted-foreground" />
            <span className="font-medium">production_schedule_revisions</span> — published revision (1 record)
          </li>
          <li className="flex items-center gap-2">
            <Database className="size-4 text-muted-foreground" />
            <span className="font-medium">production_schedule_days</span> — 21 shoot days
          </li>
          <li className="flex items-center gap-2">
            <Database className="size-4 text-muted-foreground" />
            <span className="font-medium">locations</span> — 14 locations
          </li>
          <li className="flex items-center gap-2">
            <Database className="size-4 text-muted-foreground" />
            <span className="font-medium">crew_contacts</span> — 39 cast & key crew
          </li>
          <li className="flex items-center gap-2">
            <Database className="size-4 text-muted-foreground" />
            <span className="font-medium">production_tasks</span> — 25 prep tasks
          </li>
        </ul>

        <div className="mt-6 flex items-center gap-4">
          <Button onClick={handleImport} disabled={state === "running" || state === "done"} className="min-w-[180px]">
            {state === "running" && <Loader2 className="mr-2 size-4 animate-spin" />}
            {state === "done" && <CheckCircle2 className="mr-2 size-4" />}
            {state === "error" && <XCircle className="mr-2 size-4" />}
            {state === "idle" && "Import Production Data"}
            {state === "running" && "Importing…"}
            {state === "done" && "Import Complete"}
            {state === "error" && "Retry Import"}
          </Button>
        </div>

        {result && (
          <div className="mt-6 rounded-md border border-border bg-muted/30 p-4">
            <h3 className="mb-2 font-semibold text-sm">
              {result.errors.length === 0 ? "All tables populated" : "Import completed with errors"}
            </h3>
            {Object.entries(result.tables).length > 0 && (
              <ul className="space-y-1 text-sm">
                {Object.entries(result.tables).map(([table, count]) => (
                  <li key={table} className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    <span className="font-mono text-xs">{table}</span>
                    <span className="text-muted-foreground">→ {count} records</span>
                  </li>
                ))}
              </ul>
            )}
            {result.errors.length > 0 && (
              <ul className="mt-3 space-y-1 text-red-400 text-sm">
                {result.errors.map((err, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <XCircle className="size-3.5" />
                    {err}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
