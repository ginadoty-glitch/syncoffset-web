"use server";

import { revalidatePath } from "next/cache";

import { type DocumentListOption, listDocumentsForLinking } from "@/lib/documents/document-set-queries";
import { getDefaultProductionId } from "@/lib/ingestion/production";
import { createServiceClient } from "@/lib/supabase/server";

export async function fetchDocumentsForLinking(): Promise<DocumentListOption[]> {
  return listDocumentsForLinking();
}

export type LinkDocumentToSetResult = { ok: true } | { ok: false; error: string };

/**
 * Manual Document → Set link via documents.set_id (constitutional Document belongs to Set).
 */
export async function linkDocumentToSet(documentId: string, setId: string): Promise<LinkDocumentToSetResult> {
  if (!documentId?.trim() || !setId?.trim()) {
    return { ok: false, error: "Document and set are required." };
  }

  const supabase = createServiceClient();

  const [{ data: document, error: docError }, { data: set, error: setError }] = await Promise.all([
    supabase.from("documents").select("id, production_id, set_id").eq("id", documentId).maybeSingle(),
    supabase.from("production_sets").select("id, production_id, set_number, set_name").eq("id", setId).maybeSingle(),
  ]);

  if (docError || !document) {
    return { ok: false, error: "Document not found." };
  }
  if (setError || !set) {
    return { ok: false, error: "Set not found." };
  }

  const productionId = await getDefaultProductionId();
  if (document.production_id !== productionId || set.production_id !== productionId) {
    return { ok: false, error: "Document and set must belong to the current production." };
  }

  const { error: updateError } = await supabase
    .from("documents")
    .update({
      set_id: setId,
      set_number: set.set_number,
      modified_at: new Date().toISOString(),
    })
    .eq("id", documentId);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  revalidatePath("/dashboard/sets");
  revalidatePath(`/dashboard/sets/${setId}`);
  revalidatePath(`/dashboard/documents/${documentId}`);

  return { ok: true };
}
