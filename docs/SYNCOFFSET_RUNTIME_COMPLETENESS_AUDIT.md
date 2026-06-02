# SyncOffset Runtime Completeness Audit

**Date:** 2026-06-02  
**Scope:** Visible production-nav workflows and primary Expo operational surfaces audited during recovery (2026-06-01 — 2026-06-02).  
**Method:** Aggregates [SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md](./SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md), [EXPO_RUNTIME_WIRING_AUDIT.md](./EXPO_RUNTIME_WIRING_AUDIT.md), [SYNCOFFSET_PRODUCT_MATRIX.md](./SYNCOFFSET_PRODUCT_MATRIX.md), [SCHEDULE_CANONICAL_CONSOLIDATION_SPRINT.md](./SCHEDULE_CANONICAL_CONSOLIDATION_SPRINT.md), [SET_FILES_CANONICAL_CONSOLIDATION_SPRINT.md](./SET_FILES_CANONICAL_CONSOLIDATION_SPRINT.md), [SYNCOFFSET_NO_MOCK_RULE.md](./SYNCOFFSET_NO_MOCK_RULE.md). **No new runtime probes in this document.**

---

## Executive summary

| Layer | Completeness |
|-------|----------------|
| **Expo operational core** (trips, runsheets, vendors, chat when `backendReady`) | **PRODUCTION READY** on schema that exists (`shows`, `trips`, `runsheets`, … per live probe) |
| **Visible web nav** (Sets, Production Calendar, Ingestion) | **INFRASTRUCTURE BLOCKED** — target tables absent on `yddwznlclkcfqqgmorye` at recovery audit |
| **Expo Set Files** (code) | **PARTIALLY IMPLEMENTED** — Supabase wired; schema + `set_file_scenes` per SDR |
| **Expo schedule strip** (code) | **PARTIALLY IMPLEMENTED** — canonical publish path in code; schedule tables absent on host |
| **Web mock nav** | **Removed from sidebar** — routes remain on disk, labeled MOCK in page headers |
| **Measure Item** | **PARTIALLY IMPLEMENTED** — AsyncStorage only; no SQL migration in repo |

---

## Visible workflow matrix (production navigation)

Evidence: recovery audit + product matrix. Live table probes: [SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md](./SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md) (`yddwznlclkcfqqgmorye`, 2026-06-02).

| Workflow | Route(s) | Runtime SOR (code) | Tables exist (live probe) | Classification |
|----------|----------|-------------------|---------------------------|----------------|
| **Sets (Web)** | `/dashboard/sets`, `/dashboard/sets/[setId]` | `production_sets`, `assets`, `scenes` | **NO** | **INFRASTRUCTURE BLOCKED** |
| **Production Calendar (Web)** | `/dashboard/production-calendar` | Published `production_schedule_revisions` + `production_schedule_days` | **NO** | **INFRASTRUCTURE BLOCKED** |
| **Ingestion (Web)** | `/ingestion`, `/ingestion/upload`, `/ingestion/[id]` | `source_documents`, `documents`, `document_revisions` | `source_documents` **NO**; legacy `documents` **YES** (42501) | **INFRASTRUCTURE BLOCKED** |
| **Set Files (Expo)** | `/set-files`, `/set-file/[id]` | `set_files` (+ scenes via service pre-SDR) | **NO** | **INFRASTRUCTURE BLOCKED** (code wired) |
| **Schedule (Expo tab + publish)** | `(tabs)/calendar`, import/history flows | Published `production_schedule_*` | **NO** | **INFRASTRUCTURE BLOCKED** (code per schedule sprint) |
| **Measure Item (Expo)** | `/measure-item` | AsyncStorage `syncoffset:measurements:{showId}` | N/A | **PARTIALLY IMPLEMENTED** |

---

## Expo operational (not all in web nav — completeness reference)

From [EXPO_RUNTIME_WIRING_AUDIT.md](./EXPO_RUNTIME_WIRING_AUDIT.md) and product matrix — when `backendReady` and tables present:

| Domain | Classification | Notes |
|--------|----------------|-------|
| Trips / stops | **PRODUCTION READY** | Supabase `trips`, `trip_stops` — live probe YES |
| Runsheets | **PRODUCTION READY** | `runsheets` — live probe YES |
| Vendors / drivers / locations | **PRODUCTION READY** | Probed vendors YES |
| Chat | **PRODUCTION READY** | Code path Supabase; not re-probed in recovery audit |
| Shipments + legacy `documents` | **Hybrid** | `shipments` YES; `documents` legacy shape on host |
| Script hub / budget | **PRODUCTION READY** (Expo) | Separate from web nav |
| Production documents PDF hub | **PRODUCTION READY** | `production_documents` — not same as constitutional `documents` |

---

## Schedule sprint vs runtime audit note

[SCHEDULE_CANONICAL_CONSOLIDATION_SPRINT.md](./SCHEDULE_CANONICAL_CONSOLIDATION_SPRINT.md) documents removal of AsyncStorage schedule-spine **authority** in code. [EXPO_RUNTIME_WIRING_AUDIT.md](./EXPO_RUNTIME_WIRING_AUDIT.md) Section Calendar describes **pre-sprint** AsyncStorage strip SOR — superseded for authority by schedule sprint; retained as historical wiring evidence.

---

## Mock / placeholder (web — post no-mock sprint)

Per [SYNCOFFSET_NO_MOCK_RULE.md](./SYNCOFFSET_NO_MOCK_RULE.md):

| Area | Nav visible | Runtime label |
|------|-------------|---------------|
| Logistics overview / brokerage / communications | **NO** | MOCK — `shipment-data.ts`, `brokerage-data.ts`, `chat-data.ts`, etc. |
| Studio Admin demos (`/dashboard/default`, `crm`, …) | **NO** | MOCK — not in production sidebar |

---

## Build / typecheck (recovery period evidence)

| Repo | Build | Typecheck |
|------|-------|-----------|
| `syncoffset-web` | **PASS** (`npm run build`) | **PASS** (`npx tsc --noEmit`) |
| `syncoffset-mobile/expo` | No single `build` in sprint reports | **PASS** after PAI `unknown` cast fix; schedule sprint noted pre-existing PAI errors before fix |

---

## Schema recovery gates (runtime completeness dependency)

From [SYNCOFFSET_SCHEMA_DECISION_RECORD.md](./SYNCOFFSET_SCHEMA_DECISION_RECORD.md) and [SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md](./SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md):

| Gate | Blocks visible web + set files + schedule |
|------|------------------------------------------|
| Phase 0: rename legacy `documents` | Ingestion constitutional `CREATE` |
| Phase 1: schedule migrations | Web calendar + Expo publish visibility |
| Phase 2: `production_sets` + `scenes` | Web Sets |
| Phase 3: `set_files` (partial) | Expo set file rows |
| `set_file_scenes` (future) | Expo set-file scene CRUD per SDR |

---

## Truthfulness labels (visible workflows only)

| Label | Workflows |
|-------|-----------|
| **PRODUCTION READY** | Expo trips, runsheets, vendors (on existing schema) |
| **PARTIALLY IMPLEMENTED** | Set Files (code), Measure Item (device), Schedule (code) |
| **INFRASTRUCTURE BLOCKED** | Web Sets, Web Calendar, Web Ingestion, Expo set_files on host without migration |
| **MOCK** | Hidden web logistics/communications/studio routes (not in nav) |
| **PLACEHOLDER** | Web `coming-soon` nav entries |

---

## DEPLOYABLE (recovery program)

**NO** for visible cross-client production nav until schema recovery Phases 0–2+ applied on target Supabase project and field validation completes.

**Evidence:** [SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md](./SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md) — `DEPLOYABLE: NO`.
