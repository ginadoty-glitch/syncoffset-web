# SyncOffset Background Performer Authority

Version 1.0 — Types and graph contracts only

**Workspace:** 06 Cast & Crew (Background section)

**Code:** `src/types/core/background/`

**Related:** [`SYNCOFFSET_RELATIONSHIP_GRAPH.md`](./SYNCOFFSET_RELATIONSHIP_GRAPH.md) · [`SYNCOFFSET_SHOOTDAY_AUTHORITY.md`](./SYNCOFFSET_SHOOTDAY_AUTHORITY.md)

---

## Three constitutional objects

| Object | `CoreObjectKind` | Meaning |
|--------|------------------|---------|
| **BG Requirement** | `bg-requirement` | Production **need** from breakdown — not a person |
| **Background Performer** | `background-performer` | Individual performer |
| **BG Assignment** | `bg-assignment` | Performer fulfilling a requirement on a shoot day |

**Rule:** Requirements ≠ Performers ≠ Assignments. Never collapse a need into a person record.

---

## BG Requirement

Originates from script breakdown (`breakdownElementId`, `scriptRevisionId`, `sceneId`).

| Field group | Examples |
|-------------|----------|
| Quantities | `quantityRequired`, `quantityBooked`, `quantityConfirmed` |
| Category | `pedestrian`, `casino-patron`, `custom`, … — `BG_CATEGORY_REGISTRY` |
| Labels | Business Pedestrians, Casino Patrons, Police Officers, … |
| Needs | `wardrobeRequirements[]`, `makeupRequirements[]`, `specialSkills[]`, `stuntFlag` |

---

## Background Performer

Individual record: name, agency, union status (no payroll), availability, contact, wardrobe sizes, skills.

**Out of scope:** pay rates, contracts, deal memos, tax forms.

**Future graph links:** ShootDay, Scene, BgAssignment, GeneratedOutput — `BACKGROUND_PERFORMER_RELATIONSHIP_TARGETS`

---

## BG Assignment

Bridge record:

- `performerId` + `bgRequirementId` + `shootDayId` + `sceneId`
- `callTime` / `wrapTime`
- `costumeApproved`, `makeupApproved`, `transportationRequired`
- `assignmentStatus`

---

## Category registry

`BG_CATEGORY_REGISTRY` — extensible; `custom` allows production-defined labels.

---

## Relationship graph (contracts only)

```
ScriptRevision → Scene
Scene → Element (breakdown)
Element → BGRequirement
BGRequirement → BGAssignment
BackgroundPerformer → BGAssignment
BGAssignment → ShootDay
ShootDay → Callsheet (generated output / source)
ShootDay → DOOD (generated output / source)
```

Constants:

- `BG_CANONICAL_RELATIONSHIP_PATHS`
- `BG_RELATIONSHIP_SCHEMA_REGISTRY` (merged into platform `RELATIONSHIP_SCHEMA_REGISTRY`)

No traversal or propagation execution in this phase.

---

## Department impact (how requirement changes propagate)

When a **BG Requirement** changes (quantity, category, wardrobe, stunt flag, scene link), downstream consumers read the graph — they do not duplicate requirement data.

| Department | Impact |
|------------|--------|
| **AD Department** | Scene counts, call timing, background action notes on callsheets |
| **Production** | Overall day load, schedule confirmation via ShootDay authority |
| **Costume** | `wardrobeRequirements[]`, `costumeApproved` on assignments |
| **Makeup & Hair** | `makeupRequirements[]`, `makeupApproved` on assignments |
| **Transportation** | `transportationRequired` on assignments; company moves / shuttles |
| **Catering** | Headcount derived from confirmed assignments + requirements gap |
| **Locations** | Holding areas, capacity, permit crowd limits tied to scene/location |

### Propagation chain (conceptual)

1. **Breakdown change** → revises or creates `BgRequirement` (provenance to `scriptRevisionId` / `breakdownElementId`).
2. **Requirement gap** (`quantityRequired` − `quantityConfirmed`) → casting books performers → `BgAssignment` records.
3. **Assignment change** → updates ShootDay-linked outputs (callsheets, DOOD) via ShootDay authority — not the reverse.
4. **ShootDay revision** → regenerates consumer outputs; assignments remain linked by ID.

Intelligence (future) may flag: under-booked requirements, costume/makeup not approved, transport missing for distant locations.

---

## Imports

```ts
import {
  type BgRequirement,
  type BackgroundPerformer,
  type BgAssignment,
  BG_CATEGORY_REGISTRY,
  BG_CANONICAL_RELATIONSHIP_PATHS,
} from "@/types/core";
```

---

*No UI, services, database, extraction, scheduling, or payroll in this phase.*
