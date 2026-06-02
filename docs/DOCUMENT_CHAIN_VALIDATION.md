# Document Chain Validation — Phase 3B

**Date:** 2026-05-31

---

## Type mappings

| Constitutional type | Runtime module | DB table |
|---------------------|----------------|----------|
| `ImmutableSourceDocument` | `source-document-row.ts` | `source_documents` |
| `DocumentRevision` | `document-rows.ts` | `document_revisions` |
| `Document` | `document-rows.ts` | `documents` |
| `IngestionStatus` (pipeline column) | `ingestion-status.ts` | `source_documents.ingestion_status` |

---

## Database mappings

See `docs/DOCUMENT_TABLE_MAPPING.md`. Phase 3B adds:

| Runtime writer | Tables touched |
|----------------|----------------|
| `uploadSourceDocument()` | `source_documents` insert |
| `completeDocumentChain()` | `documents` insert/update, `document_revisions` insert, `source_documents` update (`version_chain`, `ingestion_status`) |
| `approveSourceDocument()` | `source_documents.ingestion_status`, `documents.status_id` |
| `rejectSourceDocument()` | `source_documents.ingestion_status`, `documents.status_id` |

---

## Runtime mappings

| Flow | Entry | Output |
|------|-------|--------|
| Upload | `/ingestion/upload` → `uploadSourceDocument()` | 1× SourceDocument + 1× DocumentRevision + 1× Document (new or reused) |
| Queue | `/ingestion` → `listSourceDocumentsForQueue()` | Rows + chain IDs |
| Detail | `/ingestion/[id]` → `getSourceDocumentDetail()` | Metadata + timeline |
| Download | `getSourceDocumentDownloadUrl()` | Signed storage URL |
| Approve | `approveSourceDocument()` | `review` → `approved` |
| Reject | `rejectSourceDocument()` | `review` → `rejected` |

---

## Ingestion status lifecycle

| From | Allowed to | Trigger |
|------|------------|---------|
| `uploaded` | `processing`, `review`, `failed` | Manual `transitionIngestionStatus()` |
| `processing` | `review`, `failed` | Manual |
| `review` | `approved`, `rejected`, `failed` | **Approve** / **Reject** buttons |
| `approved` | — | Terminal |
| `rejected` | — | Terminal |
| `failed` | `uploaded` | Manual retry |

**Automatic (Phase 3B):** After successful document chain, `uploaded` → `review` via `completeDocumentChain()` so the queue can approve without a separate “submit” action.

**No AI, OCR, extraction, or background workers.**

---

## Operator tests

### Test A — First script revision upload

1. `/ingestion/upload` → Source kind **Script Revision** → PDF.
2. **Expected:**
   - 1 row in `source_documents`
   - 1 row in `document_revisions` (`revision_number = 1`)
   - 1 row in `documents` (new)
   - `ingestion_status = review`

### Test B — Second script revision (same kind)

1. Upload another Script Revision PDF (e.g. filename containing `Pink` or `Blue`).
2. **Expected:**
   - 1 new `source_documents` row
   - 1 new `document_revisions` row (`revision_number = 2`)
   - **Same** `documents.id` as Test A
   - Timeline on `/ingestion/[id]` shows multiple entries

### Test C — Approve

1. Queue or detail → **Approve** (status must be `review`).
2. **Expected:** `ingestion_status = approved`, `documents.status_id = approved`

### Test D — Reject

1. Upload another file (or use a `review` item) → **Reject**.
2. **Expected:** `ingestion_status = rejected`

---

## Validation results (static)

| Check | Result |
|-------|--------|
| `npm run lint` (Phase 3B paths) | Run locally |
| `npm run typecheck` | Run locally — project may report existing `.next/types` noise |
| Constitutional fields on upload | `immutable`, `source_file`, `ingestion` populated |
| `Document` + `DocumentRevision` created | Yes via `completeDocumentChain()` |
| Revision reuse | By `production_id` + `source_document_kind` family |
| Extraction side effects | None |

---

## Constitutional conflicts discovered

1. **Dual status models** — `ImmutableSourceDocument.status` (`CoreObjectStatus`) vs `ingestion_status` (pipeline enum on same table). Pipeline uses `ingestion_status`; constitutional `status` remains `draft` until a future “issued” workflow.

2. **`Document.status` vs `Document.statusId`** — Row uses both: `status` (auditable) stays `draft`; `status_id` (Document Authority) moves `draft` → `review` → `approved`/`draft` on reject.

3. **`DocumentRevision.createdAt` vs auditable `created_at`** — DB stores both as `created_at` and `revision_recorded_at` (same timestamp at insert).

4. **Category mapping** — `SourceDocumentKind` → `DocumentCategory` uses a fixed map in `category-map.ts` (not in constitution file); `shoot-schedule` → `calendar`, `vendor-document` → `other`.

5. **Auto `review` after upload** — Not in constitutional types; required for Approve button (`review` → `approved`) without extra UI.

6. **`supersession` / `immutable.author`** — Still unused at runtime; revision stacking uses `document_revisions` + `version_chain` JSON.

---

## Files (Phase 3B)

| File | Role |
|------|------|
| `src/lib/ingestion/document-chain.ts` | Chain creation + revision detection |
| `src/lib/ingestion/category-map.ts` | Kind → category |
| `src/lib/ingestion/ingestion-transitions.ts` | Status matrix |
| `src/lib/ingestion/revision-label.ts` | Timeline labels |
| `src/lib/ingestion/storage-download.ts` | Signed URL path parse |
| `src/server/ingestion-actions.ts` | Upload, approve, reject, download |
| `src/app/(main)/ingestion/[id]/page.tsx` | Detail route |
| `src/app/(main)/ingestion/_components/*` | Queue actions, timeline, detail |
