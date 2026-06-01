# SyncOffset Script Authority

Version 1.0 — Types and graph contracts only

**Workspace:** 02 Script Breakdown (constitutional root of the production graph)

**Code:** `src/types/core/script/`

---

## Constitutional hierarchy

Script Authority sits **above** scheduling and operations. Nothing in schedule, callsheet, or logistics defines what the script contains — those layers **consume** script authority.

```
Draft Script (source file)
    → Shooting Script (source file / revision color)
        → Script Revision (authority record)
            → Revision Change (diff)
                → Scene (central hub)
                    → Breakdown Element (requirement)
                        → BG Requirement · Department Package · Schedule · Operations
```

| Layer | Objects | Role |
|-------|---------|------|
| **Source (immutable)** | `ScriptRevisionSourceDocument` in `source/` | PDF/pages exactly as received |
| **Script authority** | `ScriptRevision`, `RevisionChange`, `Scene`, `BreakdownElement` | Production truth derived from sources |
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

**Central relationship hub** of production.

Connects: script revision, locations, cast, BG, stunts, vehicles, props, department packages, media, shoot days.

See `SCENE_RELATIONSHIP_HUB_TARGETS`.

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
