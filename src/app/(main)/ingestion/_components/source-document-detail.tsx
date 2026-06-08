import type { ReactNode } from "react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SourceDocumentDetail } from "@/lib/ingestion/queries";
import { getDocumentTimelineForSourceDocument } from "@/lib/ingestion/queries";
import { SOURCE_INGESTION_REGISTRY } from "@/types/core/source/ingestion-registry";

import { DocumentTimelineView } from "./document-timeline";
import { DownloadOriginalButton } from "./download-original-button";
import { IngestionDetailActions } from "./ingestion-detail-actions";

const SCHEDULE_KINDS = new Set(["shoot-schedule", "one-liner", "dood"]);

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export async function SourceDocumentDetailView({ detail }: { detail: SourceDocumentDetail }) {
  const { sourceDocument, document, revision } = detail;
  const kindLabel =
    SOURCE_INGESTION_REGISTRY[sourceDocument.source_document_kind]?.label ?? sourceDocument.source_document_kind;

  const timeline = await getDocumentTimelineForSourceDocument(sourceDocument.id);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/ingestion">← Upload History</Link>
          </Button>
          <h1 className="mt-2 text-xl tracking-tight">{sourceDocument.immutable.originalFileName}</h1>
          <p className="text-muted-foreground text-sm">Document detail — {kindLabel}</p>
        </div>
        <IngestionDetailActions
          sourceDocumentId={sourceDocument.id}
          ingestionStatus={sourceDocument.ingestion_status}
          sourceDocumentKind={sourceDocument.source_document_kind}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <Row label="File Name" value={sourceDocument.immutable.originalFileName} />
          <Row label="Document Type" value={kindLabel} />
          <Row label="Upload Date" value={formatDate(sourceDocument.immutable.uploadedAt)} />
          <Row label="Status">
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              {sourceDocument.ingestion_status}
            </Badge>
          </Row>
          <Row label="Storage Path" value={sourceDocument.source_file.storageRef} mono />
          <Row label="Document ID" value={document?.id ?? "—"} mono />
          {document?.id ? (
            <div className="sm:col-span-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/documents/${document.id}`}>Open document record</Link>
              </Button>
            </div>
          ) : null}
          <Row
            label="Linked set"
            value={document?.set_id ? (document.set_number ?? document.set_id) : "No set assigned"}
            mono={!!document?.set_id}
          />
          <Row label="Revision ID" value={revision?.id ?? "—"} mono />
          <Row label="Uploaded By" value={sourceDocument.immutable.uploadedBy} />
          <div className="pt-2">
            <DownloadOriginalButton sourceDocumentId={sourceDocument.id} />
          </div>
        </CardContent>
      </Card>

      {sourceDocument.ingestion_status === "approved" && SCHEDULE_KINDS.has(sourceDocument.source_document_kind) && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm">Schedule Import</p>
                <p className="text-muted-foreground text-xs">
                  This schedule has been parsed. Review and publish to the Production Calendar.
                </p>
              </div>
              <Button size="sm" asChild>
                <Link href={`/ingestion/${sourceDocument.id}/schedule-preview`}>View Schedule Preview</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {timeline && timeline.entries.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <DocumentTimelineView timeline={timeline} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  children,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
      <span className="text-muted-foreground">{label}</span>
      {children ?? <span className={mono ? "break-all font-mono text-xs" : ""}>{value}</span>}
    </div>
  );
}
