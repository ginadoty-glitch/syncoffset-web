import Link from "next/link";

import { Upload } from "lucide-react";

import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import {
  ProductionReadTable,
  ProductionReadTableBody,
  ProductionReadTableHead,
  ProductionReadTd,
  ProductionReadTh,
  ProductionReadTr,
} from "@/components/production-read/production-read-table";
import { Button } from "@/components/ui/button";
import type { ProductionDocumentRow } from "@/lib/production-documents/types";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import { cn } from "@/lib/utils";

function formatKind(kind: string): string {
  return kind.replace(/_/g, " ");
}

function extractStatusTone(status: string): string {
  switch (status) {
    case "extracted":
      return "border-[var(--desk-jade)]/40 bg-[var(--desk-jade)]/10 text-[var(--desk-jade)]";
    case "pending":
    case "needs_ocr":
      return "border-[var(--desk-marigold)]/40 bg-[var(--desk-marigold)]/10 text-[var(--desk-marigold)]";
    case "failed":
      return "border-[var(--desk-risk)]/40 bg-[var(--desk-risk)]/10 text-[var(--desk-risk)]";
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

export function ProductionDocumentsIndex({
  data,
  showName,
}: {
  data: ProductionReadResult<ProductionDocumentRow>;
  showName?: string | null;
}) {
  return (
    <ProductionReadShell
      showName={showName}
      eyebrow="Production · Documents"
      title="Production Documents"
      subtitle="Call sheets, memos, and production files"
      tableLabel="production_documents"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No documents in"
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/ingestion/upload?kind=script-revision&label=Script+Revision">
              <Upload className="mr-2 size-4" />
              Upload Script
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/ingestion/upload?kind=shoot-schedule&label=Shooting+Schedule">
              <Upload className="mr-2 size-4" />
              Upload Schedule
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/ingestion/upload?kind=other&label=Production+Document">
              <Upload className="mr-2 size-4" />
              Upload Document
            </Link>
          </Button>
        </>
      }
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
              <ProductionReadTd className="text-muted-foreground capitalize">
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
              <ProductionReadTd className="text-right text-muted-foreground text-xs tabular-nums">
                {row.page_count ?? "—"} / {row.row_count ?? "—"}
              </ProductionReadTd>
              <ProductionReadTd className="text-right text-muted-foreground text-xs tabular-nums">
                {formatUpdatedAt(row.updated_at)}
              </ProductionReadTd>
            </ProductionReadTr>
          ))}
        </ProductionReadTableBody>
      </ProductionReadTable>
    </ProductionReadShell>
  );
}
