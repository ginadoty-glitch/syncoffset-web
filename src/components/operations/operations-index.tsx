import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import {
  ProductionReadTable,
  ProductionReadTableBody,
  ProductionReadTableHead,
  ProductionReadTd,
  ProductionReadTh,
  ProductionReadTr,
} from "@/components/production-read/production-read-table";
import type { ProductionTaskRow } from "@/lib/operations/types";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import { cn } from "@/lib/utils";

function statusTone(status: string): string {
  switch (status) {
    case "done":
      return "border-[var(--desk-jade)]/40 bg-[var(--desk-jade)]/10 text-[var(--desk-jade)]";
    case "in_progress":
      return "border-[var(--desk-marigold)]/40 bg-[var(--desk-marigold)]/10 text-[var(--desk-marigold)]";
    case "blocked":
      return "border-[var(--desk-risk)]/40 bg-[var(--desk-risk)]/10 text-[var(--desk-risk)]";
    default:
      return "border-border bg-muted/30 text-muted-foreground";
  }
}

function formatDue(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function OperationsIndex({ data }: { data: ProductionReadResult<ProductionTaskRow> }) {
  return (
    <ProductionReadShell
      eyebrow="Production · Operations"
      title="Operations"
      subtitle="Read-only · production_tasks · operational queue from Expo"
      tableLabel="production_tasks"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No tasks in"
    >
      <ProductionReadTable>
        <ProductionReadTableHead>
          <ProductionReadTh>Task</ProductionReadTh>
          <ProductionReadTh>Status</ProductionReadTh>
          <ProductionReadTh>Priority</ProductionReadTh>
          <ProductionReadTh>Assignee</ProductionReadTh>
          <ProductionReadTh>Due</ProductionReadTh>
          <ProductionReadTh>Link</ProductionReadTh>
        </ProductionReadTableHead>
        <ProductionReadTableBody>
          {data.rows.map((row) => (
            <ProductionReadTr key={row.id}>
              <ProductionReadTd>
                <p className="font-medium">{row.title}</p>
                {row.notes?.trim() ? <p className="mt-0.5 text-muted-foreground text-xs">{row.notes.trim()}</p> : null}
              </ProductionReadTd>
              <ProductionReadTd>
                <span
                  className={cn(
                    "inline-block rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
                    statusTone(row.status),
                  )}
                >
                  {row.status.replace(/_/g, " ")}
                </span>
              </ProductionReadTd>
              <ProductionReadTd className="capitalize text-muted-foreground">{row.priority}</ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground">{row.assignee_name ?? "—"}</ProductionReadTd>
              <ProductionReadTd className="tabular-nums text-muted-foreground text-xs">
                {formatDue(row.due_at)}
              </ProductionReadTd>
              <ProductionReadTd className="font-mono text-muted-foreground text-xs">
                {row.link_type ? `${row.link_type}${row.linked_id ? ` · ${row.linked_id.slice(0, 8)}…` : ""}` : "—"}
              </ProductionReadTd>
            </ProductionReadTr>
          ))}
        </ProductionReadTableBody>
      </ProductionReadTable>
    </ProductionReadShell>
  );
}
