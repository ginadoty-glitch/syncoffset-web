import type { DocumentRow } from "@/lib/ingestion/document-rows";
import { getDefaultProductionId } from "@/lib/ingestion/production";
import type { ProductionSetRow } from "@/lib/sets/workspace-types";
import { createServiceClient } from "@/lib/supabase/server";

export type DocumentListOption = {
  id: string;
  title: string;
  documentNumber: string;
  categoryId: string;
  statusId: string;
  setId: string | null;
};

export type DocumentDetailWithSet = {
  document: DocumentRow;
  linkedSet: ProductionSetRow | null;
};

export async function listDocumentsForLinking(productionId?: string): Promise<DocumentListOption[]> {
  const supabase = createServiceClient();
  const pid = productionId ?? getDefaultProductionId();

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, document_number, category_id, status_id, set_id")
    .eq("production_id", pid)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list documents: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    documentNumber: row.document_number as string,
    categoryId: row.category_id as string,
    statusId: row.status_id as string,
    setId: row.set_id as string | null,
  }));
}

export async function getDocumentDetailWithSet(documentId: string): Promise<DocumentDetailWithSet | null> {
  const supabase = createServiceClient();

  const { data: document, error } = await supabase.from("documents").select("*").eq("id", documentId).maybeSingle();

  if (error || !document) {
    return null;
  }

  const doc = document as DocumentRow;
  let linkedSet: ProductionSetRow | null = null;

  if (doc.set_id) {
    const { data: set } = await supabase.from("production_sets").select("*").eq("id", doc.set_id).maybeSingle();
    linkedSet = set as ProductionSetRow | null;
  }

  return { document: doc, linkedSet };
}
