# SyncOffset Schema Decision Record (SDR)

**Status:** Approved architecture decisions — binding for schema recovery, migrations, and new implementation.  
**Date:** 2026-06-02  
**Scope:** `public.scenes`, `public.documents`, and related ingestion / set-file persistence.  
**Out of scope:** Application code changes in this document (record only).

**Related audits (historical context, superseded for ownership questions):**

- [SYNCOFFSET_SCHEMA_COLLISION_RESOLUTION.md](./SYNCOFFSET_SCHEMA_COLLISION_RESOLUTION.md)
- [SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md](./SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md)
- [SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md](./SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md)

**Constitutional references:**

- `src/types/core/scene/scene.ts` — Scene authority
- `src/types/core/document/document.ts` — Document authority
- `docs/SYNCOFFSET_SCENE_AUTHORITY.md`
- `docs/SYNCOFFSET_DOCUMENT_AUTHORITY.md`

---

## How to use this record

Future audits, sprints, and agents **must not reopen** whether:

- `public.scenes` belongs to Set Files or Production Sets, or
- `public.documents` belongs to logistics attachments or the ingestion chain.

If a proposal conflicts with this SDR, it requires an **explicit new decision** (amendment section below), not a repeat collision analysis.

---

## DECISION 1 — Canonical Scene Authority

| Field | Value |
|-------|-------|
| **Decision** | `public.scenes` is the constitutional **production breakdown Scene** table. Parent authority is **`production_sets`**, not `set_files`. |
| **Owner** | Web set workspace + constitutional `Scene` (`kind: "scene"`). |
| **Reason** | Scene is the central production unit in the constitutional model (script → scene → breakdown → budget → set). Expo set-file “scene” rows are **operational index lines** inside a Set File, not constitutional Scenes. |
| **Status** | **APPROVED** |

### Ownership

| Object | Role |
|--------|------|
| **`public.scenes`** | Canonical Scene rows (`set_id` → `production_sets`) |
| **`public.production_sets`** | Parent set authority for scenes |
| **`public.set_files`** | Separate Expo set-file index (not parent of `public.scenes`) |
| **`public.set_file_scenes`** (future) | Canonical store for Expo set-file scene lines (`set_file_id` → `set_files`) |

### Reason (detail)

1. Constitutional type `Scene` requires `setId`, `locationId`, `scriptRevisionId`, breakdown graph fields — mapped by `20260531000300_set_workspace_tables.sql`.
2. Expo `SetFile.scenes` UI type (`expo/types`) is a minimal list (number, scriptLocation, dayNight) scoped to coordinator set files — different bounded context.
3. Applying both `20260425180000_set_files.sql` and `20260531000300_set_workspace_tables.sql` as written both claim `public.scenes` — **invalid** under this decision.

### Consequences

| Area | Consequence |
|------|-------------|
| **Web `/dashboard/sets`** | Reads/writes `scenes` with `set_id` = `production_sets.id`. |
| **Expo `/set-files`, `/set-file/[id]`** | Must **not** insert into `public.scenes` with `set_file_id` after canonical schema is applied. |
| **Expo `setFilesService.ts`** | Today targets `scenes.set_file_id` — **non-compliant** with this SDR until pointed at `set_file_scenes`. |
| **Stripboard / ShootDay** | String scene labels on schedule days remain **not** `public.scenes` (unchanged). |
| **Audits** | Any report listing `scenes` under Set Files as SOR is **wrong**; cite this SDR. |

### Migration impact

| Action | Allowed / required |
|--------|------------------|
| Apply `20260531000300_set_workspace_tables.sql` | **YES** — creates canonical `scenes`. |
| Apply full `20260425180000_set_files.sql` including `scenes` block | **NO** after canonical `scenes` exists. |
| Apply `20260425180000` **set_files portion only** (exclude `scenes` CREATE) | **YES** for interim recovery. |
| New migration `set_file_scenes` | **Required** before Expo scene CRUD is production-ready on shared DB. |
| Reuse `public.scenes` for `set_file_id` | **Forbidden** |

### Future implementation constraints

1. **New Expo persistence** for set-file scene lines uses table name **`set_file_scenes`** (or name registered in an amendment — not `scenes`).
2. **No** constitutional `Scene` type mapping to `set_file_id` without an approved bridge model and ADR amendment.
3. **No** new migration may `CREATE TABLE public.scenes` with a non–`production_sets` FK.
4. Cross-client “one scenes table” assumptions are **rejected** until an explicit unification ADR exists.
5. Product copy may still say “scenes on this set file” in UI — storage must use `set_file_scenes`.

---

## DECISION 2 — Canonical Document Authority

| Field | Value |
|-------|-------|
| **Decision** | Constitutional ingestion owns **`source_documents`**, **`documents`**, and **`document_revisions`**. Legacy mobile shipment/runsheet attachment tables are **not** constitutional Documents. |
| **Owner** | Web ingestion (`/ingestion`) + document chain + set workspace document panels using constitutional shape. |
| **Reason** | Article I ingestion (`ImmutableSourceDocument` / `source-document`) and Article II logical `Document` + `DocumentRevision` require the web migration schema — not logistics `show_id` + `document_type` rows. |
| **Status** | **APPROVED** |

### Ownership

| Object | Role |
|--------|------|
| **`public.source_documents`** | Immutable ingestion source (constitutional `source-document`) |
| **`public.documents`** | Logical production Document (constitutional `document`) |
| **`public.document_revisions`** | Revision history (constitutional `document-revision`) |
| **`public.logistics_documents`** (renamed legacy) | Operational attachments (CI, POD, photos, shipment links) |
| **`public.logistics_document_versions`** (renamed legacy) | Append-only versions for logistics documents |
| **`public.production_documents`** | Separate PDF hub / smart-import archive — **not** this decision |

### Reason (detail)

1. Live project already holds legacy `public.documents` (logistics columns; anon 42501) from `20260428000000_shipments_documents.sql`.
2. `20260531000100_constitutional_documents.sql` defines a different `documents` shape — `CREATE TABLE` conflicts if legacy name is retained.
3. `document_versions` (legacy) and `document_revisions` (constitutional) are **different names** — only `documents` collides.

### Consequences

| Area | Consequence |
|------|-------------|
| **Web ingestion** | SOR = `source_documents` → `documents` → `document_revisions`. |
| **Expo shipments / `documents.ts`** | Continues legacy shape on **`logistics_documents`** after rename until code is updated. |
| **PAI CI (`ciDocument.ts`, metadata migration)** | Targets **logistics** table, not constitutional `documents`. |
| **Audits** | “documents table” without qualifier is ambiguous — must specify constitutional vs logistics. |

### Migration impact

| Action | Allowed / required |
|--------|------------------|
| `ALTER TABLE public.documents RENAME TO logistics_documents` | **Required** before constitutional `CREATE TABLE documents` |
| Rename `document_versions` → `logistics_document_versions` | **Recommended** (clarity; avoid name drift) |
| Apply `20260531000100_constitutional_documents.sql` | **YES** after rename |
| Apply `20260545000000_documents_ci_metadata.sql` to constitutional `documents` | **NO** — apply to **`logistics_documents`** |
| New code writing logistics fields to `public.documents` | **Forbidden** after constitutional table exists |

### Future implementation constraints

1. **Constitutional** features use `source_documents`, `documents`, `document_revisions` only.
2. **Logistics** uploads (shipments, runsheets, Expo `uploadDocument`) use **`logistics_documents`** (or views explicitly documented as legacy).
3. **No** merge of logistics rows into ingestion review queue without an ingestion transform and provenance record.
4. **No** reuse of `document_type` / `storage_path` columns for constitutional `document_number` / `category_id` without migration mapping ADR.
5. `production_documents` remains a **third** document family — do not conflate with Decision 2.

---

## Summary table

| Decision | Owner (tables) | Parent / chain | Legacy / parallel |
|----------|----------------|----------------|-------------------|
| **1 — Scene** | `scenes` → `production_sets` | `set_id` FK | `set_file_scenes` → `set_files` (future); `set_files` metadata only until then |
| **2 — Document** | `source_documents` → `documents` → `document_revisions` | Ingestion chain | `logistics_documents` + `logistics_document_versions`; `production_documents` separate |

---

## Safe schema recovery (post-decision)

Schema recovery from [SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md](./SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md) may proceed when:

| Gate | Decision |
|------|----------|
| G1 | Legacy `documents` renamed per Decision 2 |
| G2 | `20260531000300` applied before any Expo `scenes` block on `public.scenes` per Decision 1 |
| G3 | `set_file_scenes` migration exists **or** interim recovery accepts Expo scenes deferred |

**SAFE TO EXECUTE** remains **NO** until G1–G2 are satisfied on the target Supabase project (G3 per product choice).

---

## Amendment process

To change an **APPROVED** decision:

1. Add a dated **Amendment** subsection below with superseded text.
2. Link sprint / PR that implements the change.
3. Update [SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md](./SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md) if migration order changes.

Do not mark decisions “pending re-audit” in downstream docs — cite this SDR as final unless amended.

---

## Amendments

| Date | Decision | Change |
|------|----------|--------|
| — | — | None |
