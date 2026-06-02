# SyncOffset Shoot Day Authority v1.0

**Supersedes:** [`SYNCOFFSET_SHOOTDAY_AUTHORITY.md`](./SYNCOFFSET_SHOOTDAY_AUTHORITY.md) (service contracts only) for **core object shape**.

**Code:** `src/types/core/shootday/`

**Legacy (deprecated, retained):** `src/types/core/services/shootday*`, `shoot-day-record.ts`

---

## Constitutional purpose

| Layer | Governs |
|-------|---------|
| **Scene** | Intent — what production plans to shoot |
| **Shoot Day** | **Reality** — what executes on the calendar |

Every production authority ultimately **converges on Shoot Day**.

---

## Critical constitutional rules

### Rule 1 — Scene does not belong to Shoot Day

**Shoot Day does not own Scene.** Scene owns Shoot Day **requirements** (`scene` → `shoot-day` `scheduled-on`).

### Rule 2 — Execution authority

**Shoot Day** is the authoritative source for **production execution** on a calendar day.

### Rule 3 — Assignments ≠ ownership

**ShootDayAssignment** records **participation** only — not ownership of scenes, assets, cast, or crew.

### Rule 4 — Multiple scenes per day

A **Shoot Day** may execute **multiple scenes**.

### Rule 5 — Scene span days

A **Scene** may span **multiple Shoot Days**.

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **ShootDay** | `shoot-day` | Single production day |
| **ShootDayAssignment** | `shootday-assignment` | Participation of any core object on a day |
| **ShootDayPackage** | `shootday-package` | Approved execution documentation |

---

## ShootDay — required fields

| Field | Notes |
|-------|-------|
| `shootDayNumber` | Production day number |
| `shootDate` | Calendar date (ISO string) |
| `status` | `SHOOTDAY_STATUS_REGISTRY` |
| `notes` | May be empty string |

Legacy fields (`dayLabel`, `calendarDate`, `scheduleState`, `currentRevision`) live on **deprecated** `LegacyShootDay` in `services/shoot-day-record.ts`.

---

## ShootDayAssignment — required fields

| Field | Notes |
|-------|-------|
| `shootDayId` | Parent day |
| `targetKind`, `targetId` | Participating object (`scene`, `set`, `location`, `asset`, `cast-assignment`, `bg-assignment`, `crew-assignment`, …) |
| `assignmentStatus` | Participation lifecycle |
| `notes` | May be empty string |

---

## ShootDayPackage — required fields

| Field | Notes |
|-------|-------|
| `shootDayId` | Parent day |
| `packageKind` | `SHOOTDAY_PACKAGE_KIND_REGISTRY` |
| `generatedAt` | Issue time |

**Naming:** `packageKind` `department-package` is shoot-day documentation — distinct from creative **`department-package` core object** (`ShootDayPackageKind` ≠ `CoreObjectKind`).

---

## Lifecycle — `SHOOTDAY_STATUS_REGISTRY`

`draft` · `planned` · `scheduled` · `active` · `wrapped` · `completed` · `cancelled`

---

## Canonical paths

| pathId | Path |
|--------|------|
| `production-execution` | Scene → Shoot Day |
| `department-execution` | Crew Requirement → Crew Assignment → Shoot Day |
| `asset-execution` | Asset → Shoot Day |
| `location-execution` | Location → Shoot Day |
| `full-production-day` | Script Revision → Scene → Shoot Day |

`SHOOTDAY_CANONICAL_RELATIONSHIP_PATHS` · `SHOOTDAY_RELATIONSHIP_SCHEMA_REGISTRY`

---

## Legacy migration

| Path | Status |
|------|--------|
| `src/types/core/shootday/` | **Constitutional** `ShootDay` record + assignments + packages |
| `src/types/core/services/shootday-service.ts` | **Deprecated** — future impl interface only |
| `src/types/core/services/shootday-revision.ts` | **Deprecated** |
| `src/types/core/services/shootday-conflict.ts` | **Deprecated** |
| `src/types/core/services/shootday-propagation.ts` | **Deprecated** |
| `src/types/core/services/shootday-query.ts` | **Deprecated** |
| `src/types/core/services/shoot-day-record.ts` | **Deprecated** — use `LegacyShootDay` export |

Import constitutional types:

```ts
import { type ShootDay, type ShootDayAssignment, SHOOTDAY_STATUS_REGISTRY } from "@/types/core";
```

Import legacy service contracts:

```ts
import type { ShootDayAuthorityService, LegacyShootDay } from "@/types/core";
```

---

## Out of scope

UI · routes · calendar screens · scheduling engines · callsheet generation · Supabase

---

*Types, registries, and relationship contracts only.*
