import type { DocumentCategory } from "@/types/core/document/document-category";
import { SOURCE_INGESTION_REGISTRY } from "@/types/core/source/ingestion-registry";
import type { SourceDocumentKind } from "@/types/core/source/source-document-kind";

/**
 * Maps Article I source kind → Document Authority category (constitutional vocabulary).
 * One logical Document per (production_id, source_document_kind) for revision stacking.
 */
const SOURCE_KIND_TO_CATEGORY: Record<SourceDocumentKind, DocumentCategory> = {
  "script-revision": "script-revision",
  "shoot-schedule": "calendar",
  "one-liner": "one-liner",
  "callsheet-revision": "callsheet",
  "breakdown-package": "reference",
  "location-package": "location-agreement",
  "crew-list": "reference",
  "cast-list": "reference",
  dood: "calendar",
  "vendor-document": "other",
  permit: "permit",
  "reference-media": "reference",
};

export function documentCategoryForSourceKind(kind: SourceDocumentKind): DocumentCategory {
  return SOURCE_KIND_TO_CATEGORY[kind];
}

export function defaultDocumentTitle(kind: SourceDocumentKind): string {
  return SOURCE_INGESTION_REGISTRY[kind].label;
}

export function documentNumberForFamily(productionId: string, kind: SourceDocumentKind): string {
  const short = productionId.replace(/-/g, "").slice(0, 8).toUpperCase();
  const kindSlug = kind.replace(/-/g, "_").toUpperCase();
  return `DOC-${kindSlug}-${short}`;
}
