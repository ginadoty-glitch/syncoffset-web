import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SourceDocumentQueueItem } from "@/lib/ingestion/source-document-row";
import { SOURCE_INGESTION_REGISTRY } from "@/types/core/source/ingestion-registry";

import { IngestionQueueActions } from "./ingestion-queue-actions";

function formatUploadDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function IngestionQueueTable({ items }: { items: SourceDocumentQueueItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-6 py-16 text-center text-muted-foreground text-sm">
        No uploaded source documents yet. Upload a file to see it here.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Source Kind</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const label = SOURCE_INGESTION_REGISTRY[item.sourceDocumentKind]?.label ?? item.sourceDocumentKind;
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.fileName}</TableCell>
                <TableCell>{label}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatUploadDate(item.uploadedAt)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase">
                    {item.ingestionStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.uploadedBy}</TableCell>
                <TableCell className="text-right">
                  <IngestionQueueActions sourceDocumentId={item.id} ingestionStatus={item.ingestionStatus} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
