import type { IngestionStatus } from "@/lib/ingestion/ingestion-status";

/**
 * Manual ingestion_status transitions (Phase 3B). No AI/automation.
 * @see docs/DOCUMENT_CHAIN_VALIDATION.md
 */
export const INGESTION_TRANSITIONS: Record<IngestionStatus, readonly IngestionStatus[]> = {
  uploaded: ["processing", "review", "failed"],
  processing: ["review", "failed"],
  review: ["approved", "rejected", "failed"],
  approved: [],
  rejected: [],
  failed: ["uploaded"],
};

export function canTransition(from: IngestionStatus, to: IngestionStatus): boolean {
  return INGESTION_TRANSITIONS[from].includes(to);
}

export function assertTransition(from: IngestionStatus, to: IngestionStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid ingestion transition: ${from} → ${to}`);
  }
}
