# Constitution → Runtime Mapping (Phase 3)

Maps constitutional kinds to runtime wiring after Phase 3 Supabase foundation sprint.

---

## Summary

| Kind / artifact | Types exist | DB table | Runtime read | Runtime write |
|-----------------|-------------|----------|--------------|---------------|
| `source-document` | Yes | `source_documents` | `/ingestion` | `/ingestion/upload` |
| `document-revision` | Yes | `document_revisions` | No | No |
| `document` | Yes | `documents` | No | No |

---

## `source-document` (`ImmutableSourceDocument`)

### What exists

| Layer | Location |
|-------|----------|
| Base contract | `src/types/core/source/immutable-source-document.ts` |
| Kind union | `src/types/core/source/source-document-kind.ts` |
| Typed variants | `src/types/core/source/source-documents.ts` |
| Ingestion registry | `src/types/core/source/ingestion-registry.ts` |
| File reference | `src/types/core/source/source-file.ts` |
| Provenance | `src/types/core/source/provenance.ts` |
| Version chain | `src/types/core/source/version-chain.ts` |
| Postgres | `supabase/migrations/20260531000100_constitutional_documents.sql` → `source_documents` |
| Row mapper | `src/lib/ingestion/source-document-row.ts` |
| Upload | `src/server/ingestion-actions.ts` |
| Queue UI | `src/app/(main)/ingestion/page.tsx` |

### What was disconnected (pre–Phase 3)

- Zero `src/app` imports of `@/types/core`
- No storage, no API, no rows

### Connected (Phase 3)

- Upload inserts row + storage object
- Queue lists `source_documents` with `ingestion_status`

### Still requires runtime (post–Phase 3)

- Promote `ingestion_status` through processing → review → approved/rejected
- Populate `version_chain` / `supersession` on revision uploads
- Link to `documents` + `document_revisions` on ingest complete
- Supabase Auth actor instead of free-text `uploadedBy`
- Per-production RLS (currently service role + broad authenticated policies)
- Extraction history append (`immutable.extractionHistoryIds`)

---

## `document-revision` (`DocumentRevision`)

### What exists

| Layer | Location |
|-------|----------|
| Type | `src/types/core/document/document-revision.ts` |
| Relationships | `src/types/core/document/document-relationship-contracts.ts` |
| Postgres | `document_revisions` table |
| Mapping doc | `docs/DOCUMENT_TABLE_MAPPING.md` (`revision_recorded_at/by`) |

### Disconnected

- No server action or UI creates revisions
- Not referenced from `src/app` or `src/lib` (except SQL migration)

### Still requires runtime

- Insert on document chain completion (Phase 4+)
- Calendar revision color UI
- Graph edges via `relationships` JSONB or relationship store

---

## `document` (`Document`)

### What exists

| Layer | Location |
|-------|----------|
| Type | `src/types/core/document/document.ts` |
| Category registry | `src/types/core/document/document-category.ts` |
| Status registry | `src/types/core/document/document-status.ts` |
| Packages / links | `document-package.ts`, `document-link.ts` |
| Postgres | `documents` table |

### Disconnected

- Mock logistics `AttachedDocument` in `shipment-data.ts` is **operational UI**, not `Document` authority
- Brokerage/email attachments are static strings

### Still requires runtime

- Create `documents` row when upload pipeline completes chain
- Maintain `document_revision_ids` array consistency
- Category/status pickers in review UI
- Links to sets, scenes, generated outputs

---

## Cross-references in `src/types/core` (not yet runtime)

Grep targets: `source-document`, `document-revision`, `document` (kind strings).

| Area | Files (sample) | Runtime |
|------|----------------|---------|
| Relationship paths | `relationship-path.ts`, `document-relationship-contracts.ts` | Graph store not implemented |
| Kinds registry | `kinds.ts`, `registry.ts` | Types only |
| Generated outputs | `generated-output.ts` | Types only; links `document` IDs |
| Callsheet / shooting schedule | `callsheet-revision.ts`, `shooting-schedule-revision.ts` | Distinct from ingestion kinds; no DB |
| Script revision | `script-revision.ts` | `sourceDocumentId` field; no writer |
| Services (deprecated) | `src/types/core/services/*` | Superseded by authority folders |

---

## `src/app` imports of `@/types/core` (Phase 3)

| File | Imports |
|------|---------|
| `ingestion/_components/ingestion-queue-table.tsx` | `SOURCE_INGESTION_REGISTRY` |
| `ingestion/_components/upload-form.tsx` | `SOURCE_INGESTION_REGISTRY`, `SourceDocumentKind` |
| `server/ingestion-actions.ts` | `isSourceDocumentKind`, `SourceDocumentKind` |
| `lib/ingestion/*` | `source-document-kind`, `immutable-source-document`, `provenance`, `version-chain`, `source-file` |

Logistics and dashboard modules remain on mock operational types — **not** constitutional `Document`.

---

## Phase 4 gaps (agentic extraction — out of Phase 3 scope)

1. Worker to transition `ingestion_status`: uploaded → processing → review  
2. Insert `documents` + `document_revisions` after validation  
3. LLM/OCR services (not in repo)  
4. Human approval actions on review queue  
5. `SOURCE_INGESTION_REGISTRY.extractionTargets` materialization  
