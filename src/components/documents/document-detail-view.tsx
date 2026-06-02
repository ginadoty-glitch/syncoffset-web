import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentDetailWithSet } from "@/lib/documents/document-set-queries";
import { DOCUMENT_CATEGORY_REGISTRY } from "@/types/core/document/document-category";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function DocumentDetailView({ detail }: { detail: DocumentDetailWithSet }) {
  const { document: doc, linkedSet } = detail;
  const categoryLabel = DOCUMENT_CATEGORY_REGISTRY[doc.category_id]?.label ?? doc.category_id;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link href={linkedSet ? `/dashboard/sets/${linkedSet.id}` : "/dashboard/sets"}>
          {linkedSet ? `← ${linkedSet.set_name}` : "← All sets"}
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <span className="font-mono text-muted-foreground text-xs tabular-nums">{doc.document_number}</span>
        <h1 className="text-2xl tracking-tight">{doc.title}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{categoryLabel}</Badge>
          <Badge variant="secondary" className="capitalize">
            {doc.status_id}
          </Badge>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Linked set</CardTitle>
        </CardHeader>
        <CardContent>
          {linkedSet ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm">
                <span className="font-mono text-muted-foreground">{linkedSet.set_number}</span> — {linkedSet.set_name}
              </p>
              <p className="text-muted-foreground text-xs">
                Constitutional link via <code className="rounded bg-muted px-1">documents.set_id</code>
              </p>
              <Button variant="outline" size="sm" className="w-fit" asChild>
                <Link href={`/dashboard/sets/${linkedSet.id}`}>Open set workspace</Link>
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No set assigned. Use Link Document on a set workspace.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Document record</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <Row label="Document ID" value={doc.id} mono />
          <Row label="Production ID" value={doc.production_id} mono />
          <Row label="Set ID" value={doc.set_id ?? "—"} mono />
          <Row label="Set number" value={doc.set_number ?? "—"} />
          <Row label="Source document" value={doc.source_document_id ?? "—"} mono />
          <Row label="Created" value={formatDate(doc.created_at)} />
          {doc.notes && <Row label="Notes" value={doc.notes} />}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "break-all font-mono text-xs" : ""}>{value}</span>
    </div>
  );
}
