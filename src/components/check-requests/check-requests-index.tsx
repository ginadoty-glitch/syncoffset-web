import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import {
  ProductionReadTable,
  ProductionReadTableBody,
  ProductionReadTableHead,
  ProductionReadTd,
  ProductionReadTh,
  ProductionReadTr,
} from "@/components/production-read/production-read-table";
import type { ProductionCheckRequestRow } from "@/lib/check-requests/types";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import { cn } from "@/lib/utils";

function money(amount: number | null, currency: string): string {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  return `${currency} ${Number(amount).toFixed(2)}`;
}

function statusTone(status: string): string {
  switch (status) {
    case "approved":
    case "paid":
      return "border-[var(--desk-jade)]/40 bg-[var(--desk-jade)]/10 text-[var(--desk-jade)]";
    case "submitted":
      return "border-[var(--desk-marigold)]/40 bg-[var(--desk-marigold)]/10 text-[var(--desk-marigold)]";
    case "denied":
    case "canceled":
      return "border-[var(--desk-risk)]/40 bg-[var(--desk-risk)]/10 text-[var(--desk-risk)]";
    default:
      return "border-border bg-muted/30 text-muted-foreground";
  }
}

export function CheckRequestsIndex({
  data,
  showName,
}: {
  data: ProductionReadResult<ProductionCheckRequestRow>;
  showName?: string | null;
}) {
  return (
    <ProductionReadShell
      showName={showName}
      eyebrow="Finance · Check Requests"
      title="Check Requests"
      subtitle="Read-only · production_check_requests · staged payment intent"
      tableLabel="production_check_requests"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No check requests in"
    >
      <ProductionReadTable>
        <ProductionReadTableHead>
          <ProductionReadTh>Request #</ProductionReadTh>
          <ProductionReadTh>Vendor</ProductionReadTh>
          <ProductionReadTh>Scope</ProductionReadTh>
          <ProductionReadTh className="text-right">Amount</ProductionReadTh>
          <ProductionReadTh>Payment</ProductionReadTh>
          <ProductionReadTh>Status</ProductionReadTh>
        </ProductionReadTableHead>
        <ProductionReadTableBody>
          {data.rows.map((row) => (
            <ProductionReadTr key={row.id}>
              <ProductionReadTd className="font-mono text-xs">
                {row.request_number ?? row.id.slice(0, 8)}
              </ProductionReadTd>
              <ProductionReadTd className="font-medium">{row.vendor_name ?? "—"}</ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground capitalize">
                {row.request_scope.replace(/_/g, " ")}
              </ProductionReadTd>
              <ProductionReadTd className="text-right tabular-nums">
                {money(row.requested_amount, row.currency_code)}
              </ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground text-xs capitalize">
                {row.payment_method_requested}
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
