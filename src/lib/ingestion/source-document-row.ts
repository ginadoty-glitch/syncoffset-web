import type { IngestionStatus } from "@/lib/ingestion/ingestion-status";
import type { CoreRelationship } from "@/types/core/base";
import type { ImmutableSourceMetadata, SourceDocumentStatus } from "@/types/core/source/immutable-source-document";
import type { SourceIngestionProvenance } from "@/types/core/source/provenance";
import type { SourceDocumentKind } from "@/types/core/source/source-document-kind";
import type { SourceFileReference } from "@/types/core/source/source-file";
import type { SupersededByRelationship, VersionChainEntry } from "@/types/core/source/version-chain";

/** Postgres row shape for `source_documents` — mirrors constitutional fields. */
export type SourceDocumentRow = {
  id: string;
  production_id: string;
  kind: "source-document";
  status: SourceDocumentStatus;
  ingestion_status: IngestionStatus;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
  source_document_id: string | null;
  source_version_id: string | null;
  relationships: CoreRelationship[];
  source_document_kind: SourceDocumentKind;
  immutable: ImmutableSourceMetadata;
  source_file: SourceFileReference;
  version_chain: VersionChainEntry[];
  supersession: SupersededByRelationship;
  ingestion: SourceIngestionProvenance;
};

/** Review queue projection. */
export type SourceDocumentQueueItem = {
  id: string;
  fileName: string;
  sourceDocumentKind: SourceDocumentKind;
  uploadedAt: string;
  ingestionStatus: IngestionStatus;
  uploadedBy: string;
  documentId: string | null;
  documentRevisionId: string | null;
};

export function toQueueItem(
  row: SourceDocumentRow,
  chain?: { documentId: string | null; documentRevisionId: string | null },
): SourceDocumentQueueItem {
  return {
    id: row.id,
    fileName: row.immutable.originalFileName,
    sourceDocumentKind: row.source_document_kind,
    uploadedAt: row.immutable.uploadedAt,
    ingestionStatus: row.ingestion_status,
    uploadedBy: row.immutable.uploadedBy,
    documentId: chain?.documentId ?? null,
    documentRevisionId: chain?.documentRevisionId ?? row.source_version_id ?? null,
  };
}
