"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ProductionReadWorkspaceProps<T extends { id: string }> = {
  rows: T[];
  searchPlaceholder: string;
  getSearchText: (row: T) => string;
  renderListLabel: (row: T) => string;
  renderListMeta?: (row: T) => string | null;
  renderDetail: (row: T) => React.ReactNode;
  emptySelectionMessage?: string;
};

export function ProductionReadWorkspace<T extends { id: string }>({
  rows,
  searchPlaceholder,
  getSearchText,
  renderListLabel,
  renderListMeta,
  renderDetail,
  emptySelectionMessage = "Select a row to view details.",
}: ProductionReadWorkspaceProps<T>) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(rows[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => getSearchText(row).toLowerCase().includes(q));
  }, [query, rows, getSearchText]);

  const selected = filtered.find((row) => row.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="grid min-h-[480px] overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
      <div className="flex flex-col border-border border-b lg:border-r lg:border-b-0">
        <div className="border-border border-b p-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 text-sm"
          />
          <p className="mt-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Showing {filtered.length} of {rows.length}
          </p>
        </div>
        <ul className="max-h-[520px] overflow-y-auto">
          {filtered.map((row) => {
            const active = selected?.id === row.id;
            const meta = renderListMeta?.(row);
            return (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(row.id)}
                  className={cn(
                    "w-full border-border border-b px-3 py-2.5 text-left transition-colors",
                    active ? "bg-muted/50" : "hover:bg-muted/30",
                  )}
                >
                  <p className="font-medium text-sm">{renderListLabel(row)}</p>
                  {meta ? <p className="mt-0.5 truncate text-muted-foreground text-xs">{meta}</p> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="overflow-y-auto p-4 md:p-6">
        {selected ? renderDetail(selected) : <p className="text-muted-foreground text-sm">{emptySelectionMessage}</p>}
      </div>
    </div>
  );
}
