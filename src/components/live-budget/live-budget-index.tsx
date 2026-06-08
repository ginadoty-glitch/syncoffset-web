import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import {
  ProductionReadTable,
  ProductionReadTableBody,
  ProductionReadTableHead,
  ProductionReadTd,
  ProductionReadTh,
  ProductionReadTr,
} from "@/components/production-read/production-read-table";
import type { ProductionBudgetLineRow } from "@/lib/live-budget/types";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import { cn } from "@/lib/utils";

function money(value: number | null): string {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `$${Number(value).toFixed(2)}`;
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

export function LiveBudgetIndex({
  data,
  showName,
}: {
  data: ProductionReadResult<ProductionBudgetLineRow>;
  showName?: string | null;
}) {
  return (
    <ProductionReadShell
      showName={showName}
      eyebrow="Finance · Live Budget"
      title="Live Budget"
      subtitle="Read-only · production_budget_lines · pressure surface excerpt"
      tableLabel="production_budget_lines"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No budget lines in"
    >
      <ProductionReadTable>
        <ProductionReadTableHead>
          <ProductionReadTh>Description</ProductionReadTh>
          <ProductionReadTh>Category</ProductionReadTh>
          <ProductionReadTh>Department</ProductionReadTh>
          <ProductionReadTh>Source</ProductionReadTh>
          <ProductionReadTh className="text-right">Est.</ProductionReadTh>
          <ProductionReadTh className="text-right">Actual</ProductionReadTh>
          <ProductionReadTh>Status</ProductionReadTh>
        </ProductionReadTableHead>
        <ProductionReadTableBody>
          {data.rows.map((row) => (
            <ProductionReadTr key={row.id}>
              <ProductionReadTd>
                <span className="font-medium">{row.description || "—"}</span>
              </ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground">{row.category}</ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground">{row.department ?? "—"}</ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground text-xs">
                {row.source_type.replace(/_/g, " ")}
              </ProductionReadTd>
              <ProductionReadTd className="text-right tabular-nums">{money(row.estimated_cost)}</ProductionReadTd>
              <ProductionReadTd className="text-right text-muted-foreground tabular-nums">
                {money(row.actual_cost)}
              </ProductionReadTd>
              <ProductionReadTd>
                <span
                  className={cn(
                    "inline-block rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
                    statusTone(row.status),
                  )}
                >
                  {row.status}
                </span>
              </ProductionReadTd>
            </ProductionReadTr>
          ))}
        </ProductionReadTableBody>
      </ProductionReadTable>
    </ProductionReadShell>
  );
}
