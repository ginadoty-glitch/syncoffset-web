# SyncOffset Script Authority

Version 1.0 — Types and graph contracts only

**Workspace:** 02 Script Breakdown (script provenance — Scene Authority owns the Scene hub)

**Code:** `src/types/core/script/`

---

## Constitutional hierarchy

Script Authority owns **revision provenance**. Scene Authority owns the **Scene hub** and downstream production linkage.

See [`SYNCOFFSET_PRODUCTION_HIERARCHY.md`](./SYNCOFFSET_PRODUCTION_HIERARCHY.md) and [`SYNCOFFSET_SCENE_AUTHORITY.md`](./SYNCOFFSET_SCENE_AUTHORITY.md).

```
Source Document
    → Script Revision (this authority)
        → Revision Change
            → Scene (Scene Authority — central hub)
                → Breakdown Element
                    → Budget Requirement → Set → Asset → Vendor → Logistics → Shoot Day
```

| Layer | Objects | Role |
|-------|---------|------|
| **Source (immutable)** | `ScriptRevisionSourceDocument` in `source/` | PDF/pages exactly as received |
| **Script authority** | `ScriptRevision`, `RevisionChange`, `BreakdownElement` | Script provenance derived from sources |
| **Scene authority** | `Scene`, `ProductionSet`, `BudgetRequirement` | Central production unit — see Scene Authority doc |
| **Creative authority** | `DirectorNote`, `DepartmentPackage`, … | Departmental interpretation of requirements |
| **Calendar authority** | `ShootDay` | When scenes shoot — does not define script content |
| **Operations** | `TransportOrder`, … | Executes approved plan |

### Why Script sits above Schedule, One-Liner, ShootDay, Callsheet, Operations

| Downstream | Depends on script because… |
|------------|------------------------------|
| **Schedule / One-Liner** | Rows reference **scenes** and page counts from a **revision** |
| **ShootDay** | Schedules which **scenes** shoot; revision changes reorder or drop scenes |
| **Callsheet** | Lists scenes, cast, and locations for the day — all script-derived |
| **Creative packages** | Interpret **breakdown** and **scene** requirements |
| **Operations** | Moves assets/people required by **breakdown elements** |

**Rule:** `ShootDay` does not derive from generated outputs. `ScriptRevision` does not derive from callsheets. Provenance flows **up from sources**, **down through authority**, **out to consumers**.

---

## Objects

### ScriptRevision (`script-revision`)

Authority record for draft, shooting, or colored revisions.

| Field | Notes |
|-------|-------|
| `revisionColor` | `draft`, `shooting`, `white`, `blue`, `pink`, … — `SCRIPT_REVISION_COLOR_REGISTRY` |
| `revisionNumber`, `revisionDate`, `pageCount`, `lockedPages` | Revision metadata |
| `sourceDocumentId` | Link to immutable source file |
| `previousRevisionId`, `supersededById` | Version chain |
| `sceneIds[]`, `changeIds[]` | Graph membership |

**Not** the same as `operations/callsheet-revision` (scheduling) or `ScriptRevisionSourceDocument` (file).

### RevisionChange (`revision-change`)

| Kind | `added` · `modified` · `removed` · `moved` · `renumbered` |
| Fields | `sourceRevisionId`, `targetRevisionId`, `sceneId`, `affectedDepartments[]` |

Impact analysis only — no execution engine.

### Scene (`scene`)

Owned by **Scene Authority** (`src/types/core/scene/`). Script Authority links revisions to scenes only.

### BreakdownElement (`breakdown-element`)

Script-derived requirement with `category` from `BREAKDOWN_CATEGORY_REGISTRY` (cast, background, prop, vehicle, …).

Feeds `BgRequirement`, `DepartmentPackage`, and legacy `element` records.

---

## Relationship graph (contracts only)

```
ScriptRevision → RevisionChange
ScriptRevision → Scene
RevisionChange → Scene
Scene → BreakdownElement
Scene → BgRequirement
BreakdownElement → BgRequirement
Scene → DepartmentPackage
BreakdownElement → DepartmentPackage
Scene → Location · Media · ShootDay
```

Constants: `SCRIPT_CANONICAL_RELATIONSHIP_PATHS`, `SCRIPT_RELATIONSHIP_SCHEMA_REGISTRY`

---

## Registry integration

| Kind | Registry |
|------|----------|
| `script-revision` | `CORE_OBJECT_REGISTRY` (authority, not immutable source) |
| `revision-change` | Added |
| `scene` | Expanded relationship targets |
| `breakdown-element` | Added |

Legacy `element` kind retained for backward compatibility.

---

## Imports

```ts
import {
  type ScriptRevision,
  type Scene,
  type BreakdownElement,
  SCRIPT_REVISION_COLOR_REGISTRY,
  SCRIPT_CANONICAL_RELATIONSHIP_PATHS,
} from "@/types/core";
```

---

*No UI, parsing, extraction services, or workflows in this phase.*
