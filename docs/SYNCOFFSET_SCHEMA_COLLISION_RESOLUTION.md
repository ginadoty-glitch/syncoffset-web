# SyncOffset Schema Collision Resolution

**Date:** 2026-06-02  
**Method:** Migration SQL, runtime `.from()` usage, constitutional types (`src/types/core`). No migrations applied. No application code changed.

**Related:** [SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md](./SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md) · [SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md](./SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md)

---

## COLLISION 1 — `public.scenes`

### Authority A — Constitutional / Web Set Workspace

| Dimension | Value |
|-----------|-------|
| **BUSINESS CONCEPT** | Production **Scene** — central scheduling/breakdown unit; child of **ProductionSet** |
| **TABLE NAME** | `public.scenes` |
| **OWNER (intended)** | Web set workspace · constitutional `Scene` (`kind: "scene"`) |
| **MIGRATION** | `syncoffset-web/supabase/migrations/20260531000300_set_workspace_tables.sql` |
| **FIELDS (required)** | `production_id`, `kind`, `status`, audit columns, `scene_number`, `interior_exterior`, `time_of_day`, `script_pages`, **`set_id`**, `location_id`, `episode_number`, `revision_color`, `notes`, `script_revision_id`, `episode_id`, `cast_count`, `asset_count`, `description`, `relationships` JSONB |
| **FOREIGN KEYS** | `set_id` → `production_sets(id)` ON DELETE CASCADE |
| **ROUTES** | `/dashboard/sets`, `/dashboard/sets/[setId]` |
| **LOADERS** | `src/lib/sets/list-production-sets.ts`, `src/lib/sets/load-set-workspace.ts` |
| **SOURCE OF TRUTH** | Supabase `scenes` where `set_id` = production set UUID |
| **CONSTITUTIONAL TYPE** | `src/types/core/scene/scene.ts` — `setId`, `locationId`, `scriptRevisionId`, etc. |
| **COLLISION TYPE** | **Incompatible schema** + **duplicate authority** (same table name, different domain model) |

### Authority B — Expo Set File (operational set index)

| Dimension | Value |
|-----------|-------|
| **BUSINESS CONCEPT** | Lightweight **scene line items** inside a **Set File** (coordinator index: number, slug, day/night) — not full constitutional Scene |
| **TABLE NAME** | `public.scenes` (same name) |
| **OWNER (intended)** | Expo Set Files · `setFilesService.ts` |
| **MIGRATION** | `syncoffset-mobile/supabase/migrations/20260425180000_set_files.sql` (lines 79–126) |
| **FIELDS (required)** | `id`, **`set_file_id`**, `scene_number`, `description`, `script_location`, `day_night`, `notes`, `created_at` |
| **FOREIGN KEYS** | `set_file_id` → `set_files(id)` ON DELETE CASCADE |
| **ROUTES** | `/set-files`, `/set-file/[id]` |
| **LOADERS** | `expo/services/setFilesService.ts` |
| **SOURCE OF TRUTH** | Supabase `scenes` where `set_file_id` = set file UUID |
| **CONSTITUTIONAL TYPE** | **None** — Expo local `Scene` in `expo/types/index.ts` (id, number, description, scriptLocation, dayNight) — **not** constitutional `Scene` |
| **COLLISION TYPE** | **Incompatible schema** + **naming conflict** |

### Related (not a third `scenes` table)

| Dimension | Value |
|-----------|-------|
| **BUSINESS CONCEPT** | Stripboard **scene labels** on a shoot day |
| **STORAGE** | `ShootDay.scenes: string[]` · schedule import · **not** `public.scenes` |
| **COLLISION TYPE** | None — different shape, no table collision |

### Parallel authority (different table — not this collision)

| Table | Concept |
|-------|---------|
| `set_files` | Expo set file metadata |
| `production_sets` | Web production set workspace |

Product-level duplicate set models; **separate table names**. Resolve on separate bridge track.

---

### Collision 1 — Options

#### OPTION A — Canonical owner

| Item | Decision |
|------|----------|
| **Canonical table** | `public.scenes` = **constitutional / Web** (`set_id` → `production_sets`) |
| **Rationale** | Matches `SYNCOFFSET_SCENE_AUTHORITY.md`, `ProductionSet.relatedSceneIds`, production nav Sets workspace |
| **Expo Set File scenes** | Must **not** use `public.scenes` |

#### OPTION B — Migration strategy

| Step | Action |
|------|--------|
| B1 | Introduce **`public.set_file_scenes`** (or `scenes_set_file`) with Expo migration columns + FK to `set_files` — **requires one additive migration** (out of scope for “no new tables” in recovery apply sprint; **required** before dual workflow is production-ready) |
| B2 | Update `setFilesService.ts` to `.from("set_file_scenes")` — application change (out of scope here) |
| B3 | Apply `20260531000300` to create canonical `scenes` for web |
| B4 | Apply `20260425180000` **set_files block only** (no `scenes` CREATE) |

**Interim (no new migration):** Expo Set Files persist **set file rows only**; scene list stays empty in Supabase until B1–B2 ship.

#### OPTION C — Deprecation strategy

| Target | Strategy |
|--------|----------|
| Expo `public.scenes` (set_file shape) | **Deprecate** — do not create on shared DB |
| Expo embedded `SetFile.scenes` UI | Keep UI; persist scenes only after `set_file_scenes` exists |
| Constitutional `scenes` | **Primary** — sole occupant of `public.scenes` |

#### RECOMMENDED PATH (Collision 1)

1. **Declare canonical owner:** `public.scenes` → **Web / constitutional Scene** (`production_sets`).  
2. **Resolve naming:** Plan **`set_file_scenes`** table (Option B1) before claiming Expo Set Files **PRODUCTION READY** for scene CRUD.  
3. **Until B1:** Schema recovery may create `set_files` without Expo `scenes` rows (partial Set Files).

---

## COLLISION 2 — `public.documents`

### Authority A — Legacy logistics / operational documents (Mobile)

| Dimension | Value |
|-----------|-------|
| **BUSINESS CONCEPT** | Shipment/runsheet/set **file attachments** (CI, POD, photos) — storage path + show scope |
| **TABLE NAME** | `public.documents` |
| **OWNER** | Expo operational layer |
| **MIGRATION** | `syncoffset-mobile/supabase/migrations/20260428000000_shipments_documents.sql` |
| **FIELDS** | `show_id`, `title`, `document_type`, `storage_path`, `linked_runsheet_id`, `linked_shipment_id`, `linked_location_id`, `uploaded_by`, `uploaded_at`, `version`, `notes` |
| **FOREIGN KEYS** | `show_id` → `shows`; optional links to `runsheets`, `shipments`, `locations` |
| **COMPANION TABLE** | `public.document_versions` (`document_id`, `version`, `storage_path`, …) |
| **ROUTES / SERVICES** | Shipments in `AppProvider`; `expo/services/documents.ts` (`uploadDocument`); `expo/services/pai/ciDocument.ts`; PAI smoke scripts |
| **SOURCE OF TRUTH** | Legacy `documents` + `document_versions` on live project (probe: 42501 — **table exists**, anon denied) |
| **CONSTITUTIONAL TYPE** | **None** — not `Document` / `ImmutableSourceDocument` |
| **COLLISION TYPE** | **Legacy artifact** + **incompatible schema** (same table name) |
| **FOLLOW-ON** | `20260545000000_documents_ci_metadata.sql` adds `metadata jsonb` to **this** legacy table |

### Authority B — Constitutional ingestion / production documents (Web)

| Dimension | Value |
|-----------|-------|
| **BUSINESS CONCEPT** | Logical **Document** + **DocumentRevision** chain; provenance from **source-document** ingestion |
| **TABLE NAME** | `public.documents` (same name) |
| **OWNER** | Web ingestion + set workspace document panels |
| **MIGRATION** | `syncoffset-web/supabase/migrations/20260531000100_constitutional_documents.sql` |
| **FIELDS** | `production_id`, `kind`, `status`, audit fields, `document_number`, `title`, `category_id`, `status_id`, `notes`, `set_id`, `scene_id`, JSONB id arrays, `source_document_id` |
| **FOREIGN KEYS** | `source_document_id` → `source_documents`; referenced by `document_revisions.document_id` |
| **COMPANION TABLES** | `source_documents`, `document_revisions` (distinct names — no collision with `document_versions`) |
| **ROUTES / LOADERS** | `/ingestion`, `/ingestion/upload`, `/ingestion/[id]`; `lib/ingestion/queries.ts`, `document-chain.ts`; `lib/sets/load-set-workspace.ts`; `lib/documents/document-set-queries.ts` |
| **SOURCE OF TRUTH** | `source_documents` → `documents` → `document_revisions` |
| **CONSTITUTIONAL TYPES** | `Document` (`document.ts`); `DocumentRevision`; ingestion `source-document` (separate table `source_documents`) |
| **COLLISION TYPE** | **Incompatible schema** + **duplicate authority** |

### Separate (no collision with `public.documents`)

| Table | Concept |
|-------|---------|
| `production_documents` | PDF hub / smart import archive (`productionDocuments.ts`, schedule `source_document_id`) |
| `source_documents` | Constitutional ingestion only — **new name**, no legacy conflict |

---

### Collision 2 — Options

#### OPTION A — Canonical owner

| Item | Decision |
|------|----------|
| **Canonical `documents`** | **Constitutional / Web** (`production_id`, `document_number`, …) |
| **Canonical revisions** | `document_revisions` (not `document_versions`) |
| **Legacy mobile table** | Renamed — must not keep name `documents` |

#### OPTION B — Migration strategy

| Step | Action |
|------|--------|
| B1 | **Operator SQL (no new repo file):** `ALTER TABLE public.documents RENAME TO logistics_documents;` |
| B2 | `ALTER TABLE public.document_versions RENAME TO logistics_document_versions;` (optional FK/policy review) |
| B3 | Update mobile SQL references in **future** app migration / views — or use DB **views** `documents` → `logistics_documents` temporarily (**not recommended** — hides collision) |
| B4 | Apply `20260531000100_constitutional_documents.sql` → creates new empty `documents` |
| B5 | Apply `20260545000000_documents_ci_metadata.sql` against **`logistics_documents`**, not constitutional `documents` (edit target in operator runbook) |
| B6 | Mobile app continues `.from("documents")` until code points at `logistics_documents` — **runtime still works** if views alias OR code updated later |

**Minimum for schema recovery apply:** B1 (+ B2) before web constitutional migration.

#### OPTION C — Deprecation strategy

| Target | Strategy |
|--------|----------|
| Legacy `documents` / `document_versions` | **DEPRECATED** name; rename to `logistics_*`; retain data |
| Constitutional chain | **PRODUCTION READY** path for `/ingestion` |
| PAI CI on legacy shape | Keep on `logistics_documents` + metadata column |

#### RECOMMENDED PATH (Collision 2)

1. **Rename** live legacy `documents` → `logistics_documents` (and versions table).  
2. **Apply** constitutional `source_documents`, `documents`, `document_revisions` from web migrations.  
3. **Do not** run `CREATE TABLE documents` from constitutional file until rename confirmed.  
4. Schedule **follow-up code sprint** (out of scope) to point Expo `documents.ts` / PAI at `logistics_documents`.

---

## COLLISIONS FOUND

| # | Object | Type | Authorities |
|---|--------|------|-------------|
| 1 | `public.scenes` | Incompatible schema + naming + duplicate authority | Web `production_sets` vs Expo `set_files` |
| 2 | `public.documents` | Incompatible schema + legacy artifact + duplicate authority | Mobile logistics vs Web constitutional |
| — | `document_versions` vs `document_revisions` | **No table name collision** | Different names; coexist after Collision 2 resolved |

---

## COLLISIONS RESOLVED

| Collision | Resolution status | Decision |
|-----------|-------------------|----------|
| **scenes** | **Strategically resolved** (schema not yet split) | Canonical `scenes` = Web/constitutional; Expo uses future **`set_file_scenes`** or interim set-files-only |
| **documents** | **Strategically resolved** (rename not executed) | Rename legacy → `logistics_documents`; canonical `documents` = Web ingestion |

**Not resolved in database** until operator rename (documents) and optional `set_file_scenes` migration (scenes).

---

## SAFE TO EXECUTE SCHEMA RECOVERY

**NO**

### Exact blocking collisions

1. **`public.scenes`** — Cannot run full `20260425180000_set_files.sql` and `20260531000300_set_workspace_tables.sql` both creating `public.scenes`. Recovery plan Phase 2 + 3b (partial) is valid **only after** accepting Expo scene CRUD deferral **or** shipping `set_file_scenes` migration first.

2. **`public.documents`** — Cannot run `20260531000100_constitutional_documents.sql` until legacy `public.documents` is **renamed** on `yddwznlclkcfqqgmorye`.

### When SAFE becomes YES

| Gate | Requirement |
|------|-------------|
| G1 | `ALTER TABLE public.documents RENAME TO logistics_documents;` (and versions rename) executed and verified |
| G2 | Collision 1 path chosen: **(G2a)** `set_file_scenes` migration added + service wired, **or (G2b)** interim recovery without Expo scene table (set_files only) |
| G3 | No operator attempts full `20260425180000` scenes block after web `scenes` exists |

---

## SAFE MIGRATION ORDER (after collisions resolved)

Assumes **G1** complete and **G2b** interim (web-primary scenes; Expo set_files without shared `scenes`).

| Phase | ORDER | Migrations | Target tables |
|-------|-------|------------|---------------|
| **0 — Prereq** | — | Verify `shows`, RLS helpers, `production_documents`; **rename legacy documents** | `logistics_documents` |
| **1 — Schedule** | 1–2 | `20260520100000_production_schedule_shadow.sql`, `20260521100000_schedule_revision_publish_phase2.sql` (mobile copy once) | `production_schedule_*` |
| **2 — Web Sets** | 3–4 | `20260531000300_set_workspace_tables.sql`, `20260531000500_set_hero_photo.sql` | `production_sets`, `assets`, **`scenes`** |
| **3 — Set Files** | 5b | `20260425180000` **set_files + RLS only** (exclude `scenes` block) | `set_files` |
| **4 — Ingestion** | 6–9 | `20260531000000_storage_buckets.sql`, `20260531000100_constitutional_documents.sql`, `20260531000200`, `20260531000400` | `source_documents`, **`documents`**, `document_revisions` |
| **5 — PAI metadata** | 10 | `20260545000000_documents_ci_metadata.sql` on **`logistics_documents`** | metadata column on legacy |

If **G2a** (`set_file_scenes` migration exists): run it in **Phase 3** before or instead of excluding Expo scenes block; keep constitutional `scenes` in Phase 2.

---

## FINAL REPORT

```text
COLLISIONS FOUND:        2 (public.scenes, public.documents)
COLLISIONS RESOLVED:     2 (strategic decisions documented; DB not yet altered)

SAFE TO EXECUTE SCHEMA RECOVERY:  NO

Blocking collision 1:  public.scenes — mutually exclusive CREATE TABLE definitions
Blocking collision 2:  public.documents — legacy table occupies name on live project
```

**Next operator actions (no app code):**

1. Rename legacy `documents` / `document_versions`.  
2. Choose G2a vs G2b for Set File scenes.  
3. Execute phased order in [SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md](./SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md) with collision gates above.
