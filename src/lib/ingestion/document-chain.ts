import type { SupabaseClient } from "@supabase/supabase-js";

import {
  defaultDocumentTitle,
  documentCategoryForSourceKind,
  documentNumberForFamily,
} from "@/lib/ingestion/category-map";
import type { DocumentRevisionRow, DocumentRow } from "@/lib/ingestion/document-rows";
import { parseRevisionColorFromFileName } from "@/lib/ingestion/revision-label";
import type { SourceDocumentRow } from "@/lib/ingestion/source-document-row";
import type { SourceDocumentKind } from "@/types/core/source/source-document-kind";
import type { VersionChainEntry } from "@/types/core/source/version-chain";

import { randomUUID } from "node:crypto";

export type DocumentChainResult = {
  documentId: string;
  documentRevisionId: string;
  documentCreated: boolean;
  revisionNumber: number;
};

/**
 * Completes Upload → SourceDocument → DocumentRevision → Document.
 * Reuses existing Document when same production + source_document_kind family exists.
 */
export async function completeDocumentChain(
  supabase: SupabaseClient,
  params: {
    sourceDocument: SourceDocumentRow;
    productionId: string;
    sourceDocumentKind: SourceDocumentKind;
    uploadedBy: string;
    now: string;
  },
): Promise<DocumentChainResult> {
  const { sourceDocument, productionId, sourceDocumentKind, uploadedBy, now } = params;
  const sourceDocumentId = sourceDocument.id;

  const existing = await findExistingDocumentForKind(supabase, productionId, sourceDocumentKind);

  let documentId: string;
  let documentCreated = false;
  let revisionIds: string[] = [];

  if (existing) {
    documentId = existing.id;
    revisionIds = [...existing.document_revision_ids];
  } else {
    documentId = randomUUID();
    documentCreated = true;
    const categoryId = documentCategoryForSourceKind(sourceDocumentKind);
    const docRow: DocumentRow = {
      id: documentId,
      production_id: productionId,
      kind: "document",
      status: "draft",
      created_by: uploadedBy,
      created_at: now,
      modified_by: uploadedBy,
      modified_at: now,
      source_document_id: sourceDocumentId,
      source_version_id: null,
      relationships: [],
      document_number: documentNumberForFamily(productionId, sourceDocumentKind),
      title: defaultDocumentTitle(sourceDocumentKind),
      category_id: categoryId,
      status_id: "draft",
      notes: "",
      set_id: null,
      set_number: null,
      scene_id: null,
      document_revision_ids: [],
      document_package_ids: [],
      document_link_ids: [],
      generated_output_ids: [],
    };

    const { error } = await supabase.from("documents").insert(docRow);
    if (error) {
      throw new Error(`Document insert failed: ${error.message}`);
    }
  }

  const revisionNumber = revisionIds.length + 1;
  const revisionId = randomUUID();
  const revisionColor = parseRevisionColorFromFileName(sourceDocument.immutable.originalFileName) ?? null;

  const revisionRow: DocumentRevisionRow = {
    id: revisionId,
    production_id: productionId,
    kind: "document-revision",
    status: "draft",
    created_by: uploadedBy,
    created_at: now,
    modified_by: uploadedBy,
    modified_at: now,
    source_document_id: sourceDocumentId,
    source_version_id: revisionId,
    relationships: [],
    document_id: documentId,
    revision_number: revisionNumber,
    revision_color: revisionColor,
    revision_recorded_at: now,
    revision_recorded_by: uploadedBy,
  };

  const { error: revError } = await supabase.from("document_revisions").insert(revisionRow);
  if (revError) {
    if (documentCreated) {
      await supabase.from("documents").delete().eq("id", documentId);
    }
    throw new Error(`Document revision insert failed: ${revError.message}`);
  }

  revisionIds = [...revisionIds, revisionId];

  const versionEntry: VersionChainEntry = {
    documentId,
    versionNumber: revisionNumber,
    versionLabel: revisionColor ?? `Rev ${revisionNumber}`,
    recordedAt: now,
    sourceDocumentKind,
  };

  const { error: docUpdateError } = await supabase
    .from("documents")
    .update({
      document_revision_ids: revisionIds,
      source_document_id: sourceDocumentId,
      source_version_id: revisionId,
      modified_by: uploadedBy,
      modified_at: now,
      status_id: "review",
    })
    .eq("id", documentId);

  if (docUpdateError) {
    throw new Error(`Document update failed: ${docUpdateError.message}`);
  }

  const { error: sdUpdateError } = await supabase
    .from("source_documents")
    .update({
      source_version_id: revisionId,
      version_chain: [...sourceDocument.version_chain, versionEntry],
      modified_by: uploadedBy,
      modified_at: now,
      ingestion_status: "review",
    })
    .eq("id", sourceDocumentId);

  if (sdUpdateError) {
    throw new Error(`Source document update failed: ${sdUpdateError.message}`);
  }

  return {
    documentId,
    documentRevisionId: revisionId,
    documentCreated,
    revisionNumber,
  };
}

async function findExistingDocumentForKind(
  supabase: SupabaseClient,
  productionId: string,
  sourceDocumentKind: SourceDocumentKind,
): Promise<DocumentRow | null> {
  const { data: revisions, error } = await supabase
    .from("document_revisions")
    .select("document_id, source_document_id")
    .eq("production_id", productionId);

  if (error || !revisions?.length) {
    return null;
  }

  const sourceIds = revisions.map((r) => r.source_document_id).filter(Boolean) as string[];
  if (sourceIds.length === 0) {
    return null;
  }

  const { data: sources } = await supabase
    .from("source_documents")
    .select("id, source_document_kind")
    .in("id", sourceIds)
    .eq("source_document_kind", sourceDocumentKind);

  if (!sources?.length) {
    return null;
  }

  const matchingSourceIds = new Set(sources.map((s) => s.id));
  const documentId = revisions.find(
    (r) => r.source_document_id && matchingSourceIds.has(r.source_document_id),
  )?.document_id;

  if (!documentId) {
    return null;
  }

  const { data: doc } = await supabase.from("documents").select("*").eq("id", documentId).maybeSingle();

  return doc as DocumentRow | null;
}
