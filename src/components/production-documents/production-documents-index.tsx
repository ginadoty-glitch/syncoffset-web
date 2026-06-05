import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import {
  ProductionReadTable,
  ProductionReadTableBody,
  ProductionReadTableHead,
  ProductionReadTd,
  ProductionReadTh,
  ProductionReadTr,
} from "@/components/production-read/production-read-table";
import type { ProductionDocumentRow } from "@/lib/production-documents/types";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import { cn } from "@/lib/utils";

function formatKind(kind: string): string {
  return kind.replace(/_/g, " ");
}

function extractStatusTone(status: string): string {
  switch (status) {
    case "extracted":
      return "border-[var(--desk-emerald)]/40 bg-[var(--desk-emerald)]/10 text-[var(--desk-emerald)]";
    case "pending":
    case "needs_ocr":
      return "border-[var(--desk-marigold)]/40 bg-[var(--desk-marigold)]/10 text-[var(--desk-marigold)]";
    case "failed":
      return "border-[var(--desk-red)]/40 bg-[var(--desk-red)]/10 text-[var(--desk-red)]";
    default:
      return "border-border bg-muted/30 text-muted-foreground";
  }
}

function formatUpdatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ProductionDocumentsIndex({ data }: { data: ProductionReadResult<ProductionDocumentRow> }) {
  return (
    <ProductionReadShell
      eyebrow="Production · Documents"
      title="Production Documents"
      subtitle="Read-only · archived sources from Expo · production_documents"
      tableLabel="production_documents"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No documents in"
    >
      <ProductionReadTable>
        <ProductionReadTableHead>
          <ProductionReadTh>Title</ProductionReadTh>
          <ProductionReadTh>Source kind</ProductionReadTh>
          <ProductionReadTh>File</ProductionReadTh>
          <ProductionReadTh>Extract</ProductionReadTh>
          <ProductionReadTh className="text-right">Pages / rows</ProductionReadTh>
          <ProductionReadTh className="text-right">Updated</ProductionReadTh>
        </ProductionReadTableHead>
        <ProductionReadTableBody>
          {data.rows.map((row) => (
            <ProductionReadTr key={row.id}>
              <ProductionReadTd>
                <p className="font-medium">{row.title}</p>
                {row.is_read_only ? <span className="text-muted-foreground text-xs">Read-only archive</span> : null}
              </ProductionReadTd>
              <ProductionReadTd className="capitalize text-muted-foreground">
                {formatKind(row.source_kind)}
              </ProductionReadTd>
              <ProductionReadTd>
                <span className="font-mono text-xs uppercase">{row.file_type}</span>
                <p className="mt-0.5 break-all text-muted-foreground text-xs">{row.source_file_name}</p>
              </ProductionReadTd>
              <ProductionReadTd>
                <span
                  className={cn(
                    "inline-block rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
                    extractStatusTone(row.text_extract_status),
                  )}
                >
                  {row.text_extract_status.replace(/_/g, " ")}
                </span>
              </ProductionReadTd>
              <ProductionReadTd className="text-right tabular-nums text-muted-foreground text-xs">
                {row.page_count ?? "—"} / {row.row_count ?? "—"}
              </ProductionReadTd>
              <ProductionReadTd className="text-right tabular-nums text-muted-foreground text-xs">
                {formatUpdatedAt(row.updated_at)}
              </ProductionReadTd>
            </ProductionReadTr>
          ))}
        </ProductionReadTableBody>
      </ProductionReadTable>
    </ProductionReadShell>
  );
}
