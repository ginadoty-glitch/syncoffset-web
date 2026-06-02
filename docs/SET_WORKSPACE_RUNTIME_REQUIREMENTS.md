# Set Workspace Runtime Requirements

**Phase:** 3D.1 — Blocker 1 (Migration Readiness)  
**Audit date:** 2026-05-31  
**Purpose:** Define exactly what must exist before `/dashboard/sets` and `/dashboard/sets/[setId]` are usable.

---

## OBJECTIVE

Operators and developers can verify persistence prerequisites without guessing. No mock data.

---

## Environment variables (required)

| Variable | Used by |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabase/server.ts`, client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Session middleware |
| `SUPABASE_SERVICE_ROLE_KEY` | `listProductionSets()`, `loadSetWorkspace()` (server loaders) |
| `NEXT_PUBLIC_DEFAULT_PRODUCTION_ID` | Filter sets list; must match `production_sets.production_id` on seeded rows |

If any are missing, loaders return empty states or error messages — not fictional sets.

---

## Migrations (apply in order)

| File | Purpose | Set workspace dependency |
|------|---------|-------------------------|
| `20260531000000_storage_buckets.sql` | Storage buckets | Optional for set UI; required for ingestion photos later |
| `20260531000100_constitutional_documents.sql` | `source_documents`, `documents`, `document_revisions` | **Documents panel** on set detail |
| `20260531000200_document_chain_indexes.sql` | Indexes on `document_revisions` | Performance for ingestion chain |
| `20260531000300_set_workspace_tables.sql` | `production_sets`, `assets`, `scenes` | **List + detail root** |

**Detect missing migrations:** Supabase error `42P01` or `PGRST205` → loaders treat as “persistence unavailable” (`list-production-sets.ts`, `load-set-workspace.ts`).

---

## Tables required for set workspace

### 1. `production_sets` (constitutional `ProductionSet`)

**Migration:** `20260531000300_set_workspace_tables.sql`

| Check | Status |
|-------|--------|
| Table defined | Yes |
| Index `idx_production_sets_production` | Yes |
| RLS SELECT for `authenticated` | Yes |
| FK from `assets` / `scenes` | Yes (`ON DELETE CASCADE`) |

**Loader:** `listProductionSets()` — `.eq("production_id", productionId)`  
**Loader:** `loadSetWorkspace(setId)` — `.eq("id", setId).maybeSingle()`

**Seed assumptions:**

- At least one row with `production_id = NEXT_PUBLIC_DEFAULT_PRODUCTION_ID` for list page to show cards.
- `set_number`, `set_name`, `created_by`, `modified_by` are NOT NULL in SQL.
- `status` ∈ `planned` \| `active` \| `struck` \| `archived` (constitutional `SetStatus`).

**Not enforced at runtime:** `asset_ids`, `location_ids`, `related_scene_ids` JSON arrays are not synced when child rows are inserted.

---

### 2. `assets` (constitutional `Asset` subset)

**Migration:** same file as `production_sets`

| Check | Status |
|-------|--------|
| Table defined | Yes |
| Index `idx_assets_set` on `set_id` | Yes |
| `set_id` FK → `production_sets` | Yes |

**Loader:** `loadSetWorkspace()` — `.eq("set_id", setId)`

**Optional display columns (not on constitutional type):** `photo_storage_ref`, `vendor_display_name`, `cost_display_amount`

**Seed assumptions:**

- Each asset row must reference an existing `production_sets.id` in `set_id`.
- `category_id` must match values used in `ASSET_CATEGORY_REGISTRY` for board grouping.

---

### 3. `scenes` (constitutional `Scene` subset)

**Migration:** same file

| Check | Status |
|-------|--------|
| Table defined | Yes |
| Index `idx_scenes_set` on `set_id` | Yes |

**Loader:** `loadSetWorkspace()` — `.eq("set_id", setId)`

**Seed assumptions:**

- Simplified schema: `description`, `cast_count`, `asset_count`, `episode_number` (episode on set header uses first scene’s `episode_number`).
- `location_id`, `script_revision_id` are NOT NULL in SQL — seed with placeholder UUIDs if needed.

---

### 4. `documents` (constitutional `Document`)

**Migration:** `20260531000100_constitutional_documents.sql`

| Check | Status |
|-------|--------|
| Table defined | Yes |
| Column `set_id` UUID nullable | Yes |
| Column `set_number` TEXT nullable | Yes |
| Index on `set_id` | **Missing** — recommended: `CREATE INDEX idx_documents_set ON documents (set_id);` |
| Index `idx_documents_production` | Yes |
| Index `idx_documents_source_document` | Yes |

**Loader:** `loadSetWorkspace()` — `.eq("set_id", setId)`

**Critical gap:** Upload/document chain sets `set_id: null` on insert (see `DOCUMENT_SET_LINKING_AUDIT.md`). Documents panel stays empty after ingestion until `set_id` is populated manually or by a future sprint.

---

## Tables not required for V1 UI (but audit-noted)

| Table | Impact if missing |
|-------|-------------------|
| `source_documents` | Ingestion only; set page does not query |
| `document_revisions` | Ingestion only |
| `production_costs` | Financial panels empty (by design) |
| `work_orders` | Open work = documents only |
| `locations` | `production_sets.location_ids` unused in UI |

---

## Minimum seed checklist (operator)

1. Apply all four migration files (or `supabase db push`).
2. Set `.env.local` from `.env.example`.
3. Insert one `production_sets` row:

```sql
INSERT INTO production_sets (
  id, production_id, created_by, modified_by,
  set_number, set_name, status
) VALUES (
  '<uuid>',
  '<NEXT_PUBLIC_DEFAULT_PRODUCTION_ID>',
  'operator@syncoffset.local',
  'operator@syncoffset.local',
  '101',
  'Police Station Interior',
  'active'
);
```

4. Optional: insert `assets` / `scenes` / `documents` with matching `set_id`.
5. Open `/dashboard/sets` → card → `/dashboard/sets/<uuid>`.

---

## Readiness gate

| Gate | Condition |
|------|-----------|
| **List usable** | `production_sets` exists + ≥1 row for default production |
| **Detail usable** | Row exists for URL `setId` |
| **Assets panel** | `assets` rows with `set_id` |
| **Documents panel** | `documents` rows with `set_id` populated |
| **Scenes panel** | `scenes` rows with `set_id` |

Until gates pass, empty states are **correct** — not bugs.

---

## Recommended follow-up (not in 3D.1 scope)

- Add `idx_documents_set` migration.
- Sync `production_sets.asset_ids` when assets change.
- Populate `documents.set_id` during ingestion (documented in linking audit).

---

*End of runtime requirements.*
