# SyncOffset Scene Authority

Version 1.0 — Constitutional correction (types and graph only)

**Workspace:** 02 Script Breakdown (hub) · all downstream workspaces consume Scene

**Code:** `src/types/core/scene/`

**Related:** [`SYNCOFFSET_SCRIPT_AUTHORITY.md`](./SYNCOFFSET_SCRIPT_AUTHORITY.md) · [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md) · [`SYNCOFFSET_RELATIONSHIP_GRAPH.md`](./SYNCOFFSET_RELATIONSHIP_GRAPH.md)

---

## Core production truth

Production does **not** operate:

```
Script → Scene → Set → Budget
```

Production operates:

```
Source Document
    → Script
        → Scene
            → Breakdown
                → Budget
                    → Set
                        → Asset
                            → Vendor
                                → Logistics
                                    → Shoot Day
```

- **Budgets are created FROM breakdowns** (and scene context).
- **Scenes** are rewritten, reduced, merged, relocated, or removed based on budget realities.
- **Budget authority** sits **above** Set and Asset authority, **below** Script and Scene authority.

---

## Scene (`scene`)

A Scene is the **central production unit**. Scheduling, budgeting, breakdown, location, cast, background, crew, and shoot day planning **derive from Scene**.

### Constitutional production fields (required)

| Field | Values / notes |
|-------|----------------|
| `sceneNumber` | Production scene identifier |
| `interiorExterior` | `INT` · `EXT` · `INT/EXT` |
| `timeOfDay` | `DAY` · `NIGHT` · `DAWN` · `DUSK` · `CONTINUOUS` |
| `scriptPages` | Page count (typically eighths) |
| `setId` | Primary production set |
| `locationId` | Primary location |
| `episodeNumber` | Episode slating |
| `revisionColor` | Revision color at time of record (from script revision palette) |
| `notes` | Production notes (may be empty string) |

These are **not** optional metadata.

### Authority split

| Authority | Owns |
|-----------|------|
| **Script** | Source provenance, `ScriptRevision`, `RevisionChange`, breakdown taxonomy |
| **Scene** | Scene record, Set container, Budget requirement linkage, scene hub graph |
| **ShootDay** | Calendar — when scenes shoot |

---

## Set (`set`) — container, not parent

> A Set exists to support one or more scenes.  
> A Set is **not** the parent authority of production.  
> A Set is a production container **derived from** script requirements.

| Field | Notes |
|-------|-------|
| `setNumber` | Constitutional identifier — e.g. `101`, `205`, `330` |
| `setName` | e.g. `SET 101 Police Station` |
| `relatedSceneIds[]` | Scenes using this set |
| `assetIds[]` | Assets tracked to this set |
| `locationIds[]` | Locations tied to set |
| `budgetLineIds[]` | Budget lines funding set work |

TypeScript: `ProductionSet` (alias avoids collision with JS `Set`).

---

## Budget requirement (`budget-requirement`)

> Budget originates from breakdown analysis.

Budget authority sits **below** Script and Scene, **above** Set, Asset, Vendor, Location, and Logistics.

| Field | Notes |
|-------|-------|
| `sceneId` | Anchor scene |
| `breakdownElementId` | Provenance from breakdown |
| `setId`, `budgetLineId` | Optional links when allocated |
| `requirementLabel` | Human-readable need |

**Out of scope:** calculations, ledgers, UI, Supabase.

---

## Department coding

All physical production tracking in SyncOffset is organized by:

```
Production → Department → Set Number
```

Examples:

- SET 101 Police Station  
- SET 205 Apartment  
- SET 330 Hospital Corridor  

Assets, purchases, rentals, returns, shipments, and logistics records **must be capable of tracing back to a set number**.

`setNumber` on `ProductionSet` is a **constitutional production identifier**.

---

## Production hierarchy (normative)

```
Script
  ↓
Scene
  ↓
Breakdown Elements
  ↓
Budget Requirements
  ↓
Sets
  ↓
Assets
  ↓
Vendors
  ↓
Logistics
  ↓
Shoot Days
```

---

## Relationship graph (contracts)

| From | To | Kind (typical) |
|------|-----|----------------|
| Script Revision | Scene | `derived-from` |
| Scene | Breakdown Element | `derived-from` |
| Scene | Budget Requirement | `derived-from` |
| Breakdown Element | Budget Requirement | `derived-from` |
| Scene | Set | `references` |
| Scene | Location Requirement | `derived-from` |
| Scene | Crew Requirement | `derived-from` |
| Scene | Cast Requirement | `derived-from` |
| Scene | Background Requirement | `derived-from` |
| Scene | Shoot Day | `scheduled-on` |

`SCENE_CANONICAL_RELATIONSHIP_PATHS` · `SCENE_RELATIONSHIP_SCHEMA_REGISTRY` · `SCENE_RELATIONSHIP_HUB_TARGETS`

---

## Imports

```ts
import {
  type Scene,
  type ProductionSet,
  type BudgetRequirement,
  SCENE_RELATIONSHIP_HUB_TARGETS,
} from "@/types/core";
```

---

## Constitutional conflicts (resolved or documented)

| Conflict | Resolution |
|----------|------------|
| Scene lived only under Script Authority | Scene types and hub contracts moved to `scene/`; Script retains revision chain |
| Data Constitution listed Set under Locations | Set is a **production container** under Scene Authority, not a location subtype |
| `locationIds[]` vs constitutional `locationId` | `locationId` is required primary; `locationIds[]` deprecated for multi-location via assignments |
| Legacy slating `int`/`day` | Constitutional slating uses `INT`/`DAY`; legacy fields deprecated on `Scene` |
| ShootDay as script parent | Unchanged: ShootDay **consumes** Scene; does not define script |

---

*No UI, routes, Supabase, scheduling engine, budget calculations, or maps in this phase.*
