import { loadForShow } from "@/lib/production-read/load-for-show";

import type { ProductionDocumentRow } from "./types";

const SELECT =
  "id, show_id, title, source_file_name, file_type, source_kind, storage_path, text_extract_status, is_read_only, page_count, row_count, created_at, updated_at" as const;

export async function loadProductionDocuments() {
  return loadForShow<ProductionDocumentRow>("production_documents", SELECT, {
    column: "updated_at",
    ascending: false,
  });
}
