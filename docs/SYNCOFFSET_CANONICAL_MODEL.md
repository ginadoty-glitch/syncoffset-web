# SyncOffset Canonical Data Model

**Audit date:** 2026-06-01  
**Scope:** `syncoffset-web` + `syncoffset-mobile` (Expo) — tables, runtime consumers, constitutional types.  
**Explicitly out of scope:** New features, UI, migrations (this document defines truth only).

**Evidence:** `supabase/migrations/` in both repos, `grep` for `.from("table")`, constitutional docs under `syncoffset-web/docs/*AUTHORITY*`, Expo `AppProvider`, `scheduleShadowMirror.ts`, `setFilesService.ts`, PAI `adapters.ts`.

---

## Executive verdict

SyncOffset today runs on **one Supabase project in intent** but **two parallel schemas** that were never merged.

| Layer | Canonical owner |
|-------|-----------------|
| **Tenant / show** | Expo `shows` + `show_members` |
| **Strip calendar (operational)** | Expo `production_schedule_revisions` + `production_schedule_days` |
| **Shoot day (app model)** | TypeScript `ShootDay` → mirrored to `production_schedule_days` |
| **Wall calendar (planning UI)** | Constitutional `CalendarDay` — **not yet unified**; web `calendar_days` is a **fork** |
| **Sets (constitutional)** | Web `production_sets` (+ `assets`, `scenes` children) |
| **Sets (legacy name)** | Expo `set_files` — **deprecated** (same intent, older shape) |
| **Documents (constitutional custody)** | Web `source_documents` → `documents` → `document_revisions` |
| **Documents (field ingest / ops)** | Expo `production_documents` (+ PAI `pai_*`) |
| **Transport (movement)** | Expo `runsheets` + `trips` + `trip_stops` + `shipments` |
| **Work orders** | Constitutional `work_orders` table (web migration) — **target SOR** |
| **Budget (operational pressure)** | Expo `production_budget_lines`, `production_check_requests`, `production_petty_cash_entries` |
| **Budget (constitutional)** | Web `src/types/core/accounting/*` — **types only** until wired |

**ID convention risk:** Web uses `production_id`; Expo uses `show_id` referencing `shows(id)`. Treat as **same tenant UUID** until a naming standard is enforced.

---

## Namespace collisions (same table name, different meaning)

| Table name | Web | Expo | Ruling |
|------------|-----|------|--------|
| `documents` | Constitutional `Document` + chain | Legacy row store; PAI CI uses this table | **Split namespaces** — do not merge blindly |
| `scenes` | FK → `production_sets` | FK → `set_files` | **Duplicate** — canonical FK → `production_sets` |
| `assets` | Constitutional `Asset` on set | Generic `assets` + `production_assets` | **Duplicate** — canonical `production_sets.assets` child table on web shape |

---

## Domain decisions

### CALENDAR

| Candidate | Repo | Runtime writes | Constitutional fit |
|-----------|------|----------------|---------------------|
| `calendar_days` + `calendar_day_*` | Web only | Web read-only UI | `CalendarDay`, `ProductionCalendar` |
| `production_schedule_*` | Expo only | Import, shadow mirror, revision lineage | Shooting schedule → strip archive |
| `ShootDay` (`expo/types`) | Expo | `AppProvider`, smart import, calendar tab | Execution-oriented strip row |
| `production_calendar_events` | Expo | PAI adapter **deferred** (not available) | Not active |

#### Which model wins?

**System of record for the production strip:**  
`production_schedule_revisions` + `production_schedule_days`

**Application canonical shape:**  
`ShootDay` (in-memory + AsyncStorage schedule spine) **maps to** `production_schedule_days` via `scheduleShadowMirror.ts`

**`calendar_days`:** **Duplicate (deprecated as SOR)** — valid as constitutional *planning* projection only after ETL from schedule days. Web strip UI should consume schedule data, not maintain a second calendar.

**Constitutional hierarchy** (from `SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md`):

```
Shooting Schedule → Production Calendar → CalendarDay → ShootDay
```

**Runtime truth today inverts the bottom two:** Expo implements **ShootDay-first** strip data; web `calendar_days` was added without Expo consumers.

| | |
|--|--|
| **Canonical source** | `production_schedule_revisions`, `production_schedule_days` |
| **Consumer systems** | **Expo:** `(tabs)/calendar`, smart import, one-liner, schedule history. **Web:** `load-production-calendar-month.ts` (should become read replica / sync target, not parallel editor) |
| **Migration path** | 1) Declare schedule tables SOR. 2) Job: `production_schedule_days` → `calendar_days` + scene links (or drop `calendar_days` and query schedule from web). 3) Link `shoot_day_id` on calendar day when execution record exists. |
| **Deprecation path** | Stop seeding standalone `calendar_days`. Freeze web-only calendar migrations. Mark `calendar_days` **deprecated** until fed by schedule ETL. |

---

### SETS

| Candidate | Repo | Wired UI | Notes |
|-----------|------|----------|-------|
| `production_sets` | Web | Set list, set detail, photos, docs, WO/transport | Constitutional `ProductionSet` |
| `set_files` | Expo (SQL) | `setFilesService.ts` (Supabase path) | Comment: "shared desktop+mobile" |
| `set_files` | Expo (UI) | `set-files.tsx` uses **`setFiles.ts` AsyncStorage** | **Not using SQL today** |
| `production_assets` | Expo | Asset inventory / capture | Different from web `assets` |

#### Which model wins?

**`production_sets`** (+ child `assets`, `scenes` on web schema)

**`set_files`:** **Deprecated** — predecessor naming; FK to `shows(id)` under `production_id` column. Merge into `production_sets` or map 1:1.

**AsyncStorage `syncoffset:set_files:*`:** **Deprecated** — device-local fork; replace with `setFilesService` → `production_sets`.

| | |
|--|--|
| **Canonical source** | `production_sets`, `assets`, `scenes` (web migration `20260531000300`) |
| **Consumer systems** | **Web:** full set workspace. **Expo:** should consume `production_sets` (today: local AsyncStorage + dormant `set_files` table) |
| **Migration path** | 1) Wire Expo `set-files` to `setFilesService` / `production_sets`. 2) Backfill `set_files` → `production_sets`. 3) Align `scenes.set_id` to `production_sets.id`. |
| **Deprecation path** | `set_files` table, AsyncStorage set index, Expo `SetFile` type alias → `ProductionSet` view model. |

---

### DOCUMENTS

| Candidate | Repo | Pipeline |
|-----------|------|----------|
| Web chain | Web | Upload → `source_documents` → auto `documents` + `document_revisions` |
| Expo ingest | Expo | `production_documents`, chronology metabolism, storage `production-documents` |
| Expo `documents` | Expo | PAI commercial invoice rows (`document_type`, metadata) |
| Constitutional types | Web | `ImmutableSourceDocument`, `Document`, `DocumentRevision` |

#### Which model wins?

**Dual canonical until merge** (different jobs):

| Role | Owner |
|------|--------|
| **Constitutional document custody & art-office review** | Web **`source_documents` → `documents` → `document_revisions`** |
| **Field / coordinator paperwork & CI redistribution** | Expo **`production_documents`** + **`pai_*`** |

**Expo table `documents` (20260428):** **Deprecated for new features** — legacy; PAI CI should eventually move under `production_documents` or constitutional `documents` with namespaced `document_type`.

**Do not** treat web `documents` and Expo `documents` as one table without schema diff.

| | |
|--|--|
| **Canonical source (custody)** | Web document chain tables |
| **Canonical source (operational ingest)** | `production_documents` |
| **Consumer systems** | **Web:** `/ingestion`, document detail, set link. **Expo:** production-document-ingest, PAI, PDF viewer |
| **Migration path** | 1) Map `production_documents` kinds → `source_document_kind`. 2) Optional bridge: `production_documents.constitutional_document_id` → web `documents.id`. 3) Single review queue surface. |
| **Deprecation path** | Parallel uploads with no bridge. Expo-only OCR paths that bypass custody enum. |

---

### TRANSPORT

| Candidate | Repo | Evidence |
|-----------|------|----------|
| `transport_orders` | Web | Set/asset panels; **not** used by logistics mock UI |
| `runsheets` | Expo | Dispatch, new-runsheet, PAI resolver, operational-transport |
| `trips` / `trip_stops` | Expo | Tab Trips, map, drivers |
| `shipments` / `production_shipments` | Expo | Shipments screens, PAI |

#### Which model wins?

**`runsheets`** (primary movement order) **+** `trips` / `trip_stops` (execution) **+** `shipments` (parcel tracking)

**`transport_orders` (web):** **Deprecated as SOR** — duplicate of movement intent; either drop or **materialized view** from `runsheets` later.

| | |
|--|--|
| **Canonical source** | `runsheets`, `trips`, `trip_stops`, `shipments`, `production_shipments` |
| **Consumer systems** | **Expo:** dispatch, trips, runsheets, shipments. **Web:** logistics UI uses **mock** `shipment-data.ts` — must attach to runsheets API |
| **Migration path** | 1) Expo SOR unchanged. 2) Web reads runsheets (read-only) for set/asset context. 3) Remove or repurpose `transport_orders`. |
| **Deprecation path** | Web `transport_orders` writes. Mock logistics as source of truth. |

---

### WORK ORDERS

| Candidate | Repo | Evidence |
|-----------|------|----------|
| `work_orders` | Web | Table + set/asset read panels |
| `runsheets.work_order` | Expo | Text field on transport order |

#### Which model wins?

**`work_orders` table** (constitutional `WorkOrder`)

**`runsheets.work_order`:** **Deprecated** — legacy string reference; migrate to FK `work_order_id` or sync from `work_orders.work_order_number`.

| | |
|--|--|
| **Canonical source** | `work_orders` |
| **Consumer systems** | **Web:** set sidebar panels. **Expo:** should list/link WO by ID (today: string on runsheet only) |
| **Migration path** | Add `work_order_id` on `runsheets` optional; backfill from matching number. |
| **Deprecation path** | Treating runsheet WO text as authoritative. |

---

### BUDGET

| Candidate | Repo | Evidence |
|-----------|------|----------|
| Web accounting types | Web | `src/types/core/accounting/*`, authorities — **no budget tables** |
| Web `/dashboard/finance` | Web | Studio Admin personal finance **mock** |
| `production_budget_lines` | Expo | `scriptBudget.ts`, live budget |
| `production_check_requests` | Expo | live budget, `/budget` |
| `production_petty_cash_entries` | Expo | live budget |
| Operational memory tables | Expo | sacrifice, prep, etc. — **pressure signals, not ledger** |

#### Which model wins?

**Expo budget tables** for **operational financial pressure** (not GAAP ledger).

**Web constitutional accounting:** **Types-only canonical** — defines vocabulary; **presentation-only** until tables exist.

**Web template finance dashboard:** **Deprecated** — stop development.

| | |
|--|--|
| **Canonical source** | `production_budget_lines`, `production_check_requests`, `production_petty_cash_entries`, related import batches |
| **Consumer systems** | **Expo:** `live-budget`, `budget`, script budget. **Web:** none (coming-soon nav) |
| **Migration path** | Web Live Budget route = read-only consumer of Expo budget APIs / shared views. |
| **Deprecation path** | Web finance template widgets. Duplicate budget concepts in types without tables. |

---

## Classification matrix (tables / models)

### Web-only tables (`syncoffset-web` migrations)

| Table | Status | Notes |
|-------|--------|-------|
| `source_documents` | **Canonical** | Custody ingress |
| `documents` | **Canonical** | Constitutional document |
| `document_revisions` | **Canonical** | Version chain |
| `production_sets` | **Canonical** | Set SOR |
| `assets` | **Canonical** | Child of set |
| `scenes` | **Canonical** | Child of set (web FK) |
| `work_orders` | **Canonical** | Target WO SOR |
| `transport_orders` | **Deprecated** | Superseded by runsheets |
| `production_calendars` | **Duplicate** | Planning wrapper; subordinate to schedule SOR |
| `calendar_days` | **Deprecated** | Until fed from `production_schedule_days` |
| `calendar_day_scenes` | **Deprecated** | Same |
| `calendar_day_obligations` | **Duplicate** | Could merge to schedule day metadata |
| Storage buckets (web migration) | **Canonical** | Ingestion + `set-photos` |

### Expo-only tables (representative; 100+ total)

| Table / area | Status |
|--------------|--------|
| `shows`, `show_members` | **Canonical** | Tenant |
| `production_schedule_revisions`, `production_schedule_days` | **Canonical** | Calendar SOR |
| `runsheets`, `trips`, `trip_stops` | **Canonical** | Transport |
| `shipments`, `production_shipments` | **Canonical** | Shipments |
| `production_documents` | **Canonical** | Ops ingest |
| `production_budget_*`, `production_check_requests`, `production_petty_cash_entries` | **Canonical** | Budget pressure |
| `production_scripts`, `production_script_scenes`, breakdown | **Canonical** | Script hub |
| `pai_*` | **Canonical** | CI redistribution engine |
| `vendors`, `crew_contacts`, `chat_*` | **Canonical** | Desk ops |
| `set_files` | **Deprecated** | → `production_sets` |
| `documents` (Expo legacy) | **Deprecated** | PAI only; isolate |
| `production_calendar_events` | **Missing** | Adapter deferred |

### Types-only (no runtime SOR)

| Area | Location |
|------|----------|
| Full constitutional core | `syncoffset-web/src/types/core/**` |
| ShootDay service contracts (legacy) | `src/types/core/services/shoot-day-record.ts` |
| Build / buy / pull lists | No tables in either repo |
| Web accounting runtime | Types without Postgres |

---

## RISK — Workflows implemented twice

| Workflow | Implementation A | Implementation B | Severity |
|----------|----------------|------------------|----------|
| Production calendar | Expo schedule + ShootDay | Web `calendar_days` | **Critical** |
| Sets | Web `production_sets` | Expo AsyncStorage + `set_files` SQL | **Critical** |
| Documents | Web chain | Expo `production_documents` + legacy `documents` | **High** |
| Transport | Expo runsheets/trips | Web `transport_orders` + mock logistics | **High** |
| Work orders | Web `work_orders` | Runsheet string field | **Medium** |
| Scenes | Web `scenes` → `production_sets` | Expo `scenes` → `set_files` | **High** (name collision) |
| Commercial invoice | Web mock brokerage | Expo PAI + real CI | **High** |
| Budget | Expo live budget tables | Web finance template | **Medium** |
| Tenant ID | `production_id` | `show_id` | **Medium** (naming) |

---

## TRUTH TABLE

| Workflow | Canonical owner | Web consumer | Expo consumer |
|----------|-----------------|--------------|---------------|
| Production calendar (strip) | `production_schedule_*` + `ShootDay` | Presentation: `calendar_days` (**should read schedule**) | **Primary:** calendar tab, import |
| Shoot days (execution) | `ShootDay` → `production_schedule_days` | Types only | **Primary** |
| CalendarDay (planning) | Constitutional — **unimplemented SOR** | `calendar_days` fork | — |
| Scenes (script) | `production_script_scenes` + breakdown | Set panel (`scenes` child) | Script hub |
| Scenes (on set) | `scenes` → `production_sets` | Set detail | Should align |
| Sets | `production_sets` | **Primary** | AsyncStorage (**wrong**), `set_files` SQL dormant |
| Set photos | `set-photos` + `hero_image_url` | **Primary** | measure-item / captures (different) |
| Assets (constitutional) | `assets` (web) | Set board | `production_assets` / inventory |
| Asset list | `production_assets` + receipts | Deep link only | **Primary** |
| Documents (custody) | `source_documents` chain | **Primary** | — |
| Documents (ops ingest) | `production_documents` | — | **Primary** |
| Commercial invoices | `pai_*` + `production_documents` | Mock brokerage | **Primary** |
| PODs | — | Types | Embedded in transport |
| Purchase orders | — | Types | Runsheet `po_number` |
| Check requests | `production_check_requests` | Nav placeholder | **Primary** |
| Petty cash | `production_petty_cash_entries` | Nav placeholder | **Primary** |
| P-Cards | — | — | — |
| Budget pressure | `production_budget_lines` + peers | — | **Primary** |
| Cost reports | Expo budget + wrap | Empty set financial panel | Wrap / live budget |
| Vendors | `vendors` | Types | **Primary** |
| Returns | wrap / returns flows | coming-soon | **Primary** |
| Rentals | runsheet rental dates | — | **Primary** |
| Build / buy / pull lists | — | Types only | — |
| Work orders | `work_orders` | Read panels | Runsheet text |
| Transport orders | `runsheets` | Mock + `transport_orders` read | **Primary** |
| Runsheets | `runsheets` | — | **Primary** |
| Shipments | `shipments` | Placeholder route | **Primary** |
| Customs / brokerage | PAI + docs | Mock | Ops + PAI |
| Locations | `locations` | coming-soon | Trips / schedule |
| Crew | `crew_contacts` | coming-soon | **Primary** |
| Communications | `chat_*` | Mock | **Primary** |
| Notifications | operational events | Mock | Signals |
| Search | memory/search migrations | Nav search only | **Primary** |
| Reporting | wrap / asset-report | Hidden demos | **Primary** |
| Script hub | `production_scripts` | Ingestion kinds | **Primary** |

---

## FINAL RECOMMENDATIONS

### 1. System of record (what wins)

| Domain | System of record |
|--------|------------------|
| Tenant | `shows` / `show_members` |
| Schedule & strip calendar | `production_schedule_revisions`, `production_schedule_days` |
| Sets & art workspace graph | `production_sets`, `assets`, `scenes` |
| Document custody | `source_documents`, `documents`, `document_revisions` |
| Field document ingest & CI | `production_documents`, `pai_*` |
| Movement | `runsheets`, `trips`, `trip_stops`, `shipments` |
| Work orders | `work_orders` |
| Budget pressure | `production_budget_lines`, `production_check_requests`, `production_petty_cash_entries` |
| Vendors, crew, chat | Expo operational tables |

**Constitutional types (`src/types/core`)** remain the **semantic law**; Expo `expo/types` should **map to** core types, not fork them.

### 2. Presentation-only (read replicas / UI / mock)

| Item | Treatment |
|------|-----------|
| Web `calendar_days` | Presentation until fed by schedule ETL — **not** an independent editor |
| Web logistics `shipment-data.ts` | Presentation — must read `runsheets` |
| Web brokerage mock | Presentation — read PAI/CI |
| Web Studio Admin dashboards | Presentation — hide from production nav |
| Web `transport_orders` | Presentation overlay on set/asset until synced from runsheets |
| Constitutional accounting types on web | Presentation vocabulary until Expo budget tables exposed on web |

### 3. Stop development immediately

| Stop | Reason |
|------|--------|
| New features on web `calendar_days` without schedule sync | Duplicate calendar |
| Expo AsyncStorage set-files as authority | Duplicate sets |
| Web `transport_orders` as dispatch source | Duplicate transport |
| Web template CRM / finance / ecommerce dashboards | Noise |
| Second document upload path without bridge to `source_documents` | Split custody |
| PAI writes to Expo `documents` for new doc kinds without plan | Legacy table |
| `production_calendar_events` until schedule adapter is real | Missing table |
| Build / buy / pull list UI | No SOR anywhere |

### 4. Immediate integration priorities (truth, not features)

1. **Single calendar read path:** Web strip ← `production_schedule_days` (stop dual seeding).  
2. **Single set ID:** `production_sets` ← retire `set_files` + AsyncStorage.  
3. **Document bridge:** `production_documents` ↔ `source_documents` metadata link.  
4. **Transport read:** Web logistics ← `runsheets` (retire mock for production builds).  
5. **`production_id` ≡ `show_id`** documented on every row.

---

## Appendix — Web migration inventory

```
source_documents, documents, document_revisions
production_sets, assets, scenes
work_orders, transport_orders (deprecated SOR)
production_calendars, calendar_days, calendar_day_scenes, calendar_day_obligations (calendar_days deprecated SOR)
storage buckets: scripts, callsheets, …, set-photos
```

## Appendix — Expo schedule mirror (canonical calendar SOR)

From `20260520100000_production_schedule_shadow.sql`:

- `production_schedule_revisions` — import lineage, `revision_scope` (`local_shadow` | `shared_draft` | `published`)
- `production_schedule_days` — strip rows (`shoot_day`, `day_type`, `title`, `notes`, scene payload in JSON via mirror)
- `production_schedule_lineage` — revision graph

`scheduleShadowMirror.ts` maps `ShootDay[]` → `production_schedule_days` (Expo comment: local spine authoritative for device UX; server shadow for audit).

---

*This document supersedes informal assumptions in older audits that claimed zero overlap between web and mobile Supabase. Overlap is partial but **naming collisions are real**; merge requires deliberate namespace separation, not accidental `documents`/`scenes`/`assets` unification.*
