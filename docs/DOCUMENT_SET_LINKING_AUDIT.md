# Document → Set Linking Audit

**Phase:** 3D.1 — Blocker 4 (audit only)  
**Audit date:** 2026-05-31  
**Scope:** Upload → SourceDocument → DocumentRevision → Document → Set  
**Constraint:** No code changes to document chain in this sprint.

---

## OBJECTIVE

Determine whether `documents.set_id` is populated today and what breaks the Set Workspace documents panel.

---

## Constitutional chain (intended)

```
Upload (file)
    ↓
Supabase Storage (source_file.storageRef)
    ↓
source_documents (ImmutableSourceDocument)
    ↓
completeDocumentChain()
    ↓
documents (Document) + document_revisions (DocumentRevision)
    ↓
Set Workspace query: documents WHERE set_id = :setId
```

**Set linkage field:** `Document` type includes optional `setId`, `setNumber` (`src/types/core/document/document.ts`).  
**Database:** `documents.set_id`, `documents.set_number` (`20260531000100_constitutional_documents.sql`).

---

## Current behavior (evidence)

### Step 1 — Upload

**File:** `src/server/ingestion-actions.ts` → `uploadSourceDocument()`

- Inserts `source_documents` row.
- Calls `completeDocumentChain()` on success.
- Form fields: `file`, `sourceDocumentKind`, `uploadedBy` only.
- **No `setId` or `set_id` in FormData.**

### Step 2 — Document chain

**File:** `src/lib/ingestion/document-chain.ts` → `completeDocumentChain()`

**New document insert** (`docRow`):

```typescript
set_id: null,
set_number: null,
scene_id: null,
```

**Evidence:** lines 70–72 in `document-chain.ts`.

**Existing document reuse:** Updates `document_revision_ids`, `source_document_id`, `status_id` — **does not set `set_id`.**

### Step 3 — Set workspace read

**File:** `src/lib/sets/load-set-workspace.ts`

```typescript
supabase.from("documents").select("*").eq("set_id", setId)
```

Only rows with non-null `set_id` matching the set UUID appear in:

- `SetDocumentsPanel`
- `SetDrawingsPanel` (filtered drawings)
- `SetOpenWorkPanel` (draft/review docs on set)

### Step 4 — SourceDocument → Set

**No direct link.** `source_documents` table has no `set_id` column. Set association is **only** via `documents.set_id`.

---

## Is `documents.set_id` populated?

| Path | Populated? |
|------|------------|
| Ingestion upload (default) | **No** — always `null` on insert |
| Document chain update | **No** — updates omit `set_id` |
| Manual SQL seed | **Yes** — operator can set `set_id` |
| Future “Link Document” action | **Not implemented** (3D.1 placeholder button only) |

**Conclusion:** Normal ingestion flow **does not** connect documents to sets. Set Workspace documents sections remain empty after upload unless rows are seeded or updated manually.

---

## Missing links

| Link | Status |
|------|--------|
| Upload form → `set_id` | Missing |
| `completeDocumentChain` → `set_id` / `set_number` | Missing |
| `source_documents` → set | No column; not required if document carries set |
| `ProductionSet.asset_ids` ↔ assets table | Denormalized; separate issue |
| Ingestion review UI → pick set | Missing |
| Set detail “Link Document” → existing document | Missing (placeholder in 3D.1) |

---

## Recommended implementation (future sprint — not 3D.1)

**Do not modify chain in this sprint.** When approved:

1. **Upload context (optional set picker)**  
   - On `/ingestion/upload`, optional `productionSetId` when user uploads from set context (query param `?setId=`).  
   - Pass through `uploadSourceDocument` → `completeDocumentChain`.

2. **Chain write**  
   - On document insert/update, set:
     - `set_id` = provided UUID  
     - `set_number` = from `production_sets.set_number` lookup  
   - Validate set belongs to same `production_id` as upload.

3. **Link existing document (operational action)**  
   - “Link Document” on set detail: modal listing `documents` where `set_id IS NULL` and same `production_id`; PATCH `set_id`.  
   - No extraction; mutation only.

4. **Index**  
   - `CREATE INDEX idx_documents_set ON documents (set_id);` (see `SET_WORKSPACE_RUNTIME_REQUIREMENTS.md`).

5. **Do not infer set from filename** — avoid non-constitutional guessing.

---

## Validation query (operator)

After upload without set picker:

```sql
SELECT id, title, set_id, source_document_id
FROM documents
ORDER BY created_at DESC
LIMIT 5;
```

Expect `set_id` **NULL** for ingestion-created rows.

After manual link:

```sql
UPDATE documents SET set_id = '<production_set_uuid>', set_number = '101' WHERE id = '<document_uuid>';
```

Set detail documents panel should show the row on refresh.

---

## Constitutional objects referenced

| Object | Role in chain |
|--------|----------------|
| `ImmutableSourceDocument` | `source_documents` |
| `DocumentRevision` | `document_revisions` |
| `Document` | `documents` — **`setId` never set in chain today** |
| `ProductionSet` | Set workspace filter target |

---

## OUT OF SCOPE (this audit)

- Implementing set picker or chain changes  
- Extraction / AI  
- New authorities  

---

*End of audit.*
