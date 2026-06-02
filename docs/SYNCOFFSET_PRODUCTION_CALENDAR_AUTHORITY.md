# SyncOffset Production Calendar Authority v1.0

**Workspace 14** — constitutional planning calendar layer.

**Code:** `src/types/core/production-calendar/`

**Out of scope:** UI · routes · widgets · drag-and-drop · scheduling engines · availability · conflict engines · callsheet generation · Supabase · notifications · automations.

---

## Constitutional purpose

| Layer | Governs |
|-------|---------|
| **Shooting Schedule** | What gets shot (strip / day / scene ordering) |
| **Production Calendar** | **When** production operates (master planning dates) |
| **Shoot Day** | What **actually happened** on a calendar execution day |
| **Callsheet** | Tomorrow’s operational package (future Callsheet Authority) |

Production Calendar is the **approved production timeline** — after scheduling, before execution.

It is **not**:

- a shooting schedule
- a shoot day
- a callsheet
- a calendar UI

---

## Constitutional hierarchy

```
Script Revision
  → Scene
  → Schedule Strip        (future scheduling authority)
  → Schedule Day          (future scheduling authority)
  → Shooting Schedule
  → Production Calendar
  → Calendar Day
  → Shoot Day
  → Callsheet             (future Callsheet Authority — source: callsheet-revision)
```

---

## Critical rules

### Rule 1 — Consumes shooting schedule

A **Production Calendar** **consumes** a **Shooting Schedule**. It does **not** create scenes.

### Rule 2 — Calendar owns planning; Shoot Day owns execution

**Shoot Days** are **generated from** **Calendar Days** when execution applies. Calendar owns planning dates; Shoot Day owns execution reality.

### Rule 3 — Not every calendar day is a shoot day

**Prep**, **Holiday**, **Travel**, **Weather Hold**, **Construction**, and other `CALENDAR_DAY_TYPE_REGISTRY` values may exist **without** a linked `shootDayId`.

### Rule 4 — Callsheets are not calendar objects

**Callsheet Authority** (future) consumes **Production Calendar** + **Shoot Day**. Callsheets are `callsheet-revision` source documents and `generated-output` — not core calendar kinds.

### Rule 5 — Multiple revisions

**CalendarRevision** records support **multiple revisions** per calendar. No single-revision assumption.

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **ProductionCalendar** | `production-calendar` | Master calendar for a show |
| **CalendarDay** | `calendar-day` | Single production date |
| **CalendarRevision** | `calendar-revision` | Revision history |
| **CalendarPackage** | `calendar-package` | Approved calendar export |

---

## ProductionCalendar — required fields

| Field | Notes |
|-------|-------|
| `showId` | Parent show |
| `calendarName` | Display name |
| `revisionNumber` | Current revision index |
| `revisionColor` | `CALENDAR_REVISION_COLOR_REGISTRY` |
| `startDate` / `endDate` | ISO date range |
| `status` | `PRODUCTION_CALENDAR_STATUS_REGISTRY` |
| `notes` | May be empty string |

---

## CalendarDay — required fields

| Field | Notes |
|-------|-------|
| `calendarId` | Parent calendar |
| `calendarDate` | ISO date |
| `dayNumber` | Production day number on calendar |
| `dayType` | `CALENDAR_DAY_TYPE_REGISTRY` |
| `notes` | May be empty string |

---

## CalendarRevision — required fields

| Field | Notes |
|-------|-------|
| `calendarId` | Parent calendar |
| `revisionNumber` | Revision index |
| `revisionColor` | Industry revision color |
| `createdAt` | Issue timestamp |
| `changeSummary` | Human-readable change log |

---

## CalendarPackage — required fields

| Field | Notes |
|-------|-------|
| `calendarId` | Parent calendar |
| `packageKind` | `CALENDAR_PACKAGE_KIND_REGISTRY` |
| `generatedAt` | Issue timestamp |

---

## Registries

### `PRODUCTION_CALENDAR_STATUS_REGISTRY`

`draft` · `planning` · `review` · `approved` · `active` · `wrapped` · `archived`

### `CALENDAR_DAY_TYPE_REGISTRY`

| Type | Meaning (documentation) |
|------|---------------------------|
| **prep** | Department or stage prep |
| **shoot** | Principal photography — may spawn Shoot Day |
| **wrap** | Wrap activities |
| **company-move** | Company move day (planning) |
| **travel** | Travel day |
| **holiday** | Scheduled holiday |
| **dark-day** | Off day |
| **weather-hold** | Weather placeholder |
| **construction** | Build / construction |
| **strike** | Strike / teardown |
| **pickup** | Pickup shots |
| **reshoot** | Reshoot day |
| **tech-scout** | Technical scout |
| **camera-test** | Camera test |
| **custom** | Production-defined |

Also: `weather-hold`, `strike`, `camera-test` — see code registry for full list.

### `CALENDAR_PACKAGE_KIND_REGISTRY`

`production-calendar-package` · `calendar-revision-package` · `distribution-package`

### `CALENDAR_REVISION_COLOR_REGISTRY`

`white` · `blue` · `pink` · `yellow` · `green` · `goldenrod` · `buff` · `salmon` · `cherry` · `tan` · `gray` · `ivory` · `double-white`

---

## Separation of responsibilities

| Authority | Owns |
|-----------|------|
| **Shooting Schedule** | What gets shot |
| **Production Calendar** | When production operates |
| **Shoot Day** | What actually happened |
| **Callsheet** | Tomorrow’s operational package |

---

## Relationship contracts

`PRODUCTION_CALENDAR_CANONICAL_RELATIONSHIP_PATHS` · `PRODUCTION_CALENDAR_RELATIONSHIP_SCHEMA_REGISTRY`

| Edge | Relationship |
|------|----------------|
| `shooting-schedule` → `production-calendar` | Calendar consumes schedule |
| `production-calendar` → `calendar-day` | Days on calendar |
| `production-calendar` → `calendar-revision` | Revisions |
| `production-calendar` → `calendar-package` | Packages |
| `calendar-day` → `shoot-day` | Execution spawn |
| `shoot-day` → `callsheet` | Operational package (Callsheet Authority) |

---

## Related authorities

- **Scene Authority** — intent; does not own calendar dates
- **Shoot Day Authority** — execution; see `SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md`
- **Shooting Schedule Authority** — `shooting-schedule` core object; source files use `shoot-schedule` only (`SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md`)

---

## Legacy / coexistence

| Topic | Notes |
|-------|-------|
| `prep-day` / `wrap-day` core kinds | Legacy scheduling kinds — prefer `calendar-day` + `dayType` for new work |
| `shoot-day` `isCalendarAuthority` | **Planning** authority is `production-calendar` / `calendar-day`; Shoot Day is **execution** |
| `schedule-shootday-callsheet` global path | **Deprecated** for planning — use `full-production-timeline` via Production Calendar |

---

*Types, registries, and relationship contracts only.*
