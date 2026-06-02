# SyncOffset Shooting Schedule Authority v1.0

**Constitutional remediation** — resolves audit findings for `shoot-schedule` vs `shooting-schedule`, Production Calendar ownership, and production hierarchy ambiguity.

**Code:** `src/types/core/shooting-schedule/`

**Out of scope:** UI · routes · stripboards · drag-and-drop · scheduling engines · calendar engines · callsheet generation · Supabase · workflow automations.

---

## Constitutional purpose

| Layer | Governs |
|-------|---------|
| **Shooting Schedule** | **What** gets shot (approved scene ordering / schedule intent) |
| **Production Calendar** | **When** production operates (master planning dates) |
| **Shoot Day** | **What actually happened** on an execution day |
| **Callsheet** | Tomorrow’s operational package |

Shooting Schedule is the **approved ordering layer** between script/scene intent and calendar planning. It is **not** a scheduling engine, stripboard UI, or calendar.

---

## Critical distinction — Rule 1 (naming)

| Term | Layer | Meaning |
|------|-------|---------|
| **`shooting-schedule`** | `CoreObjectKind` | Constitutional production object (this authority) |
| **`shoot-schedule`** | `SourceDocumentKind` | Article I immutable uploaded file only (e.g. `COMMERCIAL_SCHEDULE_V4.pdf`) |

**Never** use `shoot-schedule` as a `CoreObjectKind`.

**Ingestion chain:**

```
shoot-schedule (SourceDocumentKind)
  → source-document
  → shooting-schedule-revision (optional provenance)
  → shooting-schedule
```

Logical documents may also link via Document Authority (`document` / `document-revision`).

---

## Constitutional hierarchy

```
Script Revision
  → Scene
  → Shooting Schedule          ← this authority (what)
  → Production Calendar        ← when (Production Calendar Authority)
  → Calendar Day
  → Shoot Day                  ← execution (Shoot Day Authority)
  → Callsheet                  ← operations (Callsheet Authority)
```

**Schedule Strip** and **Schedule Day** kinds are reserved for a future scheduling authority — not introduced in v1.0.

---

## Critical rules

### Rule 1 — Constitutional term is `shooting-schedule`

The constitutional term is **`shooting-schedule`**. **`shoot-schedule`** is ingestion vocabulary only.

### Rule 2 — Consumes script/scene intent

A **Shooting Schedule** **consumes** **Script Revision** and **Scene** ordering. It does **not** create scenes.

### Rule 3 — Production Calendar consumes Shooting Schedule

**Production Calendar** **consumes** **Shooting Schedule** (`production-calendar` `derived-from` `shooting-schedule`). The calendar does **not** replace the schedule object.

### Rule 4 — Exported file is not the schedule

Exported PDFs, spreadsheets, and distribution bundles are **`shooting-schedule-package`** → **`generated-output`** — not the constitutional schedule record.

### Rule 5 — Multiple revisions

**ShootingScheduleRevision** supports **multiple revisions** per schedule. No single-revision assumption.

### Rule 6 — No direct Shoot Day derivation

**Shoot Day** does **not** derive directly from **Shooting Schedule**. Execution flows through **Production Calendar** → **Calendar Day** → **Shoot Day**.

Deprecated global paths that jump `shoot-schedule` (source) → `shoot-day` remain for legacy ingestion only.

### Rule 7 — Not a calendar authority

`isCalendarAuthority` is **false** for all shooting-schedule kinds. **Production Calendar** / **Calendar Day** own planning dates.

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **ShootingSchedule** | `shooting-schedule` | Approved scene ordering for a show |
| **ShootingScheduleRevision** | `shooting-schedule-revision` | Issued revision history |
| **ShootingSchedulePackage** | `shooting-schedule-package` | Export / distribution bundles |

---

## ShootingSchedule — required fields

| Field | Notes |
|-------|-------|
| `showId` | Parent show |
| `scheduleName` | Display name |
| `status` | `SHOOTING_SCHEDULE_STATUS_REGISTRY` |
| `revisionNumber` | Current revision index |
| `revisionColor` | `SHOOTING_SCHEDULE_REVISION_COLOR_REGISTRY` |
| `scriptRevisionId` | Script revision consumed (Rule 2) |
| `sceneIds` | Ordered scene references |
| `notes` | May be empty string |

---

## ShootingScheduleRevision — required fields

| Field | Notes |
|-------|-------|
| `shootingScheduleId` | Parent schedule |
| `revisionNumber` | Revision index |
| `revisionColor` | Industry revision color |
| `createdAt` | Issue timestamp |
| `changeSummary` | Human-readable change log |
| `sourceDocumentId` | Optional — Article I `shoot-schedule` file |

---

## ShootingSchedulePackage — required fields

| Field | Notes |
|-------|-------|
| `shootingScheduleId` | Parent schedule |
| `packageKind` | `SHOOTING_SCHEDULE_PACKAGE_KIND_REGISTRY` |
| `status` | draft · issued · superseded · archived |
| `generatedAt` | Package issue time |

---

## Relationship contracts

`SHOOTING_SCHEDULE_CANONICAL_RELATIONSHIP_PATHS` · `SHOOTING_SCHEDULE_RELATIONSHIP_SCHEMA_REGISTRY`

| Edge | Relationship |
|------|----------------|
| `shooting-schedule` → `scene` | Schedule consumes scene ordering |
| `shooting-schedule` → `script-revision` | Schedule tied to script revision |
| `shooting-schedule` → `shooting-schedule-revision` | Revisions |
| `shooting-schedule` → `shooting-schedule-package` | Packages |
| `production-calendar` → `shooting-schedule` | Calendar consumes schedule (Production Calendar Authority) |
| `callsheet` → `shooting-schedule` | Operational context (Callsheet Authority) |

---

## Related authorities

- **Script / Scene** — upstream intent
- **Production Calendar** — consumes schedule for **when** (`SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md`)
- **Shoot Day** — execution; no direct schedule → shoot-day edge
- **Callsheet** — references schedule context
- **Document / Source** — `shoot-schedule` files trace through `source-document`

---

## Audit remediation

| Finding | Resolution |
|---------|------------|
| `shoot-schedule` vs `shooting-schedule` collision | Rule 1 — distinct layers documented and typed |
| No `shooting-schedule/` module | This authority module |
| Production hierarchy ambiguity | Rules 2–3–6 — what / when / execution separation |
| `shoot-day` calendar authority doc drift | Calendar authority remains `production-calendar` only |

---

*Types, registries, and relationship contracts only.*
