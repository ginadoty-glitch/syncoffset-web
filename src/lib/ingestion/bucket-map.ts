import type { SourceDocumentKind } from "@/types/core/source/source-document-kind";

/** Phase 3 storage buckets — must match supabase/migrations/20260531000000_storage_buckets.sql */
export const STORAGE_BUCKETS = [
  "scripts",
  "callsheets",
  "production-calendars",
  "shooting-schedules",
  "receipts",
  "purchase-orders",
  "commercial-invoices",
  "brokerage",
  "returns",
  "vendor-documents",
  "photos",
  "reference-media",
] as const;

export type StorageBucketId = (typeof STORAGE_BUCKETS)[number];

const SOURCE_KIND_TO_BUCKET: Record<SourceDocumentKind, StorageBucketId> = {
  "script-revision": "scripts",
  "shoot-schedule": "shooting-schedules",
  "one-liner": "production-calendars",
  "prep-schedule": "production-calendars",
  "callsheet-revision": "callsheets",
  "breakdown-package": "scripts",
  "location-package": "reference-media",
  "crew-list": "production-calendars",
  "cast-list": "production-calendars",
  dood: "production-calendars",
  "vendor-document": "vendor-documents",
  permit: "reference-media",
  "reference-media": "reference-media",
};

export function bucketForSourceKind(kind: SourceDocumentKind): StorageBucketId {
  return SOURCE_KIND_TO_BUCKET[kind];
}

export function buildStorageObjectPath(productionId: string, sourceDocumentId: string, fileName: string): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${productionId}/${sourceDocumentId}/${safeName}`;
}

/** Constitutional `SourceFileReference.storageRef` — bucket + object path. */
export function buildStorageRef(
  bucket: StorageBucketId,
  productionId: string,
  sourceDocumentId: string,
  fileName: string,
): string {
  return `${bucket}/${buildStorageObjectPath(productionId, sourceDocumentId, fileName)}`;
}
