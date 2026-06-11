"use client";

import { useMemo, useState, useTransition } from "react";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { BudgetLineDialog } from "@/components/budget/budget-line-dialog";
import { Button } from "@/components/ui/button";
import { BUDGET_DEPARTMENTS } from "@/lib/budget/departments";
import type { ProductionBudgetLineRow } from "@/lib/live-budget/types";
import { cn } from "@/lib/utils";
import { deleteBudgetLine } from "@/server/budget-actions";

function money(value: number | null | undefined): string {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `$${Number(value).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function varianceTone(variance: number): string {
  if (variance > 0) return "text-[var(--desk-risk)]";
  if (variance < 0) return "text-[var(--desk-jade)]";
  return "text-muted-foreground";
}

function statusTone(status: string): string {
  switch (status) {
    case "approved":
      return "border-[var(--desk-jade)]/40 bg-[var(--desk-jade)]/10 text-[var(--desk-jade)]";
    case "actualized":
      return "border-[var(--desk-marigold)]/40 bg-[var(--desk-marigold)]/10 text-[var(--desk-marigold)]";
    default:
      return "border-border bg-muted/30 text-muted-foreground";
  }
}

type DepartmentGroup = {
  department: string;
  rows: ProductionBudgetLineRow[];
  estimated: number;
  actual: number;
  variance: number;
};

function groupByDepartment(rows: ProductionBudgetLineRow[]): DepartmentGroup[] {
  const byDept = new Map<string, ProductionBudgetLineRow[]>();
  for (const row of rows) {
    const dept = row.department?.trim() || "Unassigned";
    const list = byDept.get(dept) ?? [];
    list.push(row);
    byDept.set(dept, list);
  }

  const ordered: string[] = [
    ...BUDGET_DEPARTMENTS.filter((d) => byDept.has(d)),
    ...[...byDept.keys()].filter((d) => !(BUDGET_DEPARTMENTS as readonly string[]).includes(d)).sort(),
  ];

  return ordered.map((department) => {
    const deptRows = byDept.get(department) ?? [];
    const estimated = deptRows.reduce((sum, r) => sum + Number(r.estimated_cost ?? 0), 0);
    const actual = deptRows.reduce((sum, r) => sum + Number(r.actual_cost ?? 0), 0);
    return { department, rows: deptRows, estimated, actual, variance: actual - estimated };
  });
}

export function BudgetWorkspace({
  rows,
  showName,
  loadError,
}: {
  rows: ProductionBudgetLineRow[];
  showName?: string | null;
  loadError: string | null;
}) {
  const [dialogState, setDialogState] = useState<{
    key: number;
    line: ProductionBudgetLineRow | null;
    department?: string;
  } | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const groups = useMemo(() => groupByDepartment(rows), [rows]);
  const totalEstimated = groups.reduce((s, g) => s + g.estimated, 0);
  const totalActual = groups.reduce((s, g) => s + g.actual, 0);
  const totalVariance = totalActual - totalEstimated;

  function openCreate(department?: string) {
    setDialogState({ key: Date.now(), line: null, department });
  }

  function openEdit(line: ProductionBudgetLineRow) {
    setDialogState({ key: Date.now(), line });
  }

  function handleDelete(line: ProductionBudgetLineRow) {
    startDelete(async () => {
      const result = await deleteBudgetLine(line.id);
      if (result.ok) {
        toast.success("Budget line removed");
      } else {
        toast.error(result.error);
      }
      setPendingDeleteId(null);
    });
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          {showName ? <h1 className="font-extrabold text-2xl tracking-tight">{showName}</h1> : null}
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Finance · Budget</p>
          <h2 className="text-xl tracking-tight">Budget</h2>
          <p className="text-muted-foreground text-sm">
            {rows.length > 0
              ? `${rows.length} cost lines · ${groups.length} departments`
              : "Department cost lines — manual entry, staged against external accounting."}
          </p>
        </div>
        <Button size="sm" onClick={() => openCreate()}>
          <Plus className="mr-2 size-4" />
          Add Budget Line
        </Button>
      </header>

      {loadError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive text-sm">
          {loadError}
        </div>
      ) : null}

      {/* Production total strip */}
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
        <div className="bg-card px-4 py-3">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Estimated</p>
          <p className="font-semibold text-lg tabular-nums">{money(totalEstimated)}</p>
        </div>
        <div className="bg-card px-4 py-3">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Actual</p>
          <p className="font-semibold text-lg tabular-nums">{money(totalActual)}</p>
        </div>
        <div className="bg-card px-4 py-3">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Variance</p>
          <p className={cn("font-semibold text-lg tabular-nums", varianceTone(totalVariance))}>
            {totalVariance > 0 ? "+" : ""}
            {money(totalVariance)}
          </p>
        </div>
      </div>

      {rows.length === 0 && !loadError ? (
        <div className="rounded-lg border border-dashed px-6 py-16 text-center text-muted-foreground text-sm">
          No cost lines yet. Add the first budget line to begin tracking department spend.
        </div>
      ) : null}

      {groups.map((group) => (
        <section key={group.department} className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center justify-between gap-3 border-border border-b bg-muted/30 px-4 py-2.5">
            <h3 className="font-medium text-sm">{group.department}</h3>
            <div className="flex items-center gap-4 text-xs tabular-nums">
              <span className="text-muted-foreground">
                Est <span className="font-medium text-foreground">{money(group.estimated)}</span>
              </span>
              <span className="text-muted-foreground">
                Actual <span className="font-medium text-foreground">{money(group.actual)}</span>
              </span>
              <span className={cn("font-medium", varianceTone(group.variance))}>
                {group.variance > 0 ? "+" : ""}
                {money(group.variance)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => openCreate(group.department)}
              >
                <Plus className="mr-1 size-3" />
                Line
              </Button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b text-left text-muted-foreground text-xs">
                <th className="px-4 py-2 font-medium">Description</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">Vendor</th>
                <th className="px-4 py-2 text-right font-medium">Qty</th>
                <th className="px-4 py-2 text-right font-medium">Rate</th>
                <th className="px-4 py-2 text-right font-medium">Est.</th>
                <th className="px-4 py-2 text-right font-medium">Actual</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="w-[88px] px-2 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {group.rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30">
                  <td className="px-4 py-2 font-medium">{row.description || "—"}</td>
                  <td className="px-4 py-2 text-muted-foreground">{row.category === "Misc" ? "—" : row.category}</td>
                  <td className="px-4 py-2 text-muted-foreground">{row.vendor ?? "—"}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{Number(row.quantity)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{money(row.unit_cost)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{money(row.estimated_cost)}</td>
                  <td className="px-4 py-2 text-right text-muted-foreground tabular-nums">{money(row.actual_cost)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={cn(
                        "inline-block rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
                        statusTone(row.status),
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-7 p-0"
                        onClick={() => openEdit(row)}
                        aria-label={`Edit ${row.description}`}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      {pendingDeleteId === row.id ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          disabled={isDeleting}
                          onClick={() => handleDelete(row)}
                        >
                          {isDeleting ? "…" : "Confirm"}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => setPendingDeleteId(row.id)}
                          aria-label={`Delete ${row.description}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      {dialogState ? (
        <BudgetLineDialog
          key={dialogState.key}
          open
          onOpenChange={(open) => {
            if (!open) setDialogState(null);
          }}
          line={dialogState.line}
          defaultDepartment={dialogState.department}
        />
      ) : null}
    </div>
  );
}
