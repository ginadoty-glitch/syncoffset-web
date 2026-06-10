"use client";

import { ProductionReadDetailField } from "@/components/production-read/production-read-detail-field";
import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import { ProductionReadWorkspace } from "@/components/production-read/production-read-workspace";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
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
      return "border-[var(--desk-border-subtle)] bg-muted/30 text-muted-foreground";
  }
}

function formatDue(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function TasksIndex({
  data,
  showName,
}: {
  data: ProductionReadResult<ProductionTaskRow>;
  showName?: string | null;
}) {
  return (
    <ProductionReadShell
      showName={showName}
      eyebrow="Production · Tasks"
      title="Tasks"
      subtitle="Prep tasks, meetings, and action items"
      tableLabel="production_tasks"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No tasks in"
      actions={<CreateTaskDialog />}
    >
      <ProductionReadWorkspace
        rows={data.rows}
        searchPlaceholder="Search tasks…"
        getSearchText={(row) =>
          [row.title, row.notes ?? "", row.status, row.priority, row.assignee_name ?? ""].join(" ")
        }
        renderListLabel={(row) => row.title}
        renderListMeta={(row) =>
          [row.status.replace(/_/g, " "), row.assignee_name, row.priority].filter(Boolean).join(" · ")
        }
        renderDetail={(row) => (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-extrabold text-[15px] tracking-[-0.02em]">{row.title}</h2>
              <span
                className={cn(
                  "inline-block rounded-full border px-2 py-0.5 font-bold text-[10px] uppercase tracking-[0.04em]",
                  statusTone(row.status),
                )}
              >
                {row.status.replace(/_/g, " ")}
              </span>
            </div>
            <dl className="mt-3">
              <ProductionReadDetailField label="Priority" value={row.priority} />
              <ProductionReadDetailField label="Assigned to" value={row.assignee_name} />
              <ProductionReadDetailField label="Due" value={formatDue(row.due_at)} />
              <ProductionReadDetailField label="Notes" value={row.notes?.trim() || null} />
              <ProductionReadDetailField
                label="Link"
                value={row.link_type ? `${row.link_type}${row.linked_id ? ` · ${row.linked_id}` : ""}` : null}
                mono
              />
            </dl>
          </div>
        )}
      />
    </ProductionReadShell>
  );
}
