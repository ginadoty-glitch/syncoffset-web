# SyncOffset Product Matrix

**Audit date:** 2026-06-01  
**Repos:** `syncoffset-web` (Next.js) · `syncoffset-mobile/expo` (Expo Router)  
**Method:** Filesystem route scan, `grep` for Supabase tables/services, sidebar + `(tabs)` + `operations-hub` navigation, migration folder listing. No speculation.

---

## Executive Summary

SyncOffset is **two products sharing a name**, not one product on two clients.

| System | Role today |
|--------|------------|
| **Expo (`syncoffset-mobile`)** | Primary **operational** app: dispatch, trips, runsheets, strip calendar, script hub, live budget, vendors, crew, chat, PAI commercial-invoice engine. **~85** Supabase migrations; heavy `AppProvider` + React Query. |
| **Web (`syncoffset-web`)** | **Art / document / set** workspace sprint: Supabase-backed sets, ingestion, document chain, strip production calendar, read-only WO/transport. **8** Supabase migrations. Large **Studio Admin** shell with **mock** logistics/communications demos. |
| **Shared Supabase schema** | **Partial / divergent.** Web tables (`production_sets`, `calendar_days`, `documents`, `work_orders`) are **not** referenced in Expo grep. Expo uses `trips`, `runsheets`, `production_schedule_*`, `production_documents`, `vendors`, etc. |
| **Constitutional types (`src/types/core`)** | Live on **Web only** (~204 TS files). Expo uses `expo/types` + operational services. |

**Template usage (Web only):** ~35% of `src/` files byte-identical to Studio Admin; production value is in ~60% custom + recent workspace routes.

**Biggest opportunity:** Finish and **connect** what exists — especially calendar, documents, transport, sets — rather than add Buy Lists on one side while the other already solves adjacent problems under different names.

---

## Classification Key

| Code | Meaning |
|------|---------|
| **W** | Exists in Web (runtime UI + loader or functional screen) |
| **E** | Exists in Expo (screen + behavior) |
| **B** | Exists in both |
| **D** | Exists in both but **disconnected** (different data model, storage, or Supabase tables) |
| **T** | Types / docs only (constitutional or authority markdown) |
| **N** | Not built (no meaningful runtime) |

---

## Workflow Matrix

### Production planning

| Workflow | W | E | Class | Web | Expo |
|----------|---|---|-------|-----|------|
| **Production Calendar** | ✓ | ✓ | **D** | Strip month grid `/dashboard/production-calendar` · `calendar_days` + scenes/WO/transport overlay · read-only · **Partial** (needs seed) | Tab `(tabs)/calendar` · board + month modes · `schedule` / `ShootDay` in `AppProvider` · `production_schedule_*` mirror · **Production-ready** (with show + import) |
| **Shoot Days** | T | ✓ | **D** | Types `shoot-day`, `calendar-day`; no shoot-day UI | `ShootDay` in schedule; smart import / one-liner; `production_schedule_revisions` |
| **Scenes** | ✓ | ✓ | **D** | Set detail panel · `scenes` table · read-only | Script hub / breakdown / revision flows · script DB layer · not `production_sets.scenes` |
| **Sets** | ✓ | ✓ | **D** | `/dashboard/sets`, `/dashboard/sets/[setId]` · `production_sets` · **Partial–ready** | `set-files` · **AsyncStorage per show** · not `production_sets` |
| **Set Photos** | ✓ | N | **W** | Hero upload `set-photos` bucket · `hero_image_url` | Set file photos via measure-item / evidence capture (different model) |
| **Locations** | T | ✓ | **D** | Nav → coming-soon | Trips stops, runsheets, schedule locations in AppProvider |
| **Crew** | T | ✓ | **D** | Nav → coming-soon | `/crew`, invites, `crew_contacts` migrations |

### Assets & field

| Workflow | W | E | Class | Web | Expo |
|----------|---|---|-------|-----|------|
| **Asset List** | N | ✓ | **E** | No `/dashboard/assets` index | `/asset-inventory`, `/asset-report`, receipt `assets` |
| **Asset Detail** | ✓ | ✓ | **D** | `/dashboard/assets/[assetId]` · Supabase `assets` · WO + transport read-only · **Partial** | Evidence / inventory flows; not same row as web `assets` |
| **Asset Photos** | T | ✓ | **D** | `photo_storage_ref` column; no upload UI on asset | `measure-item` camera · AR/LiDAR metadata in types |
| **Measurements** | T | ✓ | **T/E** | Types only | `/measure-item` large capture screen |
| **LiDAR** | T | ✓ | **T/E** | — | `MeasureMethod` ARKit/LiDAR in `expo/types` · measure-item |

### Documents & accounting docs

| Workflow | W | E | Class | Web | Expo |
|----------|---|---|-------|-----|------|
| **Documents** | ✓ | ✓ | **D** | Constitutional `documents` + detail route | `production_documents` + PDF viewer |
| **Document Chain** | ✓ | ✓ | **D** | Upload → `source_documents` → auto `documents` · review queue · **Functional write** | `production-document-ingest` · chronology metabolism · **Functional** (different pipeline) |
| **Commercial Invoices** | ✓ | ✓ | **D** | Brokerage UI · **mock** `brokerage-data.ts` | PAI `redistributeCommercialInvoice` · Supabase CI metadata · **Functional** (Expo-leading) |
| **PODs** | T | ✓ | **D** | Category `pod` in types; no POD workspace | Embedded in transport/shipment flows |
| **Purchase Orders** | T | ✓ | **D** | Types `purchase-order`; no PO UI | Runsheets `po_number`; budget rows |
| **Check Requests** | T | ✓ | **D** | Nav → coming-soon | `live-budget` row kind `check_request` → `/budget` |
| **Petty Cash** | T | ✓ | **D** | Nav → coming-soon | `live-budget` row kind `petty_cash` |
| **P-Cards** | T | N | **T** | — | — |
| **Budget** | T | ✓ | **D** | Hidden `/dashboard/finance` · personal-finance **template mock** | `/budget`, `/live-budget` · Supabase pressure snapshot · **Partial–ready** |
| **Cost Reports** | T | ✓ | **D** | Set financial panel labels only (empty) | Live budget department lanes |

### Procurement lists

| Workflow | W | E | Class | Web | Expo |
|----------|---|---|-------|-----|------|
| **Build Lists** | T | N | **T** | Inventory types only | No grep match |
| **Buy Lists** | T | N | **T** | — | — |
| **Pull Lists** | T | N | **T** | — | — |
| **Vendors** | T | ✓ | **E** | Types `vendor` | `/manage?tab=vendors` · `vendors` table · seed fallback |
| **Rentals** | T | ✓ | **E** | — | Runsheet rental dates → calendar copy |

### Operations

| Workflow | W | E | Class | Web | Expo |
|----------|---|---|-------|-----|------|
| **Work Orders** | ✓ | ✓ | **D** | `work_orders` table · set/asset panels · read-only | `work_order` field on runsheets · not web `work_orders` |
| **Transport Orders** | ✓ | ✓ | **D** | DB `transport_orders` on set/asset · logistics UI uses **mock** `shipment-data` | `runsheets`, `trips`, `new-runsheet` · **Production-ready** |
| **Runsheets** | N | ✓ | **E** | — | `/runsheets`, `/runsheet/[id]` · Supabase |
| **Shipments** | ✓ | ✓ | **D** | Logistics subroute **placeholder**; mock on overview | `/shipments`, `/new-shipment` · Supabase |
| **Customs / Brokerage** | ✓ | ✓ | **D** | `/dashboard/logistics/brokerage` · **mock** | PAI CI + brokerage-adjacent docs |
| **CARM / Carnet** | T | ✓ | **D** | Mock brokerage types `ata-carnet` | CI / brokerage metadata in PAI |
| **Returns** | T | ✓ | **D** | Nav → coming-soon | `/returns` from operations-hub |

### Comms & platform

| Workflow | W | E | Class | Web | Expo |
|----------|---|---|-------|-----|------|
| **Communications** | ✓ | ✓ | **D** | Chat/email/notifications · **mock data files** | `(tabs)/chat` + rooms · Supabase messages |
| **Notifications** | ✓ | ✓ | **D** | Mock `notifications-data.ts` | Operational signals / push patterns in app |
| **Search** | T | ✓ | **D** | Sidebar search dialog (nav only) | Phase 6 memory search foundation migrations |
| **Reporting** | N | ✓ | **E** | No reporting route | `asset-report`, wrap reports, pilot analytics |
| **Script Hub** | T | ✓ | **E** | Ingestion kinds only | `/script-hub` + import/breakdown/revision stack |

---

## Per-Workflow Detail (abbreviated)

### Production Calendar

| | Web | Expo |
|---|-----|------|
| **Route** | `/dashboard/production-calendar` | `(tabs)/calendar` |
| **Data** | Supabase `production_calendars`, `calendar_days`, `calendar_day_scenes`, obligations; WO/transport by date | `AppProvider.schedule`, `ShootDay[]`, `production_schedule_*` shadow |
| **Read** | Yes | Yes |
| **Write** | No | Yes (import, edit shoot days via AppProvider) |
| **Ready** | Partial (empty without seed) | Production-ready for dispatch calendar |
| **Missing** | Seed + link to shooting schedule; shoot_day FK | None for field ops; not web strip parity |
| **Truth** | Web Supabase (web migrations) | Expo Supabase + local schedule snapshot |

### Sets / Set Photos

| | Web | Expo |
|---|-----|------|
| **Route** | `/dashboard/sets`, `/dashboard/sets/[setId]` | `/set-files`, `/set-file/[id]` |
| **Data** | `production_sets`, `assets`, `scenes`, `documents`, hero `set-photos` | AsyncStorage `syncoffset:set_files:{showId}` |
| **Read/Write** | Read + hero write + manual doc link | CRUD set files locally |
| **Ready** | Set workspace partial–ready | Set files production-local only |
| **Truth** | **Disconnected** — same word, different stores |

### Document Chain (Web) vs Production Document Ingest (Expo)

| | Web | Expo |
|---|-----|------|
| **Route** | `/ingestion`, `/ingestion/upload`, `/ingestion/[id]` | `/production-document-ingest` |
| **Data** | `source_documents`, `documents`, `document_revisions`, storage buckets | `production_documents`, PAI edges, CI redistribution |
| **Write** | Upload + approve/reject + chain | Ingest + metabolism orchestration |
| **Truth** | Web pipeline | Expo pipeline — **no shared queue** |

### Transport

| | Web | Expo |
|---|-----|------|
| **Route** | `/dashboard/logistics` (mock), subroutes placeholder | `trips`, `runsheets`, `new-runsheet`, `operational-transport` |
| **Data** | `transport_orders` (set/asset panels) vs `shipment-data.ts` (overview **mock**) | `trips`, `trip_stops`, `runsheets` |
| **Truth** | Split: DB for workspace, mock for logistics UI | Expo Supabase operational truth |

---

## Supabase Migration Inventory

| Repo | Count | Production-relevant examples |
|------|-------|------------------------------|
| **Web** | 8 | `storage_buckets`, `constitutional_documents`, `production_sets` / `assets` / `scenes`, `work_orders`, `transport_orders`, `hero_image_url`, `calendar_days` |
| **Expo** | 85+ | `runsheets`, `trips`, `production_schedule_*`, `production_documents`, `vendors`, `pai_*`, `chat_*`, `live_budget` pressure, operational memory |

**No evidence** that Web migrations are applied to the same project Expo uses without a merge plan.

---

## Duplication Audit (same problem, two implementations)

| Problem | Web | Expo | Risk |
|---------|-----|------|------|
| **Master calendar** | Strip grid + `calendar_days` | Board/month + `ShootDay` + schedule import | Producers see different calendars |
| **Documents / ingestion** | Constitutional chain + review queue | Production ingest + PAI | Duplicate custody models |
| **Transport** | `transport_orders` rows + mock logistics HQ | Runsheets/trips | Dispatch not on web DB UI |
| **Sets** | `production_sets` workspace | AsyncStorage set files | Art dept vs coordinator split |
| **Commercial invoices** | Mock brokerage | PAI redistribution engine | Real CI only on mobile |
| **Budget / spend** | Template finance dashboard | Live budget pressure | Finance truth on Expo only |
| **Work orders** | `work_orders` table (read) | Runsheet `work_order` text field | Not the same object |

---

## Orphan Audit

### Web — routes exist, **not** in sidebar

| Route | State |
|-------|--------|
| `/dashboard/default`, `/crm`, `/finance`, `/ecommerce`, `/analytics`, `/productivity`, `/users`, `/academy` | Studio Admin **mock** demos |
| `/dashboard/mail`, `/mail` | Mail demo |
| `/dashboard/(legacy)/*` | Legacy mock dashboards |
| `/dashboard/documents/[documentId]` | Functional; deep link only |
| `/dashboard/assets/[assetId]` | Functional; deep link from set board |
| `/dashboard/sets/workspace` | Redirect to sets list |

### Expo — stack screens with **limited** discoverability

Reachable via **Operations hub**, **Desktop nav rail**, or **Dispatch home** (not all in tabs):

| Screen | Notes |
|--------|--------|
| `chrono`, `dailies-zoom-auditions`, `production-docs-logs` | Hub / intel; easy to miss |
| `one-liner-import`, `spatial-continuity`, `continuity-pickups` | Specialist |
| `pilot-feedback`, `pilot-readiness` | Pilot program |
| `asset-inventory` vs `assets` (receipt assets) | Naming collision |
| `operational-pdf/[documentId]` | Deep link |

Tabs only: **Dispatch, Trips, Map, Calendar, Receipts, Chat** — most production desk lives **outside** tabs in hub.

---

## Mock Data Audit

### Web (runtime mock / placeholder)

| Area | Evidence |
|------|----------|
| Logistics overview | `shipment-data.ts`, `operational-data.ts` |
| Logistics subroutes (TO, shipments, rush, holdbacks) | `ModulePlaceholder` |
| Brokerage | `brokerage-data.ts` |
| Communications | `chat-data.ts`, `email-data.ts`, `notifications-data.ts` |
| CRM / Default / Ecommerce / Analytics / Productivity / Users / Academy | Template demo data |
| Mail | `mail/_components/data.tsx` |
| Finance (`/dashboard/finance`) | Personal finance widgets (not production) |

### Expo

| Area | Evidence |
|------|----------|
| `AppProvider` | `SEED_VENDORS`, seed drivers when `demoMode` or Supabase empty |
| `(tabs)/index` | `homeDriversSource: "seed" \| "supabase" \| "empty"` |
| Auth | `demoMode` flag in diagnostics |

---

## Truth Audit (source of truth by domain)

| Domain | Source of truth today |
|--------|------------------------|
| Dispatch / trips / runsheets | **Expo** Supabase (`trips`, `runsheets`) |
| Strip calendar (field) | **Expo** schedule + shoot days |
| Strip calendar (web wall) | **Web** `calendar_days` (if seeded) — **not synced to Expo** |
| Set workspace (art) | **Web** `production_sets` |
| Set files (coordinator local) | **Expo** AsyncStorage |
| Document review chain | **Web** `source_documents` / `documents` |
| Operational doc ingest / CI | **Expo** `production_documents` + PAI |
| Work orders (constitutional) | **Web** table only (read UI) |
| Work orders (field text) | **Expo** runsheet fields |
| Transport (workspace panels) | **Web** `transport_orders` |
| Transport (live ops) | **Expo** runsheets/trips |
| Budget pressure | **Expo** live budget services |
| Budget UI on web | **Mock** / coming-soon |
| Constitutional rules | **Types only** on Web (`src/types/core`) |
| Brokerage UI on web | **Mock** |
| Vendors | **Expo** `vendors` table |
| Hero set photos | **Web** `set-photos` storage |

---

## Top 10 — Closest to usable (production workflow)

1. **Expo dispatch + trips + runsheets** — Supabase-backed, tab-visible, write paths exist.  
2. **Expo production calendar tab** — Strip/board, schedule import, shoot days.  
3. **Web set list + set detail** — Real Supabase, photos, documents, WO/transport read.  
4. **Web ingestion upload + review queue** — End-to-end write on document chain.  
5. **Expo live budget** — Department pressure, not template finance.  
6. **Expo script hub + revision stack** — Production planning entry.  
7. **Expo production document ingest + PAI CI** — Real redistribution engine.  
8. **Expo chat / crew / vendors** — Operational desk completeness.  
9. **Web production strip calendar** — UI correct; needs seed + sync strategy.  
10. **Web document detail + manual set link** — Closes upload → set visibility gap.

---

## Top 10 — Looks built but disconnected

1. **Production calendar** — Web `calendar_days` vs Expo `production_schedule_*`.  
2. **Transport orders** — Web DB vs Expo runsheets; web logistics UI still mock.  
3. **Documents** — Web chain vs Expo ingest/PAI.  
4. **Sets** — Web `production_sets` vs Expo AsyncStorage set-files.  
5. **Work orders** — Web table vs runsheet WO string.  
6. **Commercial invoices** — Web mock brokerage vs Expo PAI.  
7. **Assets** — Web `assets` row vs Expo inventory/evidence.  
8. **Budget** — Web coming-soon + template finance vs Expo live-budget.  
9. **Shipments** — Expo real vs web placeholder subroute.  
10. **Scenes** — Web per-set table vs Expo script/breakdown graph.

---

## Top 5 — Finish before TestFlight

1. **Pick one calendar truth** — Either seed web from Expo schedule export or label web as “planning mirror” with import job; producers cannot see two calendars.  
2. **Expo dispatch path hardening** — Trips/runsheets/stops (already closest); ensure `demoMode`/seed off in pilot builds.  
3. **Web set workspace + ingestion** — One production seed script; prove upload → link → set panel for testers.  
4. **Document custody story** — Document whether TestFlight uses Expo ingest only, web review only, or a single bridge table — avoid two queues.  
5. **Retire or hide web mock surfaces** — Logistics mock + hidden CRM/finance demos confuse audits and testers.

---

## Technical Debt (product-relevant)

| Item | Evidence |
|------|----------|
| Two Supabase schemas | 8 web vs 85+ mobile migrations |
| `package.json` name `studio-admin` on web | Template lineage |
| `docs/SYNCOFFSET_RUNTIME_AUDIT.md` outdated | Claims no Supabase; web now has Supabase |
| Web logistics not wired to `transport_orders` | Mock vs DB split |
| No web asset list route | Set board deep-links only |
| Buy / build / pull lists | Types only; not in either app |
| Constitutional types unwired to Expo | Separate `expo/types` |

---

## Recommendation

**Stop asking “build X.” Ask “which repo already owns X?”**

| If the workflow is… | Start here |
|---------------------|------------|
| Field dispatch, runsheets, calendar import | **Expo** |
| Set art board, document chain, set hero | **Web** |
| Commercial invoice redistribution | **Expo** (PAI) |
| Strip calendar for production office wall | **Web** UI + **Expo** schedule data feed (integration task) |
| Buy / build / pull lists | **Neither** — types only; net-new on one platform after ownership vote |

Next discovery prompt for Cursor:

> “List every Supabase table name in web migrations and in mobile migrations; show intersection and orphans.”

That produces the integration backlog without another feature sprint.

---

*Evidence paths: `syncoffset-web/src/app/**/page.tsx`, `src/navigation/sidebar/sidebar-items.ts`, `syncoffset-web/supabase/migrations/`, `syncoffset-mobile/expo/app/`, `syncoffset-mobile/supabase/migrations/`, `syncoffset-mobile/expo/providers/AppProvider.tsx`.*
