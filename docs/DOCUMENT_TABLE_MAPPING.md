# Document Table Mapping — Constitution → Postgres

Every column maps to an existing field in `src/types/core`. No parallel schema.

---

## `source_documents` ← `ImmutableSourceDocument` + `AuditableCoreObject`

| SQL column | TS source | Notes |
|------------|-----------|-------|
| `id` | `AuditableCoreObject.id` | `ObjectId` → UUID |
| `production_id` | `AuditableCoreObject.productionId` | UUID |
| `kind` | `ImmutableSourceDocument.kind` | Always `'source-document'` |
| `status` | `ImmutableSourceDocument.status` | `SourceDocumentStatus`: draft \| active \| issued \| superseded \| archived |
| `ingestion_status` | *(Phase 3 pipeline)* | **Not** in TS type; operational column on same table per sprint spec. Enum: uploaded \| processing \| review \| approved \| rejected \| failed |
| `created_by` | `AuditableCoreObject.createdBy` | TEXT |
| `created_at` | `AuditableCoreObject.createdAt` | TIMESTAMPTZ ← `Timestamp` ISO string |
| `modified_by` | `AuditableCoreObject.modifiedBy` | TEXT |
| `modified_at` | `AuditableCoreObject.modifiedAt` | TIMESTAMPTZ |
| `source_document_id` | `AuditableCoreObject.sourceDocumentId?` | Optional FK self-reference |
| `source_version_id` | `AuditableCoreObject.sourceVersionId?` | UUID nullable |
| `relationships` | `AuditableCoreObject.relationships` | JSONB `CoreRelationship[]` |
| `source_document_kind` | `ImmutableSourceDocument.sourceDocumentKind` | `SourceDocumentKind` CHECK |
| `immutable` | `ImmutableSourceDocument.immutable` | JSONB `ImmutableSourceMetadata` |
| `source_file` | `ImmutableSourceDocument.sourceFile` | JSONB `SourceFileReference` |
| `version_chain` | `ImmutableSourceDocument.versionChain` | JSONB `VersionChainEntry[]` |
| `supersession` | `ImmutableSourceDocument.supersession` | JSONB `SupersededByRelationship` |
| `ingestion` | `ImmutableSourceDocument.ingestion` | JSONB `SourceIngestionProvenance` |

### `immutable` JSON keys (`ImmutableSourceMetadata`)

| JSON key | TS field |
|----------|----------|
| `isImmutable` | `immutable.isImmutable` (always `true`) |
| `originalFileName` | `immutable.originalFileName` |
| `uploadedAt` | `immutable.uploadedAt` |
| `uploadedBy` | `immutable.uploadedBy` |
| `author?` | `immutable.author` |
| `title?` | `immutable.title` |
| `ref?` | `immutable.ref` |
| `extractionHistoryIds` | `immutable.extractionHistoryIds` |

### `source_file` JSON keys (`SourceFileReference`)

| JSON key | TS field |
|----------|----------|
| `storageRef` | `sourceFile.storageRef` |
| `originalFileName` | `sourceFile.originalFileName` |
| `mimeType` | `sourceFile.mimeType` |
| `mimeCategory?` | `sourceFile.mimeCategory` |
| `byteSize` | `sourceFile.byteSize` |
| `checksumSha256` | `sourceFile.checksumSha256` |
| `receivedAt` | `sourceFile.receivedAt` |

### `ingestion` JSON keys (`SourceIngestionProvenance`)

| JSON key | TS field |
|----------|----------|
| `sourceDocumentId` | `ingestion.sourceDocumentId` |
| `sourceDocumentIds?` | `ingestion.sourceDocumentIds` |
| `sourceSystem` | `ingestion.sourceSystem` |
| `sourceVersion` | `ingestion.sourceVersion` |
| `importedAt` | `ingestion.importedAt` |
| `importedBy` | `ingestion.importedBy` |

---

## `documents` ← `Document` + `AuditableCoreObject`

| SQL column | TS source | Notes |
|------------|-----------|-------|
| `id` | `AuditableCoreObject.id` | UUID |
| `production_id` | `AuditableCoreObject.productionId` | UUID |
| `kind` | `Document.kind` | `'document'` |
| `status` | `AuditableCoreObject.status` | `CoreObjectStatus` |
| `created_by` | `AuditableCoreObject.createdBy` | TEXT |
| `created_at` | `AuditableCoreObject.createdAt` | TIMESTAMPTZ |
| `modified_by` | `AuditableCoreObject.modifiedBy` | TEXT |
| `modified_at` | `AuditableCoreObject.modifiedAt` | TIMESTAMPTZ |
| `source_document_id` | `AuditableCoreObject.sourceDocumentId?` | FK → `source_documents` |
| `source_version_id` | `AuditableCoreObject.sourceVersionId?` | UUID nullable |
| `relationships` | `AuditableCoreObject.relationships` | JSONB |
| `document_number` | `Document.documentNumber` | TEXT |
| `title` | `Document.title` | TEXT |
| `category_id` | `Document.categoryId` | `DocumentCategory` |
| `status_id` | `Document.statusId` | `DocumentStatus` (document lifecycle, distinct from `status`) |
| `notes` | `Document.notes` | TEXT |
| `set_id` | `Document.setId?` | UUID nullable |
| `set_number` | `Document.setNumber?` | TEXT nullable |
| `scene_id` | `Document.sceneId?` | UUID nullable |
| `document_revision_ids` | `Document.documentRevisionIds` | JSONB `ObjectId[]` |
| `document_package_ids` | `Document.documentPackageIds` | JSONB |
| `document_link_ids` | `Document.documentLinkIds` | JSONB |
| `generated_output_ids` | `Document.generatedOutputIds` | JSONB |

**Phase 3 upload:** rows not inserted yet; table ready for Phase 4 chain completion.

---

## `document_revisions` ← `DocumentRevision` + `AuditableCoreObject`

| SQL column | TS source | Notes |
|------------|-----------|-------|
| `id` | `AuditableCoreObject.id` | UUID |
| `production_id` | `AuditableCoreObject.productionId` | UUID |
| `kind` | `DocumentRevision.kind` | `'document-revision'` |
| `status` | `AuditableCoreObject.status` | `CoreObjectStatus` |
| `created_by` | `AuditableCoreObject.createdBy` | TEXT |
| `created_at` | `AuditableCoreObject.createdAt` | TIMESTAMPTZ |
| `modified_by` | `AuditableCoreObject.modifiedBy` | TEXT |
| `modified_at` | `AuditableCoreObject.modifiedAt` | TIMESTAMPTZ |
| `source_document_id` | `DocumentRevision.sourceDocumentId?` | FK → `source_documents` |
| `source_version_id` | `AuditableCoreObject.sourceVersionId?` | UUID nullable |
| `relationships` | `AuditableCoreObject.relationships` | JSONB |
| `document_id` | `DocumentRevision.documentId` | FK → `documents` |
| `revision_number` | `DocumentRevision.revisionNumber` | INTEGER |
| `revision_color` | `DocumentRevision.revisionColor?` | `CalendarRevisionColor` nullable |
| `revision_recorded_at` | `DocumentRevision.createdAt` | TIMESTAMPTZ — revision event time |
| `revision_recorded_by` | `DocumentRevision.createdBy` | TEXT — revision actor |

**Note:** `DocumentRevision` declares both auditable `createdAt`/`createdBy` and revision-specific `createdAt`/`createdBy`. At insert time these are identical; both map to auditable columns **and** `revision_recorded_*` for explicit constitutional alignment.

---

## Storage `storageRef` convention

```
{bucketId}/{productionId}/{sourceDocumentId}/{sanitizedOriginalFileName}
```

`bucketId` from `src/lib/ingestion/bucket-map.ts` (`SourceDocumentKind` → bucket).
