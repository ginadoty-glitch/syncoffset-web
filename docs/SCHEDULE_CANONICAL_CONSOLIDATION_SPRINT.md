# Schedule Canonical Consolidation Sprint

**Date:** 2026-06-02  
**Scope:** Remove AsyncStorage schedule-spine authority; align Expo + Web on `production_schedule_revisions` / `production_schedule_days`.

---

## Pre-implementation audit

### EXISTING IMPLEMENTATION

| Layer | Evidence |
|-------|----------|
| **Expo calendar** | `expo/app/(tabs)/calendar.tsx` → `useApp().schedule` |
| **Expo persistence (before)** | `AppProvider.tsx` — `@syncoffset/schedule-spine/v1/{showId}` AsyncStorage |
| **Expo shadow archive** | `scheduleShadowMirror.ts` → `local_shadow` revisions only |
| **Expo publish** | `scheduleRevisionGovernance.ts` — `publishScheduleRevision` RPC |
| **Web calendar (before)** | `load-production-calendar-month.ts` → `production_calendars`, `calendar_days` |
| **Constitutional types** | `ShootDay`, `ProductionSchedule` in `expo/types`; web `calendar-day` types separate |

### CURRENT OWNER (before sprint)

- **Device:** AsyncStorage spine (authoritative for active strip)
- **Supabase:** `production_schedule_*` audit / publish workflow (secondary)

### SYSTEM OF RECORD (target)

- `production_schedule_revisions` (`revision_scope = 'published'`)
- `production_schedule_days`
- `ShootDay` (in-app shape; serialized via `SYNCO_SHADOW_JSON` in day `notes`, blocks in revision `notes`)

### DUPLICATION RISK (confirmed — not extended)

- Web `calendar_days` / `production_calendars` — **removed from web loader**; migration files remain in repo but are not read
- AsyncStorage spine — **no longer written**; one-time uplift on load then key removed
- `local_shadow` revisions — still created as intermediate step before `publish` RPC (not a second SOR)

**No second schedule authority added.**

---

## CHANGES MADE

### Expo

| File | Change |
|------|--------|
| `expo/services/scheduleCanonicalPersistence.ts` | **New** — load/publish canonical schedule; legacy uplift |
| `expo/providers/AppProvider.tsx` | Load from published revision; persist via mirror+publish on edits/import/restore; remove AsyncStorage write |
| `expo/services/recoveryExportService.ts` | Export from canonical load |
| `expo/services/outboxPendingCounts.ts` | Schedule bucket notes legacy bytes only |
| `expo/app/manage.tsx` | Empty-state copy |

### Web

| File | Change |
|------|--------|
| `src/lib/production-calendar/load-production-calendar-month.ts` | Read published `production_schedule_*` |
| `src/lib/production-calendar/map-published-schedule-days.ts` | **New** — row mapping |
| `src/components/production-calendar/production-calendar-empty.tsx` | Migration hint text |
| `supabase/migrations/20260520100000_production_schedule_shadow.sql` | **Copied** from mobile |
| `supabase/migrations/20260521100000_schedule_revision_publish_phase2.sql` | **Copied** from mobile |

---

## LEGACY SYSTEMS REMOVED (as authority)

| Legacy | Status |
|--------|--------|
| `persistScheduleSpineSnapshot` | **Removed** from `AppProvider` |
| AsyncStorage schedule spine write path | **Removed** |
| Web `calendar_days` read path | **Removed** from loader |
| `setFilesService` / sets / transport | **Untouched** |

**Remaining (non-authoritative):**

- Legacy key read once for uplift: `legacyScheduleSpineStorageKey` in `scheduleCanonicalPersistence.ts`
- `scheduleShadowMirror` still inserts `local_shadow` before publish (implementation detail, not SOR)
- `20260531000700_production_calendar.sql` in web repo — **deprecated for schedule SOR**, not deleted

---

## Operator actions

1. Apply migrations (if not already): `20260520100000_production_schedule_shadow.sql`, `20260521100000_schedule_revision_publish_phase2.sql`
2. Open Expo with backend; legacy device spine auto-uplifts to published revision on first load
3. Web: set `NEXT_PUBLIC_DEFAULT_PRODUCTION_ID` to same `shows.id` as Expo

---

## Validation

| Check | syncoffset-web | syncoffset-mobile/expo |
|-------|----------------|------------------------|
| `npm run build` | PASS | Not run (no `build` script; `build-web` separate) |
| `npx tsc --noEmit` | PASS | FAIL — **pre-existing** `services/pai/*` errors (2), not schedule files |
