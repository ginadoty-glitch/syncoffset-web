import type { DocumentRevisionRow, DocumentRow } from "@/lib/ingestion/document-rows";
import { revisionTimelineLabel } from "@/lib/ingestion/revision-label";
import { type SourceDocumentQueueItem, type SourceDocumentRow, toQueueItem } from "@/lib/ingestion/source-document-row";
import { createServiceClient } from "@/lib/supabase/server";
import { SOURCE_INGESTION_REGISTRY } from "@/types/core/source/ingestion-registry";

export type SourceDocumentDetail = {
  sourceDocument: SourceDocumentRow;
  document: DocumentRow | null;
  revision: DocumentRevisionRow | null;
};

export type TimelineEntry = {
  sourceDocumentId: string;
  revisionId: string;
  revisionNumber: number;
  label: string;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
  ingestionStatus: string;
};

export type DocumentTimeline = {
  documentId: string;
  documentTitle: string;
  sourceKindLabel: string;
  entries: TimelineEntry[];
};

async function chainLinksForSourceIds(
  sourceIds: string[],
): Promise<Map<string, { documentId: string; documentRevisionId: string }>> {
  const map = new Map<string, { documentId: string; documentRevisionId: string }>();
  if (sourceIds.length === 0) return map;

  const supabase = createServiceClient();
  const { data: revisions } = await supabase
    .from("document_revisions")
    .select("id, document_id, source_document_id")
    .in("source_document_id", sourceIds);

  for (const rev of revisions ?? []) {
    if (rev.source_document_id) {
      map.set(rev.source_document_id, {
        documentId: rev.document_id,
        documentRevisionId: rev.id,
      });
    }
  }
  return map;
}

export async function listSourceDocumentsForQueue(): Promise<SourceDocumentQueueItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("source_documents").select("*").order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load source documents: ${error.message}`);
  }

  const rows = data as SourceDocumentRow[];
  const links = await chainLinksForSourceIds(rows.map((r) => r.id));

  return rows.map((row) => toQueueItem(row, links.get(row.id)));
}

export async function getSourceDocumentDetail(id: string): Promise<SourceDocumentDetail | null> {
  const supabase = createServiceClient();
  const { data: sourceDocument, error } = await supabase
    .from("source_documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !sourceDocument) {
    return null;
  }

  const row = sourceDocument as SourceDocumentRow;
  const { data: revision } = await supabase
    .from("document_revisions")
    .select("*")
    .eq("source_document_id", id)
    .maybeSingle();

  let document: DocumentRow | null = null;
  if (revision) {
    const { data: doc } = await supabase.from("documents").select("*").eq("id", revision.document_id).maybeSingle();
    document = doc as DocumentRow | null;
  }

  return {
    sourceDocument: row,
    document,
    revision: revision as DocumentRevisionRow | null,
  };
}

export async function getDocumentTimelineForSourceDocument(sourceDocumentId: string): Promise<DocumentTimeline | null> {
  const detail = await getSourceDocumentDetail(sourceDocumentId);
  if (!detail?.revision || !detail.document) {
    return null;
  }

  const supabase = createServiceClient();
  const documentId = detail.document.id;

  const { data: revisions } = await supabase
    .from("document_revisions")
    .select("*")
    .eq("document_id", documentId)
    .order("revision_number", { ascending: true });

  if (!revisions?.length) {
    return null;
  }

  const sourceIds = revisions.map((r) => r.source_document_id).filter(Boolean) as string[];
  const { data: sources } = await supabase.from("source_documents").select("*").in("id", sourceIds);

  const sourceById = new Map((sources as SourceDocumentRow[] | null)?.map((s) => [s.id, s]) ?? []);

  const kind = detail.sourceDocument.source_document_kind;
  const kindLabel = SOURCE_INGESTION_REGISTRY[kind]?.label ?? kind;

  const entries: TimelineEntry[] = revisions.map((rev) => {
    const revRow = rev as DocumentRevisionRow;
    const sd = revRow.source_document_id ? sourceById.get(revRow.source_document_id) : undefined;
    const fileName = sd?.immutable.originalFileName ?? "—";
    return {
      sourceDocumentId: revRow.source_document_id ?? "",
      revisionId: revRow.id,
      revisionNumber: revRow.revision_number,
      label: revisionTimelineLabel(revRow.revision_number, revRow.revision_color, fileName),
      fileName,
      uploadedAt: sd?.immutable.uploadedAt ?? revRow.revision_recorded_at,
      uploadedBy: sd?.immutable.uploadedBy ?? revRow.revision_recorded_by,
      ingestionStatus: sd?.ingestion_status ?? "—",
    };
  });

  return {
    documentId,
    documentTitle: detail.document.title,
    sourceKindLabel: kindLabel,
    entries,
  };
}
