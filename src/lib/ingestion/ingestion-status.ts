/**
 * Phase 3 ingestion pipeline status — persisted on `source_documents.ingestion_status`.
 * Not a CoreObjectKind; operational column only (see DOCUMENT_TABLE_MAPPING.md).
 */

export const INGESTION_STATUSES = ["uploaded", "processing", "review", "approved", "rejected", "failed"] as const;

export type IngestionStatus = (typeof INGESTION_STATUSES)[number];

export function isIngestionStatus(value: string): value is IngestionStatus {
  return (INGESTION_STATUSES as readonly string[]).includes(value);
}
