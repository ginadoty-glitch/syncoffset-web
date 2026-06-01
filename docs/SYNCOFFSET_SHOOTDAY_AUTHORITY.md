# SyncOffset ShootDay Authority

Version 1.0 — Service contracts only (no implementation)

**Governs:** Article VII of [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md)

**Code:** `src/types/core/services/`

---

## Constitutional authority

**ShootDay is the only calendar authority object** in SyncOffset.

| Rule | Meaning |
|------|---------|
| Authority | Shoot Day owns date, call time, unit, and schedule state on the production calendar |
| Consumers | Callsheets, DOODs, transport packages, company moves, cast/crew reports, and generated outputs **derive from** ShootDay |
| Prohibition | ShootDay **does not** derive from generated outputs |
| Mutations | All ShootDay create/revise/supersede/archive operations go through `ShootDayAuthorityService` (future impl) |
| Sources | Schedule and one-liner **source documents** propose changes; calendar service commits ShootDay state |

Prep Day and Wrap Day are related scheduling objects; **ShootDay** remains the operational backbone for a shoot day.

---

## Service contracts

| Interface | File | Role |
|-----------|------|------|
| `ShootDayAuthorityService` | `shootday-service.ts` | create, revise, supersede, archive, get, getRelationships |
| `ShootDayRevisionService` | `shootday-revision.ts` | Revision history read contract |
| `ShootDayConflictService` | `shootday-conflict.ts` | Future conflict evaluation |
| `ShootDayPropagationService` | `shootday-propagation.ts` | Future propagation **planning** only |
| `ShootDayQueryService` | `shootday-query.ts` | Read queries by date, location, scene, cast, crew, company move |

No default implementations. No Supabase. No UI.

---

## Revision fields

Every revision records:

- `revisionNumber`
- `supersededById` / `supersedesId`
- `revisionReason`
- `revisionSourceDocumentIds[]`
- `createdBy` / `createdAt`

---

## Conflict categories (future)

`location` · `cast` · `crew` · `company-move` · `vendor` · `transport`

Severity: `info` · `warning` · `critical`

Conflicts are evaluations (`isSourceOfTruth: false`), not core records.

---

## Propagation matrix (specification)

**Inbound (sources → ShootDay):**

- Schedule Revision → ShootDay
- One-Liner Revision → ShootDay

**Outbound (ShootDay → consumers):**

- ShootDay → Callsheet
- ShootDay → Company Move
- ShootDay → Transport Order
- ShootDay → Generated Outputs

Registry constant: `SHOOTDAY_PROPAGATION_SPECS`

**Note:** `src/lib/operations/propagation.ts` (logistics UI) is unchanged; unification is a future phase.

---

## Query contracts

| Query type | Anchor |
|------------|--------|
| `shoot-days-by-date` | Calendar date |
| `shoot-days-by-location` | Location (`ShootDaysByLocationAuthorityQuery` — not graph query) |
| `shoot-days-by-scene` | Scene |
| `shoot-days-by-cast` | Cast member |
| `shoot-days-by-crew` | Crew member |
| `shoot-days-by-company-move` | Company move |

Graph traversal may also use `ShootDaysByLocationQuery` in `relationships/relationship-query.ts`.

---

## Imports

```ts
import {
  type ShootDay,
  type ShootDayAuthorityService,
  SHOOTDAY_PROPAGATION_SPECS,
} from "@/types/core";
```

---

*Next phase (out of scope): service implementation, calendar persistence, propagation execution.*
