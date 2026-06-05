export type ProductionDocumentSourceKind =
  | "script"
  | "breakdown"
  | "budget"
  | "buy_list"
  | "check_request"
  | "petty_cash"
  | "receipt"
  | "vendor_list"
  | "crew_list"
  | "other";

export type ProductionDocumentFileType = "pdf" | "csv" | "xlsx" | "numbers" | "txt" | "other";

export type ProductionDocumentTextExtractStatus = "pending" | "extracted" | "needs_ocr" | "failed";

export type ProductionDocumentRow = {
  id: string;
  show_id: string;
  title: string;
  source_file_name: string;
  file_type: ProductionDocumentFileType;
  source_kind: ProductionDocumentSourceKind;
  storage_path: string | null;
  text_extract_status: ProductionDocumentTextExtractStatus;
  is_read_only: boolean;
  page_count: number | null;
  row_count: number | null;
  created_at: string;
  updated_at: string;
};
