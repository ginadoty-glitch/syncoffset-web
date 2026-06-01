# SyncOffset Crew Authority

Version 1.1 — Types and graph contracts only

**Workspace:** 06 Cast & Crew (Crew)

**Code:** `src/types/core/crew/`

**Related:** [`SYNCOFFSET_SCRIPT_AUTHORITY.md`](./SYNCOFFSET_SCRIPT_AUTHORITY.md) · [`SYNCOFFSET_CREATIVE_AUTHORITY.md`](./SYNCOFFSET_CREATIVE_AUTHORITY.md) · [`SYNCOFFSET_RELATIONSHIP_GRAPH.md`](./SYNCOFFSET_RELATIONSHIP_GRAPH.md)

---

## Four constitutional objects

| Object | `CoreObjectKind` | Production meaning |
|--------|------------------|-------------------|
| **Department** | `department` | Grip, Electric, Set Decoration, Transportation, … — owns the roster |
| **Crew Requirement** | `crew-requirement` | Open position on the show (Leadman, Set Dresser, …) — **not a person** |
| **Crew Member** | `crew-member` | Actual crew person on the payroll roll (no rates/timecards in this layer) |
| **Crew Assignment** | `crew-assignment` | Who is called for which position on which shoot day |

**Not the same as** creative `DepartmentPackage` (look books, construction drawings, scout stills). A department package may **spawn** crew requirements; the **department record** owns fulfillment.

---

## Constitutional chain

```
Script Revision
    → Scene
        → Breakdown Element
            → Crew Requirement
                → Crew Assignment
                    → Shoot Day
                        → Callsheet
```

| Link | Production language |
|------|---------------------|
| Script Revision → Scene | Scenes exist in the issued script (white, blue, pink, …) |
| Scene → Breakdown Element | Script breakdown lists cast, props, vehicles, SPFX, etc. |
| Breakdown Element → Crew Requirement | Breakdown drives how many Leadmen, Buyers, or SPFX Techs are needed |
| Department Package → Crew Requirement | Art / Construction / SPFX packages can add or clarify positions |
| Crew Requirement → Department | Set Dec owns Set Dressers; Grip owns Grips |
| Crew Member → Crew Assignment | John Smith called as Key Grip on Day 12 |
| Crew Assignment → Shoot Day | Call is tied to a shoot day — calendar authority |
| Crew Assignment → Callsheet | Crew call block on the day’s callsheet |

---

## Department registry

`PRODUCTION_DEPARTMENT_REGISTRY` — real show departments only:

Production · Directing · Casting · Background Casting · Art · Set Decoration · Props · Construction · Graphics · Greens · Locations · Transportation · Camera · Grip · Electric · Costume · Hair · Makeup · SPFX · VFX · Sound · Editorial · Post · Accounting · Production Office · Catering · Craft Service · Custom

---

## Crew Requirement

Positions generated from script breakdown, scenes, or department packages.

**Examples:** Leadman · Set Dresser · Buyer · Prop Assistant · Truck Driver · Greensperson · Construction Coordinator · SPFX Technician · Makeup Artist · Hair Stylist

| Field | Notes |
|-------|-------|
| `departmentId` | Owning department record |
| `roleLabel` | Position title on the call sheet |
| `sceneId` | Scene that generated the need |
| `breakdownElementId` | Breakdown line provenance |
| `departmentPackageId` | Package that added the need |
| `quantityRequired` | How many of this position |
| `notes` | Hiring / HOD notes |

---

## Crew Member

| Field | Notes |
|-------|-------|
| `crewMemberName` | Person |
| `departmentId` | Home department (Grip, Electric, …) |
| `role` | Job title |
| `unionStatus` | Union / non-union (no rates) |
| `contactInformation` | Phone / email |
| `availabilityStatus` | Hold, booked, etc. |
| `notes` | Coordinator notes |

**Out of scope:** payroll, deal memos, timecards, kit rental rates.

---

## Crew Assignment

| Field | Notes |
|-------|-------|
| `crewMemberId` | Who |
| `crewRequirementId` | What position |
| `shootDayId` | Which day |
| `assignmentStatus` | pending · confirmed · on-set · wrapped · … |
| `callTime` | Crew call (e.g. `06:00 AM`) |
| `wrapTime` | Expected wrap |

---

## Relationship graph (contracts only)

```
Scene → Crew Requirement
Breakdown Element → Crew Requirement
Department Package → Crew Requirement
Crew Requirement → Department
Crew Member → Crew Assignment
Crew Assignment → Shoot Day
Crew Assignment → Callsheet
```

`CREW_CANONICAL_RELATIONSHIP_PATHS` · `CREW_RELATIONSHIP_SCHEMA_REGISTRY` (merged into platform schema registry)

---

## Department ownership

| Department record tracks | Production use |
|--------------------------|----------------|
| `crewMemberIds[]` | Department roster |
| `crewRequirementIds[]` | Open positions |
| `departmentPackageIds[]` | Linked look books / tech packs |
| Head of Department | Optional `headOfDepartmentId` |

Departments **view** the same script and calendar truth as the rest of the show (Article VIII) — they do not fork a second script or schedule.

---

## Imports

```ts
import {
  type Department,
  type CrewRequirement,
  type CrewMember,
  type CrewAssignment,
  PRODUCTION_DEPARTMENT_REGISTRY,
  CREW_CANONICAL_RELATIONSHIP_PATHS,
} from "@/types/core";
```

---

*No UI, payroll, scheduling logic, extraction, or Supabase in this phase.*
