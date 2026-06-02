# SyncOffset Schema Recovery Plan

**Source of truth:** [SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md](./SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md)  
**Target project:** `yddwznlclkcfqqgmorye`  
**Scope:** Recover intended schema for visible production workflows only. No new migration files. No application code changes.

---

## Target tables (recovery outcome)

| Table | Workflow | Repo authority |
|-------|----------|----------------|
| `production_sets` | Web Sets | `syncoffset-web` |
| `assets` | Web Sets | `syncoffset-web` |
| `scenes` | Web Sets **or** Expo Set Files | **CONFLICT** — two incompatible definitions |
| `set_files` | Expo Set Files | `syncoffset-mobile` |
| `production_schedule_revisions` | Expo schedule + Web calendar | `syncoffset-mobile` / `syncoffset-web` (duplicate) |
| `production_schedule_days` | Expo schedule + Web calendar | same |
| `source_documents` | Web Ingestion | `syncoffset-web` |
| `document_revisions` | Web Ingestion | `syncoffset-web` |
| `documents` | Web Ingestion (constitutional) | `syncoffset-web` — **CONFLICT** with legacy mobile `documents` |

---

## Critical schema conflicts (read before apply)

### 1. `public.scenes` — mutually exclusive shapes

| Migration | `scenes` shape |
|-----------|----------------|
| `syncoffset-mobile/.../20260425180000_set_files.sql` | `set_file_id` → `set_files` (Expo `setFilesService`) |
| `syncoffset-web/.../20260531000300_set_workspace_tables.sql` | `set_id` → `production_sets` (Web set workspace) |

Both use `CREATE TABLE scenes` (workspace) or `create table if not exists scenes` (set_files). **You cannot fully apply both migrations as written on one database.**

**Recovery choice (pick one for Phase 3):**

| Option | Apply order | Web Sets `scenes` | Expo Set Files `scenes` |
|--------|-------------|-------------------|-------------------------|
| **A — Web primary** (matches production nav Sets) | `20260531000300` then `set_files` **without** scenes block | **YES** | **NO** — `set_files` OK, scene CRUD fails until bridge |
| **B — Expo primary** | `20260425180000` full then `20260531000300` | **NO** — migration fails at `CREATE TABLE scenes` | **YES** |

**Recommendation for TestFlight + current nav:** **Option A** (Phase 3a → 3b below).

### 2. `public.documents` — legacy vs constitutional

| Migration | `documents` shape |
|-----------|-------------------|
| `syncoffset-mobile/.../20260428000000_shipments_documents.sql` | Logistics: `show_id`, `document_type`, `storage_path`, … (already on live project — 42501 anon, not missing) |
| `syncoffset-web/.../20260531000100_constitutional_documents.sql` | Ingestion: `production_id`, `document_number`, `title`, `category_id`, … |

`CREATE TABLE documents` in constitutional migration **will fail** if legacy table exists.

**Manual prerequisite (operator SQL, not a repo migration):** rename or archive legacy table before Phase 4, e.g. `ALTER TABLE public.documents RENAME TO logistics_documents;` and update any mobile paths still using old table (out of scope here — ingestion recovery only).

`document_versions` (legacy) vs `document_revisions` (constitutional) — **different names, no collision.**

---

## Prerequisites (already on `yddwznlclkcfqqgmorye` per audit)

Verify before Phase 1:

| Prerequisite | Evidence |
|--------------|----------|
| `public.shows` | Live probe 200 |
| `public.show_members` | Required by `is_member_of` |
| `public.trips`, `runsheets`, `vendors`, `drivers` | Live probe 200 |
| `public.is_member_of(uuid)` | `20260518120000_restore_is_member_of.sql` (or earlier invite flow) |
| `public.is_dispatch(uuid)` | `20260502000000_roles_expand.sql` or `20260430000000_user_created_shows.sql` |
| `public.is_dev_show(uuid)` | `20260518120000_restore_is_member_of.sql` |
| `public.current_sub()` | Auth / JWT helpers from init migrations |
| `public.production_documents` | Schedule FK (nullable); from `20260519000000_production_documents_layer.sql` |

If `production_documents` is missing, apply `syncoffset-mobile/supabase/migrations/20260519000000_production_documents_layer.sql` **before** schedule shadow (or accept nullable FK only if table created empty).

---

## Per-migration registry

Paths are repo-relative. **SAFE TO APPLY** assumes target is `yddwznlclkcfqqgmorye` with audit baseline (operational tables present, target tables absent). **Duplicate files:** mobile vs web schedule migrations are the same intent — apply **one** copy only.

| ORDER | FILE | CREATES / ALTERS | DEPENDS ON | SAFE TO APPLY |
|-------|------|------------------|------------|---------------|
| — | *(prerequisite check)* | — | `shows`, `show_members`, RLS helpers | **YES** (verify only) |
| 1 | `syncoffset-mobile/supabase/migrations/20260520100000_production_schedule_shadow.sql` | Tables: `production_schedule_revisions`, `production_schedule_days`, `production_schedule_lineage`; indexes; RLS policies; grants | `shows`, `production_documents` (FK nullable), `is_member_of`, `is_dev_show` | **YES** |
| 2 | `syncoffset-mobile/supabase/migrations/20260521100000_schedule_revision_publish_phase2.sql` | Alters `production_schedule_revisions` (columns, constraints, `revision_scope` check); function `production_schedule_revisions_assign_number`; trigger; function `publish_production_schedule_revision`; unique published index | Order 1 tables | **YES** |
| — | `syncoffset-web/supabase/migrations/20260520100000_production_schedule_shadow.sql` | *(duplicate of order 1)* | — | **NO** if order 1 applied |
| — | `syncoffset-web/supabase/migrations/20260521100000_schedule_revision_publish_phase2.sql` | *(duplicate of order 2)* | — | **NO** if order 2 applied |
| 3 | `syncoffset-web/supabase/migrations/20260531000300_set_workspace_tables.sql` | Tables: `production_sets`, `assets`, `scenes`; indexes; RLS enable + permissive `authenticated` select policies | None (no FK to `shows` in DDL) | **YES** if `scenes` does not exist |
| 4 | `syncoffset-web/supabase/migrations/20260531000500_set_hero_photo.sql` | Column `production_sets.hero_image_url`; storage bucket `set-photos`; storage RLS policies | `production_sets` (order 3) | **YES** |
| 5 | `syncoffset-mobile/supabase/migrations/20260425180000_set_files.sql` | Tables: `set_files`, `scenes`; function `set_files_touch_updated`; trigger; indexes; RLS policies | `shows`, `is_member_of`, `is_dispatch` | **NO** if order 3 created `scenes` — use **partial apply** (set_files only; see Phase 3b) |
| 5b | `20260425180000_set_files.sql` *(lines 16–72 only)* | `set_files` + RLS + trigger (excludes `scenes`) | Same as order 5 | **YES** after order 3 (Option A) |
| 6 | `syncoffset-web/supabase/migrations/20260531000000_storage_buckets.sql` | Storage buckets + `storage.objects` policies | `storage.buckets` table (Supabase built-in) | **YES** (`ON CONFLICT DO NOTHING`) |
| 7 | `syncoffset-web/supabase/migrations/20260531000100_constitutional_documents.sql` | Extension `pgcrypto`; type `ingestion_status`; tables `source_documents`, `documents`, `document_revisions`; indexes; RLS policies | Legacy `documents` **must not** occupy name | **NO** until legacy `documents` renamed (see conflict §2) |
| 8 | `syncoffset-web/supabase/migrations/20260531000200_document_chain_indexes.sql` | Indexes on `document_revisions` | Order 7 | **YES** after order 7 |
| 9 | `syncoffset-web/supabase/migrations/20260531000400_documents_set_index.sql` | Index `idx_documents_set` on `documents(set_id)` | Constitutional `documents` (order 7) | **YES** after order 7 |

### Out of scope for this recovery (do not apply for target table list)

| FILE | Reason |
|------|--------|
| `20260531000700_production_calendar.sql` | `calendar_days` / `production_calendars` — web loader uses schedule tables, not this |
| `20260531000600_work_transport_orders.sql` | Optional calendar overlays only |
| Mobile migrations `20260428000000` onward except those listed | Already applied or unrelated |

---

## Exact migration order (operator runbook)

### Phase 1 — Schedule (Expo publish → Web calendar)

**Goal tables:** `production_schedule_revisions`, `production_schedule_days`, `production_schedule_lineage`

| Step | File | ORDER |
|------|------|-------|
| 1.1 | `syncoffset-mobile/supabase/migrations/20260520100000_production_schedule_shadow.sql` | 1 |
| 1.2 | `syncoffset-mobile/supabase/migrations/20260521100000_schedule_revision_publish_phase2.sql` | 2 |

**Post-check:**

```sql
SELECT count(*) FROM public.production_schedule_revisions;
SELECT count(*) FROM public.production_schedule_days;
```

**Expected:** Tables exist; counts may be `0`. Publish RPC `publish_production_schedule_revision` exists.

---

### Phase 2 — Web Sets workspace

**Goal tables:** `production_sets`, `assets`, `scenes` (workspace shape)

| Step | File | ORDER |
|------|------|-------|
| 2.1 | `syncoffset-web/supabase/migrations/20260531000300_set_workspace_tables.sql` | 3 |
| 2.2 | `syncoffset-web/supabase/migrations/20260531000500_set_hero_photo.sql` | 4 |

**Post-check:**

```sql
SELECT count(*) FROM public.production_sets;
SELECT count(*) FROM public.assets;
SELECT count(*) FROM public.scenes;
```

**Expected:** All three tables exist. Web `/dashboard/sets` loader stops returning missing-relation error.

---

### Phase 3 — Expo Set Files (partial under Option A)

**Goal table:** `set_files` (Expo list/detail metadata). **Not** Expo `scenes` rows until `scenes` authority is unified.

| Step | Action | ORDER |
|------|--------|-------|
| 3.1 | Run **only** `set_files` section of `syncoffset-mobile/supabase/migrations/20260425180000_set_files.sql`: from `create table if not exists public.set_files` through `set_files_write` policy (stop before `-- SCENES` block) | 5b |

**Do not run** the `scenes` block from `20260425180000` if Phase 2 completed.

**Post-check:**

```sql
SELECT count(*) FROM public.set_files;
```

**Expected:** `set_files` exists. Expo `/set-files` CRUD on set file rows works; scene CRUD remains blocked until bridge (known limitation).

**Option B (Expo scenes primary):** Skip Phase 2; apply full order 5 (`20260425180000` entire file) before order 3 — Web Sets scene features blocked. Not recommended for current nav.

---

### Phase 4 — Ingestion (constitutional documents)

**Goal tables:** `source_documents`, `document_revisions`, constitutional `documents`

| Step | Prerequisite / file | ORDER |
|------|---------------------|-------|
| 4.0 | Rename legacy `public.documents` → `public.logistics_documents` (or equivalent) if table exists with logistics columns | manual |
| 4.1 | `syncoffset-web/supabase/migrations/20260531000000_storage_buckets.sql` | 6 |
| 4.2 | `syncoffset-web/supabase/migrations/20260531000100_constitutional_documents.sql` | 7 |
| 4.3 | `syncoffset-web/supabase/migrations/20260531000200_document_chain_indexes.sql` | 8 |
| 4.4 | `syncoffset-web/supabase/migrations/20260531000400_documents_set_index.sql` | 9 |

**Post-check:**

```sql
SELECT count(*) FROM public.source_documents;
SELECT count(*) FROM public.document_revisions;
SELECT count(*) FROM public.documents;
```

**Expected:** Ingestion queue can query `source_documents`; chain writes use constitutional `documents` + `document_revisions`.

---

## Phase summary

| Phase | Purpose | Migrations (ORDER) | Resulting tables |
|-------|---------|-------------------|------------------|
| **Phase 1** | Shared published schedule | 1–2 | `production_schedule_revisions`, `production_schedule_days`, `production_schedule_lineage` + publish RPC |
| **Phase 2** | Web Sets | 3–4 | `production_sets`, `assets`, `scenes` (workspace), `hero_image_url`, `set-photos` bucket |
| **Phase 3** | Expo Set Files (metadata) | 5b (partial) | `set_files` only under Option A |
| **Phase 4** | Web Ingestion | 6–9 (+ manual 4.0) | `source_documents`, `documents`, `document_revisions` + storage buckets |

---

## Expected resulting tables (after full plan, Option A)

| TABLE | EXISTS (target) | Consumer |
|-------|-----------------|----------|
| `production_schedule_revisions` | YES | Expo `scheduleCanonicalPersistence`, Web `load-production-calendar-month` |
| `production_schedule_days` | YES | same |
| `production_schedule_lineage` | YES | Expo publish lineage |
| `production_sets` | YES | Web `list-production-sets` |
| `assets` | YES | Web set workspace |
| `scenes` | YES (workspace columns) | Web set workspace |
| `set_files` | YES | Expo `setFilesService` |
| `scenes` (Expo `set_file_id`) | **NO** under Option A | Expo scene CRUD **blocked** |
| `source_documents` | YES | Web `lib/ingestion/queries` |
| `document_revisions` | YES | Web ingestion chain |
| `documents` | YES (constitutional) | Web `document-chain.ts` |

---

## Dependency graph (functions · policies · FKs)

```
shows ──┬──► set_files.production_id (ON DELETE CASCADE)
        ├──► production_schedule_revisions.show_id
        ├──► production_schedule_days.show_id
        └──► production_documents.show_id (schedule source FK, nullable)

production_schedule_revisions ──► production_schedule_days.revision_id
                               └──► production_schedule_lineage (parent/child)

production_sets ──► assets.set_id
                 └──► scenes.set_id (workspace)

set_files ──► scenes.set_file_id (Expo only; conflicts with workspace scenes)

source_documents ──► documents.source_document_id
documents ──► document_revisions.document_id

RLS helpers (must exist):
  is_member_of(show|production_id)
  is_dispatch(show|production_id)   ← set_files write
  is_dev_show(show_id)              ← schedule policies
```

---

## Verification matrix (post-recovery)

Re-run PostgREST or SQL after all phases:

| TABLE | Method |
|-------|--------|
| All target tables | `SELECT count(*) FROM public.<table>;` |
| Schedule publish | `SELECT proname FROM pg_proc WHERE proname = 'publish_production_schedule_revision';` |
| Set Files probe | `GET /rest/v1/set_files?select=id&limit=1` → 200 |
| Production sets probe | `GET /rest/v1/production_sets?select=id&limit=1` → 200 |
| Source documents probe | `GET /rest/v1/source_documents?select=id&limit=1` → 200 (authenticated) |

---

## Alignment with production recovery audit

| Audit blocker | Addressed by |
|---------------|--------------|
| Schedule tables missing | Phase 1 |
| `production_sets` / `assets` / `scenes` missing | Phase 2 |
| `set_files` missing | Phase 3b |
| `source_documents` / `document_revisions` missing | Phase 4 |
| `scenes` name collision | Documented; Option A / B |
| Legacy `documents` blocks constitutional | Phase 4.0 manual rename |
| Cross-client schedule E2E | Phase 1 + published revision data (runtime, not schema) |
| Expo Set Files scene E2E | **Partial** under Option A until unified `scenes` |

---

## Operator checklist (single session)

1. Confirm prerequisites table (§ Prerequisites).  
2. Execute **Phase 1** → verify schedule tables.  
3. Execute **Phase 2** → verify sets workspace tables.  
4. Execute **Phase 3b** (set_files only) → verify `set_files`.  
5. Resolve legacy `documents` rename → **Phase 4** → verify ingestion tables.  
6. `NOTIFY pgrst, 'reload schema';` or wait for PostgREST cache refresh.  
7. Re-run [SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md](./SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md) table probes.  
8. Field-test Expo Set Files (files only) and Web Sets + Calendar + Ingestion.

**Do not** apply duplicate web schedule files after mobile copies.  
**Do not** create new migrations in this recovery — use partial SQL only where conflicts are documented (Phase 3b, Phase 4.0).
