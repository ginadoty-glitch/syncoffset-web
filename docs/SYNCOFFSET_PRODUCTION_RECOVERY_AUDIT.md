# SyncOffset Production Recovery Audit

**Date:** 2026-06-02  
**Live project:** `yddwznlclkcfqqgmorye` (`https://yddwznlclkcfqqgmorye.supabase.co`)  
**Method:** Migration files + runtime loaders + PostgREST table probes (anon key, same as Expo). Documentation used only for cross-check.

---

## Executive summary

| Priority | Finding |
|----------|---------|
| **P1 — Schema** | Most production-nav tables are **not deployed** on live Supabase. Operational tables (`shows`, `trips`, `runsheets`, `vendors`, `drivers`) exist. |
| **P2 — Build** | **PASS** (`syncoffset-web` `npm run build`) |
| **P3 — Typecheck** | **PASS** web; **PASS** expo after PAI cast fix (was pre-existing, blocking deployability) |
| **P4 — Runtime E2E** | **BLOCKED** — cannot validate Set Files or cross-client schedule without P1 |

**DEPLOYABLE:** **NO** — apply migration bundle below before TestFlight field validation.

---

## Live Supabase table existence (TASK 1)

Probed via `GET /rest/v1/{table}?select=id&limit=1` with project anon key.

| TABLE | EXISTS | Notes |
|-------|--------|-------|
| `shows` | **YES** | 200 |
| `vendors` | **YES** | 200 |
| `trips` | **YES** | 200 |
| `runsheets` | **YES** | 200 |
| `drivers` | **YES** | 200 |
| `documents` | **UNKNOWN (RLS)** | 42501 permission denied — may exist |
| `document_versions` | **UNKNOWN (RLS)** | 42501 on earlier probe |
| `production_sets` | **NO** | PGRST205 |
| `assets` | **NO** | PGRST205 |
| `scenes` (web workspace) | **NO** | PGRST205 |
| `set_files` | **NO** | PGRST205 |
| `scenes` (Expo set_file FK) | **NO** | same table name — not deployed |
| `production_schedule_revisions` | **NO** | PGRST205 |
| `production_schedule_days` | **NO** | PGRST205 |
| `production_schedule_shadow` | **NO** | PGRST205 |
| `production_schedule_lineage` | **NO** | (not probed; depends on revisions) |
| `source_documents` | **NO** | PGRST205 |
| `document_revisions` | **NO** | PGRST205 |
| `calendar_days` | **NO** | PGRST205 (web alt calendar migration; loader uses schedule tables) |
| `production_calendars` | **NO** | PGRST205 |
| `work_orders` | **NO** | PGRST205 |
| `transport_orders` | **NO** | PGRST205 |
| `measured_items` / `measurements` | **NO** | PGRST205 — no SQL migration in repo for measure-item |

---

## Visible workflow audit

### 1. Sets (Web)

| Field | Value |
|-------|-------|
| **ROUTE** | `/dashboard/sets`, `/dashboard/sets/[setId]` |
| **SOURCE OF TRUTH** | Supabase `production_sets`, `assets`, `scenes` |
| **TABLES REQUIRED** | `production_sets`, `assets`, `scenes` (+ optional `hero_image_url` column via `20260531000500`) |
| **TABLES EXIST** | **NO** |
| **BUILD** | PASS |
| **TYPECHECK** | PASS (web) |
| **RUNTIME** | Empty state + migration message in loader |
| **BLOCKER** | Migration `20260531000300_set_workspace_tables.sql` not applied |
| **CLASSIFICATION** | **INFRASTRUCTURE BLOCKED** |

**Loader:** `src/lib/sets/list-production-sets.ts` → `.from("production_sets")`, `isMissingRelation` → user-facing deploy hint.

---

### 2. Production Calendar (Web)

| Field | Value |
|-------|-------|
| **ROUTE** | `/dashboard/production-calendar` |
| **SOURCE OF TRUTH** | Supabase published schedule: `production_schedule_revisions` (`revision_scope = published`) + `production_schedule_days` |
| **TABLES REQUIRED** | `production_schedule_revisions`, `production_schedule_days`; optional overlays: `work_orders`, `transport_orders` |
| **TABLES EXIST** | **NO** (schedule); work/transport **NO** |
| **BUILD** | PASS |
| **TYPECHECK** | PASS (web) |
| **RUNTIME** | Empty grid when no published revision; error if tables missing |
| **BLOCKER** | `20260520100000_production_schedule_shadow.sql` + `20260521100000_schedule_revision_publish_phase2.sql` not applied |
| **CLASSIFICATION** | **INFRASTRUCTURE BLOCKED** |

**Loader:** `src/lib/production-calendar/load-production-calendar-month.ts` — does **not** read `calendar_days` (`20260531000700` is separate/optional).

**Note:** `20260531000700_production_calendar.sql` creates `production_calendars` / `calendar_days` — **not** wired to current web loader.

---

### 3. Ingestion (Web)

| Field | Value |
|-------|-------|
| **ROUTE** | `/ingestion`, `/ingestion/upload`, `/ingestion/[id]` |
| **SOURCE OF TRUTH** | Supabase `source_documents`, `documents`, `document_revisions` |
| **TABLES REQUIRED** | `20260531000100_constitutional_documents.sql` (+ `20260531000200` indexes, `20260531000000` storage buckets) |
| **TABLES EXIST** | `source_documents` **NO**; `document_revisions` **NO**; `documents` unclear (42501) |
| **BUILD** | PASS |
| **TYPECHECK** | PASS (web) |
| **RUNTIME** | Queue fails or empty without schema |
| **BLOCKER** | Constitutional document migrations not applied on hosted project |
| **CLASSIFICATION** | **INFRASTRUCTURE BLOCKED** |

**Loaders:** `src/lib/ingestion/queries.ts`, `document-chain.ts`.

**Repo gap:** Constitutional migrations exist only under `syncoffset-web/supabase/migrations/` — not duplicated in `syncoffset-mobile/supabase/migrations/`.

---

### 4. Set Files (Expo)

| Field | Value |
|-------|-------|
| **ROUTE** | `/set-files`, `/set-file/[id]` |
| **SOURCE OF TRUTH** | Supabase `set_files`, `scenes` (`set_file_id`) |
| **TABLES REQUIRED** | `set_files`, `scenes` — `syncoffset-mobile/supabase/migrations/20260425180000_set_files.sql` |
| **TABLES EXIST** | **NO** |
| **BUILD** | N/A (Expo) |
| **TYPECHECK** | **PASS** (after PAI fix) |
| **RUNTIME** | List empty; writes fail at Supabase |
| **BLOCKER** | `20260425180000_set_files.sql` not applied |
| **CLASSIFICATION** | **INFRASTRUCTURE BLOCKED** (code **PARTIALLY IMPLEMENTED** — wired to Supabase, no AsyncStorage authority) |

**Service:** `expo/services/setFilesService.ts` — `expo/app/set-files.tsx`, `set-file/[id].tsx` use `showId`.

**E2E validation (TASK 3):** **BLOCKED** — not run; requires schema + authenticated dispatch user (RLS `is_dispatch`).

---

### 5. Measure Item (Expo)

| Field | Value |
|-------|-------|
| **ROUTE** | `/measure-item` (Operations hub, dispatch home, wrap) |
| **SOURCE OF TRUTH** | **AsyncStorage** `syncoffset:measurements:{showId}` |
| **TABLES REQUIRED** | None in repo |
| **TABLES EXIST** | N/A |
| **BUILD** | N/A |
| **TYPECHECK** | PASS |
| **RUNTIME** | Works device-local; **not** cloud-durable |
| **BLOCKER** | No Supabase table (out of scope for this sprint) |
| **CLASSIFICATION** | **PARTIALLY IMPLEMENTED** — honest device SOR; reinstall loses data |

**Service:** `expo/services/measurements.ts` only.

---

### 6. Production Calendar / Schedule (Expo ↔ Web)

| Field | Value |
|-------|-------|
| **ROUTE (Expo)** | Calendar tab, schedule import, publish flows |
| **ROUTE (Web)** | `/dashboard/production-calendar` |
| **SOURCE OF TRUTH** | Shared: `production_schedule_revisions` + `production_schedule_days` (published revision) |
| **TABLES EXIST** | **NO** on live project |
| **BLOCKER** | Schedule migrations not applied; cannot verify Expo publish → Web calendar |
| **CLASSIFICATION** | **INFRASTRUCTURE BLOCKED** |

**Expo:** `scheduleCanonicalPersistence.ts`, `scheduleRevisionGovernance.ts` (`publishScheduleRevision`).  
**Web:** `load-production-calendar-month.ts` reads same published revision.

**E2E validation (TASK 4):** **BLOCKED**.

---

## Navigation truthfulness (post mock-removal sprint)

Production sidebar: **Sets**, **Production Calendar**, **Ingestion**, coming-soon placeholders.  
MOCK logistics/communications **removed** from nav (routes on disk only).

---

## PRIORITY ORDER — sprint execution

| # | Task | Status |
|---|------|--------|
| 1 | Missing Supabase schema | **DOCUMENTED** — operator must apply bundle (no service-role key in CI env) |
| 2 | Build failures | **PASS** |
| 3 | Typecheck failures | **FIXED** — PAI adapters + demo cast via `unknown` |
| 4 | Runtime E2E | **BLOCKED** on P1 |
| 5 | Device validation | **BLOCKED** on P1 |

---

## Migration apply bundle (operator)

Apply in **Supabase SQL Editor** on `yddwznlclkcfqqgmorye` in order. Skip files already applied (use `IF NOT EXISTS` where present). Confirm `public.is_member_of` / `public.is_dispatch` exist (mobile migrations through `20260518120000` likely applied given `trips`/`shows`).

### A — Schedule (Expo + Web calendar)

1. `syncoffset-mobile/supabase/migrations/20260520100000_production_schedule_shadow.sql`  
2. `syncoffset-mobile/supabase/migrations/20260521100000_schedule_revision_publish_phase2.sql`  
   (duplicate in `syncoffset-web/supabase/migrations/` — same content)

### B — Set Files (Expo)

3. `syncoffset-mobile/supabase/migrations/20260425180000_set_files.sql`  
   (requires `shows`, `is_member_of`, `is_dispatch`)

### C — Sets workspace (Web)

4. `syncoffset-web/supabase/migrations/20260531000300_set_workspace_tables.sql`  
5. `syncoffset-web/supabase/migrations/20260531000500_set_hero_photo.sql` (if hero URLs used)

### D — Ingestion (Web)

6. `syncoffset-web/supabase/migrations/20260531000000_storage_buckets.sql`  
7. `syncoffset-web/supabase/migrations/20260531000100_constitutional_documents.sql`  
8. `syncoffset-web/supabase/migrations/20260531000200_document_chain_indexes.sql`  
9. `syncoffset-web/supabase/migrations/20260531000400_documents_set_index.sql`

### E — Optional (not used by current web calendar loader)

- `syncoffset-web/supabase/migrations/20260531000700_production_calendar.sql`  
- `syncoffset-web/supabase/migrations/20260531000600_work_transport_orders.sql` (calendar overlay counts)

### Post-apply verification

```sql
SELECT count(*) FROM public.set_files;
SELECT count(*) FROM public.production_sets;
SELECT count(*) FROM public.production_schedule_revisions;
SELECT count(*) FROM public.source_documents;
```

Re-run PostgREST probe (expect 200 on tables above).

---

## Code changes this sprint

| Change | Purpose |
|--------|---------|
| `expo/services/pai/adapters.ts` | `prior as unknown as Record<string, unknown>` — typecheck |
| `expo/services/pai/commercialInvoiceRedistribution.demo.ts` | same — typecheck |

No new routes, tables, or UI.

---

## FINAL REPORT

### COMPLETED

- Live Supabase table audit (anon probe)
- Per-workflow classification for all five visible workflows
- Migration bundle documented with file paths
- Expo **typecheck PASS** (PAI pre-existing errors fixed)
- Web **build PASS**, **typecheck PASS**

### BLOCKED

- Applying migrations (no `SUPABASE_SERVICE_ROLE_KEY` in environment; Supabase CLI not installed)
- Set Files E2E (create/edit/delete/scene/restart/reinstall)
- Schedule Expo publish → Web calendar parity test
- TestFlight **PRODUCTION READY** for Sets / Calendar / Ingestion / Set Files

### MIGRATIONS APPLIED

**None** in this sprint (documentation + verification only).

### TYPECHECK ISSUES REMAINING

**None** (expo + web pass after PAI fix).

### RUNTIME ISSUES REMAINING

- Missing tables on `yddwznlclkcfqqgmorye` (see table matrix)
- Measure Item remains AsyncStorage-only (by design / out of scope)
- Direct URL access to MOCK routes still possible (hidden from nav only)

---

```text
BUILD STATUS:        PASS (syncoffset-web)
TYPECHECK STATUS:    PASS (syncoffset-web + syncoffset-mobile/expo)
RUNTIME STATUS:      INFRASTRUCTURE BLOCKED (primary); PARTIALLY IMPLEMENTED (Measure Item, Set Files code)
SOURCE OF TRUTH:     Mixed — Supabase intended; Measure Item = AsyncStorage; schema absent on host
DEPLOYABLE:          NO
```

### Exact blockers preventing TestFlight readiness

1. **Apply migration bundle** on `yddwznlclkcfqqgmorye` (at minimum: schedule pair, `set_files`, `production_sets` + constitutional docs if using ingestion).
2. **Re-verify** table probes return 200.
3. **Field validation:** Set Files CRUD + schedule publish cross-client test with real auth (dispatch role for `set_files` RLS).
4. **Measure Item** remains non-cloud — acceptable only if documented as device-scoped for this release.
