# Expo Data Loss Elimination Plan

**Scope:** Workflows whose **primary source of truth today is AsyncStorage** on Expo (`syncoffset-mobile/expo`).  
**Audit date:** 2026-06-02  
**Method:** Trace storage keys, services, screens, TypeScript shapes, and `supabase/migrations/*.sql` — no feature design.

> **Naming:** “Production Calendar” here means the **Expo stripboard** (`(tabs)/calendar` + schedule spine), not the web `/dashboard/production-calendar` (`calendar_days` tables).

---

## Workflow audits

### 1. Production Calendar (schedule strip)

| Field | Value |
|-------|--------|
| **Current storage** | AsyncStorage key `@syncoffset/schedule-spine/v1/{showId}` (`scheduleSpineStorageKey`) |
| **Current screens** | `app/(tabs)/calendar.tsx`, `app/callsheet.tsx`, `app/smart-import.tsx`, `app/one-liner-import.tsx`, `app/manage.tsx` (Schedule tab), `app/schedule-history.tsx` (restore → device strip) |
| **Current service** | `AppProvider.tsx` — `persistScheduleSpineSnapshot`, `parsePersistedScheduleSpine`; optional **shadow** writes via `scheduleShadowMirror.ts` → Supabase |
| **Current data shape** | `PersistedScheduleSpineV1`: `{ v: 1, shootDays: ShootDay[], blocks: ProductionBlock[], version, updatedAt, restoreMetadata? }` · in-memory `ProductionSchedule` |
| **Supabase table available?** | **Yes (partial)** — `production_schedule_revisions`, `production_schedule_days`, `production_schedule_lineage` (`20260520100000_production_schedule_shadow.sql`, `20260521100000_schedule_revision_publish_phase2.sql`). Migration comments: **AsyncStorage spine remains authoritative**; DB rows are mostly `local_shadow` audit drafts until publish flows run. **`ProductionBlock[]` has no first-class table.** |
| **Migration required?** | **Yes** — to make team-visible strip SOR: promote **published** revision + days as hydrate source; add or encode **blocks**; stop treating device blob as sole authority (`scheduleSpinePersistence.backendSynced: false` in `AppProvider`). |
| **Recommended canonical table** | `production_schedule_revisions` (scope `published` / `shared_draft`) + `production_schedule_days`; optional new `production_schedule_blocks` or JSON on revision for `blocks[]` |
| **Effort** | **High** — dual paths (local strip + shadow/publish), compare/restore UX, fingerprint governance, multi-device hydration |

**Shadow read/write today (not SOR):** `mirrorScheduleShadowRevision` inserts `production_schedule_revisions` + `production_schedule_days` when online after import/edit.

---

### 2. Set Files

| Field | Value |
|-------|--------|
| **Current storage** | AsyncStorage `syncoffset:set_files:{showId}` — JSON array of `SetFile` |
| **Current screens** | `app/set-files.tsx`, `app/set-file/[id].tsx` |
| **Current service** | **`setFiles.ts`** (AsyncStorage only) — screens do **not** call `setFilesService.ts` |
| **Current data shape** | `SetFile`: `{ id, setName, location, status, scenes: Scene[], notes?, linkedMeasuredItemIds[], sharing?, createdAt, updatedAt }` · `Scene`: `{ id, number, description, scriptLocation, dayNight, notes? }` |
| **Supabase table available?** | **Yes** — `set_files`, `scenes` (`20260425180000_set_files.sql`) |
| **Migration required?** | **No** (schema exists). **App migration required:** switch UI to `setFilesService` + one-time import from AsyncStorage blob. |
| **Recommended canonical table** | `set_files` + `scenes` (map `production_id` = `shows.id`; align naming with web `production_sets` per `SYNCOFFSET_CANONICAL_MODEL.md`) |
| **Effort** | **Medium** — service + SQL already built; replace imports, map rows, handle `linkedMeasuredItemIds` (not in DB yet) |

---

### 3. Measure Item (saved captures)

| Field | Value |
|-------|--------|
| **Current storage** | AsyncStorage `syncoffset:measurements:{showId}` — JSON array of `MeasuredItem` |
| **Current screens** | `app/measure-item.tsx` (primary); linked from dispatch / operations hub |
| **Current service** | `measurements.ts` (CRUD list); `measurementGeometry.ts` (migrate on load); optional flush via `assetCaptureService.ts` / `photoProofStorage` when configured |
| **Current data shape** | `MeasuredItem` (~40+ fields): photo URIs, `lines[]` (geometry), continuity metadata, calibration, department/category, notes slices, `sharing?`, timestamps (`expo/types/index.ts`) |
| **Supabase table available?** | **Yes (partial)** — `production_assets`, `production_asset_captures`, `production_asset_capture_photos` (`20260523000000_phase5_production_assets_foundation.sql`). Columns cover **scalar** dims + `measurement_source`; **not** full line-level geometry, continuity graph, or local `photoUri` paths. |
| **Migration required?** | **Yes** — for lossless sync: e.g. `measure_payload jsonb` on captures (or dedicated `production_measurements` table) + storage paths for photos; wire `measure-item` save path to Supabase. |
| **Recommended canonical table** | `production_assets` + `production_asset_captures` (+ `production_asset_capture_photos` / storage bucket); payload column for full `MeasuredItem` serialization |
| **Effort** | **High** — large type mapping, photo upload, offline queue, continuity hero rules |

---

### 4. Measure Drafts (in-flight session)

| Field | Value |
|-------|--------|
| **Current storage** | AsyncStorage `syncoffset:measureSession:v1:{showId}` |
| **Current screens** | `app/measure-item.tsx` (queue UI) |
| **Current service** | `measureSessionDraft.ts` — `saveMeasureSessionDraft` / `loadMeasureSessionDraft` / `clearMeasureSessionDraft` |
| **Current data shape** | `MeasureSessionDraftV1`: `{ v: 1, savedAtMs, photoUri, sessionQueue: PersistedQueuedPiece[] }` · max age **120 days** · per-piece line drafts + continuity fields |
| **Supabase table available?** | **No** |
| **Migration required?** | **Optional** — comment in service: *“survives app swaps & lock-screen without cloud plumbing.”* Eliminating **reinstall** loss is optional; cross-device draft sync needs new table. |
| **Recommended canonical table** | Defer, or `production_measure_session_drafts` (`show_id`, `user_sub`, `payload jsonb`, `expires_at`) if cloud recovery is required |
| **Effort** | **Low** (keep local) · **Medium** if cloud drafts are required |

---

### 5. Pilot Presets (desk layout)

| Field | Value |
|-------|--------|
| **Current storage** | AsyncStorage `syncoffset:pilot8b:role_preset_v1:{userSub}` — string preset id |
| **Current screens** | `app/operations-hub.tsx` (`loadPilotRolePreset` / `savePilotRolePreset`) |
| **Current service** | `pilotRolePresetStorage.ts` |
| **Current data shape** | `PilotRolePreset`: `production_office` \| `transport` \| `wrap` \| `rentals` \| `accounting` \| `archive` \| `admin_internal` (legacy ids normalized on read) |
| **Supabase table available?** | **No** |
| **Migration required?** | **Yes** — only if presets must follow the user across devices/reinstalls |
| **Recommended canonical table** | `user_show_preferences` or extend `show_members` with `pilot_role_preset text` |
| **Effort** | **Low** — single enum per user (or per user+show) |

---

## Combined ranking

Scores: **3 = highest**, **1 = lowest**. Total used for ordering.

| Workflow | Data-loss risk | Production importance | TestFlight impact | **Total** |
|----------|----------------|----------------------|-------------------|-----------|
| **Production Calendar (strip)** | 3 | 3 | 3 | **9** |
| **Set Files** | 2 | 3 | 2 | **7** |
| **Measure Item** | 2 | 2 | 2 | **6** |
| **Measure Drafts** | 1 | 1 | 1 | **3** |
| **Pilot Presets** | 1 | 1 | 1 | **3** |

### By criterion alone

1. **Risk of data loss:** Production Calendar → Set Files → Measure Item → Measure Drafts ≈ Pilot Presets  
2. **Production importance:** Production Calendar → Set Files → Measure Item → Measure Drafts ≈ Pilot Presets  
3. **TestFlight impact:** Production Calendar (tab) → Set Files (hub) → Measure Item (hub) → Measure Drafts / Pilot Presets (UX only)

---

## Priority order (elimination sequence)

| Priority | Workflow | Why |
|----------|----------|-----|
| **P0** | Production Calendar strip | Entire show schedule lives on device; reinstall/new phone wipes strip; coordinators use calendar tab daily |
| **P1** | Set Files | Parallel to web `production_sets`; SQL ready; UI still on dead-end storage |
| **P2** | Measure Item | Field evidence; partial Supabase asset stack; highest engineering cost |
| **P3** | Measure Drafts | Intentionally local; 120-day TTL; lower business criticality |
| **P4** | Pilot Presets | Preferences only; no production entities lost |

---

## Top 3 migrations before new features

These are the **minimum database + wiring** moves that stop the worst AsyncStorage-only production data loss. No new product surface required.

### 1. Production schedule — published strip as SOR

**What:** Treat `production_schedule_revisions` (`revision_scope = 'published'`) + `production_schedule_days` as the **authoritative** strip for a show; hydrate `AppProvider.schedule` from Supabase on load; write-through on edit/import; retain AsyncStorage as **cache/offline** only.

**Schema work:** Add storage for `ProductionBlock[]` (new `production_schedule_blocks` or `revisions.metadata jsonb`).

**Why first:** Highest loss risk + TestFlight calendar tab + canonical model already names these tables SOR (`docs/SYNCOFFSET_CANONICAL_MODEL.md`).

**Effort:** High · **Migration required:** Yes (blocks + publish hydration contract).

---

### 2. Set Files — wire UI to existing `set_files` / `scenes`

**What:** Point `set-files.tsx` / `set-file/[id].tsx` at `setFilesService.ts` (Supabase branch); one-time migration import from `syncoffset:set_files:*` keys.

**Why second:** Migration **`20260425180000_set_files.sql` already exists**; fake-wired service unused by screens; blocks web/mobile set divergence.

**Effort:** Medium · **Migration required:** No new SQL (app + data backfill only).

---

### 3. Measure captures — payload + photo persistence on `production_asset_captures`

**What:** Add `measure_payload jsonb` (or sibling table) for full `MeasuredItem`; persist photos to storage + `production_asset_capture_photos`; replace `measurements.ts` AsyncStorage list with Supabase read/write when `backendReady`.

**Why third:** Important for wrap/continuity but schema only supports partial columns today; depends on asset foundation migrations already present.

**Effort:** High · **Migration required:** Yes (payload + storage paths).

---

### Explicitly defer (unless product asks)

- **Measure session drafts** — keep handset-local unless cross-device draft recovery is a requirement.  
- **Pilot presets** — small table, low entity risk; batch with `show_members` preferences work.

---

## Evidence index

| Workflow | Key files |
|----------|-----------|
| Schedule spine | `expo/providers/AppProvider.tsx` (`SCHEDULE_SPINE_STORAGE_PREFIX`, `scheduleSpinePersistence`) |
| Schedule shadow | `expo/services/scheduleShadowMirror.ts`, `20260520100000_production_schedule_shadow.sql` |
| Set files local | `expo/services/setFiles.ts`, `expo/app/set-files.tsx` |
| Set files SQL | `expo/services/setFilesService.ts`, `20260425180000_set_files.sql` |
| Measurements | `expo/services/measurements.ts`, `expo/types/index.ts` (`MeasuredItem`) |
| Measure drafts | `expo/services/measureSessionDraft.ts` |
| Pilot presets | `expo/services/pilotRolePresetStorage.ts`, `expo/app/operations-hub.tsx` |
| Asset SQL | `20260523000000_phase5_production_assets_foundation.sql` |
| Prior wiring audit | `docs/EXPO_RUNTIME_WIRING_AUDIT.md` |
