# Document Chain Audit — Pre–Phase 3B

**Audited:** `uploadSourceDocument()` in `src/server/ingestion-actions.ts`  
**Date:** 2026-05-31

---

## What is created today (Phase 3)

| Artifact | Created | Storage |
|----------|---------|---------|
| Storage object | Yes | `{bucket}/{productionId}/{sourceDocumentId}/{file}` |
| `source_documents` row | Yes | Full constitutional JSON for `immutable`, `source_file`, `ingestion` |
| `documents` row | **No** | Table exists; no insert |
| `document_revisions` row | **No** | Table exists; no insert |

---

## `uploadSourceDocument()` behavior

1. Validates file + `sourceDocumentKind`.
2. Uploads bytes to Supabase Storage.
3. Inserts one `source_documents` row with:
   - `ingestion_status`: `uploaded`
   - `status` (constitutional): `draft`
   - `immutable`, `source_file`, `ingestion` populated
   - `version_chain`: `[]`
   - `supersession`: `{}`
   - `relationships`: `[]`
4. On DB failure: removes storage object.
5. Revalidates `/ingestion`, `/ingestion/upload`.

**Return value:** `{ sourceDocumentId, storageRef }` only — no `documentId` or `revisionId`.

---

## Constitutional fields ignored (pre–3B)

### `ImmutableSourceDocument`

| Field | Ignored? | Notes |
|-------|----------|-------|
| `immutable.author` | Yes | Not set on upload |
| `immutable.title` | Yes | Not set |
| `immutable.ref` | Yes | Not set |
| `versionChain` | Yes | Always empty |
| `supersession` | Yes | Always empty |
| `status` | Partial | Always `draft`; never `issued`/`superseded` |
| `relationships` | Yes | Empty array |

### `Document` — entire type

| Field | Status |
|-------|--------|
| `documentNumber`, `title`, `categoryId`, `statusId`, `notes` | Not created |
| `documentRevisionIds` | Not maintained |
| `setId`, `setNumber`, `sceneId` | Not set |
| `documentPackageIds`, `documentLinkIds`, `generatedOutputIds` | Empty (N/A) |

### `DocumentRevision` — entire type

| Field | Status |
|-------|--------|
| `documentId`, `revisionNumber` | Not created |
| `revisionColor` | Not parsed/set |
| `sourceDocumentId` | Not linked |
| `revision_recorded_at/by` (DB) | Not created |

### Pipeline

| Concern | Status |
|---------|--------|
| Revision detection (same logical document) | Not implemented |
| `ingestion_status` transitions | Only `uploaded`; no approve/reject |
| Review queue actions | Display only |
| Download original file | Not implemented |

---

## Phase 3B remediation (this sprint)

See `src/lib/ingestion/document-chain.ts` and updated `uploadSourceDocument()`.
