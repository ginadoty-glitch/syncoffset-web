# Set Files Canonical Consolidation Sprint

**Date:** 2026-06-02  
**Scope:** Remove AsyncStorage authority for Expo Set Files; wire `/set-files` and `/set-file/[id]` to Supabase via `setFilesService.ts`.  
**Authority (post-sprint):** [SYNCOFFSET_SCHEMA_DECISION_RECORD.md](./SYNCOFFSET_SCHEMA_DECISION_RECORD.md) — `public.scenes` is constitutional (web); Expo set-file scene lines require future `set_file_scenes`.

---

## Pre-implementation audit (evidence sources)

| Source | Finding |
|--------|---------|
| [EXPO_RUNTIME_WIRING_AUDIT.md](./EXPO_RUNTIME_WIRING_AUDIT.md) (2026-06-02, pre-sprint) | Routes used `@/services/setFiles` → AsyncStorage `syncoffset:set_files:{showId}`; `setFilesService.ts` unused |
| [EXPO_DATA_LOSS_ELIMINATION_PLAN.md](./EXPO_DATA_LOSS_ELIMINATION_PLAN.md) | Ranked Set Files P1; SQL `20260425180000_set_files.sql` exists; app migration required |
| [SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md](./SYNCOFFSET_PRODUCTION_RECOVERY_AUDIT.md) | Live probe: `set_files` / `scenes` **not** on `yddwznlclkcfqqgmorye` |

### EXISTING IMPLEMENTATION (before sprint)

| Layer | Evidence |
|-------|----------|
| **Routes** | `expo/app/set-files.tsx`, `expo/app/set-file/[id].tsx` |
| **Persistence** | `expo/services/setFiles.ts` — AsyncStorage only |
| **Unused service** | `expo/services/setFilesService.ts` — Supabase path with AsyncStorage fallbacks |
| **Bug** | Screens used `show` (display name) for storage key instead of `showId` |

### CURRENT OWNER (before)

- **Device:** AsyncStorage `syncoffset:set_files:{showId}`

### SYSTEM OF RECORD (target)

- `public.set_files` + scene rows (intended: `scenes.set_file_id` per migration `20260425180000_set_files.sql`)

### DUPLICATION RISK (confirmed)

- Web `production_sets` / constitutional `scenes` — **separate** product model ([SYNCOFFSET_CANONICAL_MODEL.md](./SYNCOFFSET_CANONICAL_MODEL.md))
- Same table name `scenes` — **resolved** by [SYNCOFFSET_SCHEMA_DECISION_RECORD.md](./SYNCOFFSET_SCHEMA_DECISION_RECORD.md): canonical `scenes` → `production_sets`; Expo scenes → future `set_file_scenes`

---

## CHANGES MADE

### Expo

| File | Change |
|------|--------|
| `expo/services/setFilesService.ts` | Supabase-only authority; batch scene load; `getSetFileById`, `updateScene`, `deleteScene`; one-time legacy uplift |
| `expo/services/setFiles.ts` | Deprecated to uplift-only (`loadLegacySetFilesFromAsyncStorage`) |
| `expo/app/set-files.tsx` | Imports `setFilesService`; uses `showId` from `useApp()` |
| `expo/app/set-file/[id].tsx` | Per-scene Supabase CRUD via `setFilesService` |

### Web

**Untouched** (out of scope) — `/dashboard/sets` uses `production_sets`.

---

## LEGACY SYSTEMS REMOVED (as authority)

| Legacy | Status |
|--------|--------|
| `setFiles.ts` read/write as SOR | **Removed** from UI paths |
| `setFilesService` AsyncStorage fallbacks on error | **Removed** |
| `DEV_SHOW.id` misuse in fallback paths | **Removed** |

**Remaining (non-authoritative):**

- `loadLegacySetFilesFromAsyncStorage` + uplift flag `@syncoffset/set-files-uplifted:v1:{showId}` — one-time import only
- `linkedMeasuredItemIds` — client-only on `SetFile` (not in `set_files` table per migration)

---

## Operator actions

1. Apply `20260425180000_set_files.sql` on hosted Supabase (or `set_files` portion only if web `scenes` already exists — per schema recovery plan).
2. Authenticated user with `is_dispatch(production_id)` for writes (RLS).
3. Field E2E blocked until schema present on target project.

---

## Validation

| Check | Result |
|-------|--------|
| Expo `npm run typecheck` | **PASS** (after PAI cast fixes unrelated to set files) |
| Web `npm run build` | **PASS** (no web set-files routes changed) |
| Live `set_files` table (`yddwznlclkcfqqgmorye`) | **NO** (PGRST205 at audit time) |
| Device E2E (list/create/edit/delete/scene/reinstall) | **Not verified** in sprint session |
| Scene CRUD vs SDR | **Blocked** until `set_file_scenes` table — shared `public.scenes` reserved for web |

---

## REPORT (required format)

```text
BUILD STATUS:        PASS (expo typecheck; web build unchanged)
TYPECHECK STATUS:    PASS (expo, post-PAI fix)
RUNTIME STATUS:      INFRASTRUCTURE BLOCKED (hosted schema); PARTIALLY IMPLEMENTED (code)
SOURCE OF TRUTH:     Supabase (set_files) — intended; blocked until migration applied
DEPLOYABLE:          NO — set_files table missing on live project; scenes naming per SDR
```

**Cross-reference:** [SYNCOFFSET_SCHEMA_COLLISION_RESOLUTION.md](./SYNCOFFSET_SCHEMA_COLLISION_RESOLUTION.md), [SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md](./SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md).
