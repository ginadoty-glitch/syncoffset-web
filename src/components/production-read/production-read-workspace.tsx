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
    <div className="grid min-h-[480px] overflow-hidden rounded-xl border border-[var(--desk-border-subtle)] bg-card lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
      <div className="flex flex-col border-[var(--desk-border-subtle)] border-b lg:border-r lg:border-b-0">
        <div className="border-[var(--desk-border-subtle)] border-b p-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 text-[13px]"
          />
          <p className="mt-2 font-mono text-[10px] text-[var(--desk-text-dim)] uppercase tracking-[0.06em]">
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
                    "w-full border-[var(--desk-border-subtle)] border-b px-3 py-2.5 text-left transition-colors",
                    active
                      ? "border-l-2 border-l-[var(--desk-primary)] bg-[var(--desk-row-selected)]"
                      : "hover:bg-[var(--desk-hover)]",
                  )}
                >
                  <p className="text-[13px] font-semibold leading-[18px]">{renderListLabel(row)}</p>
                  {meta ? (
                    <p className="mt-0.5 truncate text-[11px] leading-[15px] text-muted-foreground">{meta}</p>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="overflow-y-auto p-4 md:p-5">
        {selected ? (
          renderDetail(selected)
        ) : (
          <p className="text-muted-foreground text-[13px]">{emptySelectionMessage}</p>
        )}
      </div>
    </div>
  );
}
