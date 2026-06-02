# Expo Runtime Wiring Audit

**Audit date:** 2026-06-02  
**Repo audited:** `syncoffset-mobile/expo` (Expo Router app)  
**Method:** Read every `expo/app/**/*.tsx` route; trace imports to `getSupabase().from(...)`, `AsyncStorage`, `AppProvider` / `useApp`, and `@/constants/seed`. No feature recommendations.

### Global gates (from code)

| Flag / state | Effect |
|--------------|--------|
| `isSupabaseConfigured` | Env vars present (`expo/services/supabase.ts`) |
| `backendReady` | `isSupabaseConfigured && activeShowId && !demoMode && (signed in with show membership OR dev bypass)` (`AppProvider.tsx` ~1150–1154) |
| `demoMode` | `AuthProvider` practice tenancy → `useSeedLists`, bundled `SEED_*` arrays, no Supabase list queries |
| `BYPASS_AUTH_FOR_DEV` | **`false`** in `expo/constants/devFlags.ts` (committed) |
| Schedule strip SOR | **`device_local_per_show`** via AsyncStorage; `scheduleSpinePersistence.backendSynced: false` (`AppProvider.tsx` ~4121–4127) |

When this doc says **Supabase YES**, it means the screen (or its service) issues `.from(...)` / storage calls when `backendReady` (and not `demoMode`), unless noted.

---

## Section audits

### Dispatch

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo Data | Seed Data | AppProvider only | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|-----------|-----------|------------------|-------------|----------------|-----|
| Dispatch (tab home) | `app/(tabs)/index.tsx` | YES† | YES† | YES (schedule spine) | IF `demoMode` | IF `demoMode` or `!isSupabaseConfigured` | YES (trips, drivers, runsheets, schedule, …) | `trips`, `trip_stops`, `runsheets`, `drivers`, `vendors`, `locations`, `shows`, `shipments`, `documents`, `receipts`, `receipt_items`, `chat_messages` (provider load) | Same via `AppProvider` mutations | **Hybrid** |

†Through `useApp()` → `AppProvider` React Query loaders when `backendReady`.

---

### Trips

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Trips list | `app/(tabs)/trips.tsx` | YES† | YES† | — | IF `demoMode` | IF `useSeedLists` | YES | `trips`, `trip_stops`, `drivers`, `runsheets`, `shipments` | `trips`, `trip_stops` | **Hybrid** |
| Trip detail | `app/trip/[id].tsx` | YES† | YES† | — | IF `demoMode` | IF `useSeedLists` | YES | + `damage_reports` (via context) | `trips`, `trip_stops` | **Hybrid** |
| Stop detail | `app/stop/[tripId]/[stopId].tsx` | YES† | YES† | — | IF `demoMode` | IF `useSeedLists` | YES | `trip_stops`, `trips` | `trip_stops` | **Hybrid** |

---

### Runsheets

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Runsheets list | `app/runsheets.tsx` | YES† | YES† | — | IF `demoMode` | IF `useSeedLists` | YES | `runsheets`, `drivers` | `runsheets` | **Supabase** (when live) |
| Runsheet detail | `app/runsheet/[id].tsx` | YES† | YES† | — | IF `demoMode` | IF `useSeedLists` | YES | `runsheets`, `shipments`, `documents` | `runsheets`, `shipments`, `documents`, storage `production-documents` | **Hybrid** |
| New runsheet | `app/new-runsheet.tsx` | YES† | YES† | — | IF `demoMode` | IF `useSeedLists` | YES | `vendors`, `locations`, `drivers`, `crew_contacts` | `runsheets` (+ trip link via provider) | **Supabase** (when live) |

---

### Map

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Fleet map | `app/(tabs)/map.tsx` | YES† | NO (screen) | — | IF `demoMode` | IF `useSeedLists` | YES (`trips`, `drivers`, `vendors`) | `trips`, `trip_stops`, `drivers`, `vendors` | — | **Hybrid** (read-only UI) |

No `getSupabase` in `map.tsx`; no `driverLocationSync` import found in this file.

---

### Calendar

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Prod calendar | `app/(tabs)/calendar.tsx` | YES† (trips/runsheets overlay) | YES† (schedule edits via provider) | YES (`scheduleSpine` key per show) | IF `demoMode` | IF `demoMode` (`SEED_SCHEDULE`) | YES | Overlay: `trips`, `runsheets`; strip: **local**; optional shadow: `production_schedule_revisions`, `production_schedule_days` | Strip: AsyncStorage; shadow mirror on import/edit (`mirrorScheduleShadowRevision`) | **Hybrid** (strip = **AsyncStorage**; transport overlay = **Supabase**) |

`scheduleSpinePersistence.backendSynced` is **`false` by design** in provider exports.

**Related (not tab):** `app/callsheet.tsx` — NO direct Supabase; reads `schedule` from context only → **Context + AsyncStorage**.  
**Related:** `app/schedule-history.tsx` — YES when `backendReady`: `production_schedule_revisions`, `production_schedule_days` (+ audit via `logAudit`). Restore applies to **device strip** via `restoreStripboardOnThisDevice`.  
**Related:** `app/one-liner-import.tsx`, `app/smart-import.tsx`, `app/manage.tsx` (Schedule tab) — strip **AsyncStorage**; optional **shadow write** to `production_schedule_*` when online.

---

### Receipts

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Receipts (tab) | `app/(tabs)/marketplace.tsx` | YES† | YES† | — | IF `demoMode` | `SEED_RECEIPTS` | YES | `receipts`, `receipt_items` | `receipts`, `receipt_items` | **Supabase** (when live) |
| New receipt | `app/new-receipt.tsx` | YES† | YES† | — | IF `demoMode` | IF `useSeedLists` | YES | — | `receipts`, `receipt_items` | **Supabase** (when live) |

---

### Chat

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Chat (tab) | `app/(tabs)/chat.tsx` | YES | YES | — | — | — | YES (`showId`, `backendReady`) | `chat_rooms`, `chat_room_members`, `chat_messages`, `conversations`, `messages`, `production_tasks`, `crew_contacts` | `chat_messages`, `production_tasks` (task tab) | **Supabase** |
| Chat room | `app/chat-room/[id].tsx` | YES | YES | — | — | — | YES | `chat_rooms`, `chat_messages`, `chat_room_members` | `chat_messages`, `chat_room_members` | **Supabase** |
| Chat room members | `app/chat-room-members.tsx` | YES | YES | — | — | — | YES | `chat_room_members`, `crew_contacts` | `chat_room_members` | **Supabase** |
| Legacy DM | `app/conversation/[id].tsx` | YES | YES | NO | — | — | NO | `messages`, `conversation_members` | `messages` | **Supabase** |
| New chat / room | `app/new-chat.tsx`, `app/new-chat-room.tsx` | YES | YES | — | — | — | YES | `chat_rooms`, `crew_contacts` | `chat_rooms`, `chat_room_members` | **Supabase** |

`AppProvider` still loads legacy `chat_messages` (~1676) but **no `expo/app` screen** calls `addChat` (grep).

---

### Script Hub

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Script Hub (launcher) | `app/script-hub.tsx` | NO | NO | NO | NO | NO | YES (`showId` only) | — | — | **Context** (navigation only) |
| Script import | `app/script-import.tsx` | YES | YES | NO | — | — | YES | `production_scripts`, `production_script_scenes`, `production_breakdown_items` | Same | **Supabase** |
| Script breakdown | `app/script-breakdown.tsx` | YES | YES | NO | — | — | YES | + `production_budget_lines`, continuity services | `production_breakdown_items`, scenes, budget lines | **Supabase** |
| Screenplay revision import | `app/script-revision-import.tsx` | YES | YES | NO | — | — | YES | `production_scripts`, … | `production_scripts`, scenes, items | **Supabase** |
| Revision review / compare / impact | `app/script-revision-review.tsx`, `script-revision-compare.tsx`, `script-revision-impact.tsx` | YES | YES | Partial‡ | — | — | YES | Script + revision tables via `scriptBudget` / continuity | Same | **Supabase** / **Hybrid**‡ |
| Revision transfers pending | `app/revision-transfers-pending.tsx` | YES | YES | NO | — | — | YES | Transfer tables via `scriptRevisionTransfer` | Same | **Supabase** |
| One-liner import | `app/one-liner-import.tsx` | YES (shadow/history) | YES (shadow) | YES (strip) | — | — | YES | `production_schedule_revisions`, `production_schedule_days` | Shadow rows + local strip | **Hybrid** |
| Smart import | `app/smart-import.tsx` | YES (optional shadow) | YES (optional shadow) | YES (strip) | — | — | YES | Same schedule tables | Same | **Hybrid** |
| Schedule history | `app/schedule-history.tsx` | YES | YES | YES (restore to strip) | — | — | YES | `production_schedule_revisions`, `production_schedule_days` | Revisions/days + audit events | **Hybrid** |

‡ `script-revision-impact.tsx` references AsyncStorage in repo grep (bookmarks / continuity prefs), not primary script rows.

---

### Set Files

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Set files list | `app/set-files.tsx` | **NO** | **NO** | **YES** | NO | NO | YES (`show` id for key) | — | — | **AsyncStorage** (`syncoffset:set_files:{showId}` via `services/setFiles.ts`) |
| Set file detail | `app/set-file/[id].tsx` | **NO** | **NO** | **YES** | NO | NO | YES (receipts/shipments for counts) | — | — | **AsyncStorage** |

**Evidence:** screens import `@/services/setFiles`, not `@/services/setFilesService`.  
`setFilesService.ts` can read/write `set_files` when `useSupabase()` but **is not called by these routes** (architecture comment at file top confirms screens still use older module).

---

### Budget

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Production budget | `app/budget.tsx` | YES | YES | NO | — | — | YES | `production_budget_categories`, `production_budget_lines`, `production_scripts`, `production_breakdown_items` | Same | **Supabase** |
| Live budget | `app/live-budget.tsx` | YES | NO (screen) | NO | — | — | YES | `production_budget_lines`, `production_petty_cash_entries`, `production_check_requests`, correlation/intelligence tables via services | — (read snapshot) | **Supabase** |

---

### Crew

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Crew | `app/crew.tsx` | YES | YES | NO | — | — | NO (Auth only) | `crew_contacts`, `drivers` | `crew_contacts`, `drivers` | **Supabase** |

Also editable under `app/manage.tsx` (Crew tab) via same `crewContacts` service.

---

### Callsheets

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Call sheet | `app/callsheet.tsx` | **NO** | **NO** | YES (schedule spine) | IF `demoMode` | IF `demoMode` | YES (`schedule`, `show`) | — | — | **Context + AsyncStorage** |

---

### Security

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Security | `app/security.tsx` | **NO** | **NO** | YES (via `SecurityProvider` wipe/prefs) | NO | NO | YES (`useSecurity`, `useTheme`) | — | — | **AsyncStorage** / device |

---

### Returns

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Returns | `app/returns.tsx` | YES† | NO (screen) | — | IF `demoMode` | IF `useSeedLists` | YES | `runsheets` (derived rental/return fields) | — | **Hybrid** (read-only dashboard) |

---

### Shipments

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Shipments | `app/shipments.tsx` | YES† | YES† | — | IF `demoMode` | IF `useSeedLists` | YES | `shipments`, `documents` | `shipments`, `documents` | **Supabase** |
| New shipment | `app/new-shipment.tsx` | YES† | YES† | — | IF `demoMode` | IF `useSeedLists` | YES | — | `shipments` | **Supabase** |

---

### Commercial Invoices

**No dedicated Expo route** (`expo/app` has no `commercial-invoice*.tsx`).

| Surface | Route / module | Supabase Read | Supabase Write | AsyncStorage | Demo | Notes | SOR |
|---------|----------------|---------------|----------------|--------------|------|-------|-----|
| Runsheet shipment docs UI | `app/runsheet/[id].tsx` (CI section) | YES† | YES† | — | IF `demoMode` | Attaches/views `documents` rows (`kind: ci`); storage bucket `production-documents` | **Hybrid** |
| PAI ingest + redistribute | `services/pai/*` (`ingestCommercialInvoice`, `callRedistributeCi`) | YES (edge) | YES (edge) | NO | Demo module `commercialInvoiceIntake.demo.ts` only | **`ingestCommercialInvoice` / `callRedistributeCi` are not imported by any `expo/app/*.tsx`** (repo grep) | **Not wired to UI** |

Tables when edge path runs: `pai_assets`, `pai_asset_classifications`, `pai_asset_extractions`, `pai_redistribution_events`, `pai_asset_relationships`, `documents`, `show_members`, `runsheets`, `shipments`, `production_shipments`.

---

### Measure Item

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Measure item | `app/measure-item.tsx` | Partial§ | Partial§ | **YES** | NO | NO | YES | `assetCaptureService` may queue SB evidence when configured | `syncoffset:measurements:{showId}`; drafts via `measureSessionDraft` | **AsyncStorage** (primary captures) |

§ `assetCaptureService` / photo proof may touch Supabase storage when flushed; **core measurement list** is `services/measurements.ts` → AsyncStorage only.

---

### Asset Report

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Inventory report | `app/asset-report.tsx` | YES† | NO | — | IF `demoMode` | IF `useSeedLists` | YES | `runsheets` (+ driver labels) | — | **Hybrid** (derived in-memory from runsheets) |

**Related (hub links):** `app/assets.tsx` — receipt line items via `assetItems` (from `receipts` / `receipt_items`), not `production_assets`.  
`app/asset-inventory.tsx` — **YES** direct: `production_assets`, `production_continuity_events`, `production_script_scenes`, `production_asset_captures`.

---

### Vendor Directory

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Manage → Vendors | `app/manage.tsx` (`tab=vendors`) | YES† | YES† | NO | IF `demoMode` | `SEED_VENDORS` + optional `supabase.ts` vendor probe | YES | `vendors` | `vendors` | **Supabase** (when live) |

Vendor intelligence / history services also read `production_vendor_intelligence`, `production_operational_notes`, etc., when invoked from manage flows.

---

### Production Docs

| Screen | Route | Supabase Read | Supabase Write | AsyncStorage | Demo | Seed | Context | Tables read | Tables written | SOR |
|--------|-------|---------------|----------------|--------------|------|------|---------|-------------|----------------|-----|
| Production logs hub | `app/production-docs-logs.tsx` | **NO** | **NO** | NO | NO | NO | YES (`showId` gate) | — | — | **Context** (router cards only) |
| Document ingest | `app/production-document-ingest.tsx` | YES | YES | Partial‖ | — | — | YES | `production_documents`, pages, annotations; ingest orchestration | `production_documents`, storage bucket | **Supabase** |

‖ `productionDocumentIngestStore` / outbox may use AsyncStorage for pending mutations (operational pattern).

---

## Appendix: All Expo routes (86 files)

Grouped by wiring class when **signed in, Supabase configured, `backendReady`**.

| Class | Routes |
|-------|--------|
| **Supabase-primary** | `budget`, `live-budget`, `crew`, `production-document-ingest`, `asset-inventory`, `chat` tab + `chat-room/*`, `conversation/[id]`, `new-chat*`, `script-import`, `script-breakdown`, `script-revision-*`, `revision-transfers-pending`, `schedule-history`, `tasks` (via `tasks.ts`), `timesheets`, `dtr`, `create-show`, `join-show`, `select-show`, `invite-crew`, auth screens |
| **Hybrid (AppProvider + SB lists; local schedule/set files)** | `(tabs)/index`, `(tabs)/trips`, `trip/*`, `stop/*`, `runsheets`, `runsheet/[id]`, `new-runsheet`, `(tabs)/map`, `(tabs)/calendar`, `(tabs)/marketplace`, `new-receipt`, `shipments`, `new-shipment`, `returns`, `asset-report`, `manage`, `one-liner-import`, `smart-import`, `operational-*`, `wrap-*`, many desk/intelligence screens |
| **AsyncStorage / device SOR** | `set-files`, `set-file/[id]`, `measure-item` (captures), `security`, `callsheet` (schedule view) |
| **Navigation / gating only** | `script-hub`, `production-docs-logs`, `operations-hub`, `access-restricted`, `awaiting-approval`, `+not-found`, marketing/pilot explainers |
| **Practice / seed tenancy** | Entire app when `demoMode` → `constants/seed.ts` (`SEED_TRIPS`, `SEED_RUNSHEETS`, …) |

Full path prefix: `syncoffset-mobile/expo/app/`.

---

## Summary

### 1. Fully wired screens (Supabase read + write on primary data when `backendReady`)

- Trips stack (`trips`, `trip/[id]`, `stop/...`) via `AppProvider`
- Runsheets stack (`runsheets`, `runsheet/[id]`, `new-runsheet`)
- Receipts (`marketplace`, `new-receipt`)
- Shipments (`shipments`, `new-shipment`)
- Crew (`crew`, manage crew tab)
- Budget (`budget`); live budget read path
- Chat rooms stack + legacy `conversation/[id]`
- Script import / breakdown / revision flows (when desk gates pass)
- Production document ingest
- Asset inventory desk
- Vendor manager (`manage?tab=vendors`)
- Schedule history / governance (revisions table — strip restore still local)

### 2. Partially wired screens

- **Dispatch** — transport lists from Supabase; schedule strip local
- **Calendar** — overlay from Supabase; strip from AsyncStorage; optional `production_schedule_*` shadow
- **Map** — reads fleet data from context; no map-specific writes
- **Returns** — read-only view over `runsheets`
- **Asset report** — derived from runsheets, not `production_assets`
- **Runsheet CI panel** — `documents` metadata only; PAI redistribution not invoked from UI
- **Measure item** — local measurements; optional evidence flush to Supabase
- **One-liner / smart import / manage schedule** — local strip first, optional shadow revision rows

### 3. Fake wired screens (Supabase code exists, UI does not use it)

- **Set files** — `setFilesService.ts` → `set_files` table; screens use `setFiles.ts` → AsyncStorage only
- **Commercial invoice PAI** — `ingestCommercialInvoice` / `callRedistributeCi` in `services/pai/`; **zero** `expo/app` imports

### 4. AsyncStorage screens

- `set-files`, `set-file/[id]`
- `measure-item` (measurement index + session draft prefs)
- `callsheet` (reads schedule spine)
- `(tabs)/calendar` + schedule authoring paths (persist spine per show)
- `security` (device/profile prefs)
- Various operational outbox / PDF cache / pilot preset stores (not primary section UIs)

### 5. Demo-only screens

- **Any tab/screen** when `demoMode` is on: coordinator lanes use `practice_seed` / `SEED_*` bundles (`AppProvider` `coordinatorListsSource === "practice_seed"`).
- `DemoDatasetCard` + `demoDatasetService` (dev practice flows).

### 6. Screens that would lose data on reinstall

| Data | Storage key / table | Screens affected |
|------|-------------------|------------------|
| Set file index | `syncoffset:set_files:{showId}` | `set-files`, `set-file/[id]` |
| Measurements | `syncoffset:measurements:{showId}` | `measure-item` |
| Production stripboard (authoritative on device) | `scheduleSpineStorageKey(showId)` | `calendar`, `callsheet`, `smart-import`, `one-liner-import`, `manage` schedule |
| Measure session draft / UX prefs | `measureSessionDraft`, `measureUxPreferences` | `measure-item` |
| Pilot role preset | `pilotRolePresetStorage` | `operations-hub` |
| Security/local operational prefs | `SecurityProvider` / various `*Store.ts` | `security`, ingest outbox caches |

**Not lost on reinstall** when user had live session: `trips`, `runsheets`, `receipts`, `shipments`, `vendors`, `crew_contacts`, `production_scripts`, `production_documents`, chat, budget lines (all Supabase-backed when migrated).

---

## Top 10 user-touchable screens NOT connected to Supabase

Ordered by how clearly they avoid Supabase regardless of `backendReady` (verified by imports / loaders):

1. **`/set-files`** — `services/setFiles.ts` → AsyncStorage only  
2. **`/set-file/[id]`** — same  
3. **`/measure-item`** — `services/measurements.ts` → AsyncStorage only (primary list)  
4. **`/script-hub`** — navigation launcher; no queries  
5. **`/security`** — `SecurityProvider` / theme; no `.from()`  
6. **`/production-docs-logs`** — static hub routes; no data fetch  
7. **`/callsheet`** — reads `schedule` from context (device spine), no Supabase  
8. **`/assets`** — `assetItems` built from receipt line items in memory, not `production_assets`  
9. **PAI commercial invoice flow** — services only; **no app route** calls `ingestCommercialInvoice` or `callRedistributeCi`  
10. **`/(tabs)/calendar` strip authoring** — persisted to AsyncStorage; `scheduleSpinePersistence.backendSynced === false` (Supabase is overlay + optional shadow, not strip SOR)

**Honorable mention (misleading wiring):** set files look production-ready in `setFilesService.ts` but UI never calls it — treat as **fake wired** until screens switch imports.

---

## Evidence index

| Claim | File |
|-------|------|
| `backendReady` / `useSeedLists` | `expo/providers/AppProvider.tsx` |
| Schedule device-local | `expo/providers/AppProvider.tsx` (`scheduleSpinePersistence`, `persistScheduleSpineSnapshot`) |
| Set files AsyncStorage | `expo/services/setFiles.ts`, `expo/app/set-files.tsx` |
| Set files Supabase service unused by UI | `expo/services/setFilesService.ts`, `expo/app/set-files.tsx` imports |
| Measurements AsyncStorage | `expo/services/measurements.ts` |
| PAI not in app routes | `grep ingestCommercialInvoice / callRedistributeCi` under `expo/app` → empty |
| Tab labels | `expo/app/(tabs)/_layout.tsx` |
| Chat tables | `expo/app/(tabs)/chat.tsx`, `expo/services/chatRooms.ts` |
