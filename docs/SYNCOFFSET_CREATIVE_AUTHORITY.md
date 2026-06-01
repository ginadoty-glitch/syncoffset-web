# SyncOffset Creative Authority

Version 1.0 — Types and graph contracts only

**Workspaces:** 02 Script Breakdown (requirements) · 05 Media Hub (artifacts) · department lenses (Art, Costume, Locations, …)

**Code:** `src/types/core/creative/`

---

## Constitutional flow

```
Script (requirements)
    → Creative authority (interpretation)
        → Operations (execution)
```

| Layer | Role |
|-------|------|
| **Script / Breakdown** | Creates production **requirements** (scenes, elements, BG needs) |
| **Creative authority** | Defines departmental **interpretation** (notes, packages, references, tech packs) |
| **Operations** | Executes **approved** interpretation (logistics, builds, wardrobe, transport) |

Creative packages do not replace script sources. Tech packs do not replace department packages. Operations do not invent creative intent.

---

## First-class creative objects

| Object | `CoreObjectKind` | Purpose |
|--------|------------------|---------|
| **DirectorNote** | `director-note` | Creative instruction from director/production |
| **CreativeReference** | `creative-reference` | Mood boards, look books, scout stills, concept art |
| **DepartmentPackage** | `department-package` | Departmental production intent (14 specializations) |
| **TechPack** | `tech-pack` | Technical implementation (drawings, specs, files) |
| **ApprovalRecord** | `approval-record` | Approval lifecycle gate |

---

## DirectorNote

| Field | Notes |
|-------|-------|
| `title`, `author`, `noteType` | Instruction classification |
| `revisionId` | Script revision context |
| `sceneIds[]`, `locationIds[]` | Scope |
| `mediaAssetIds[]` | Linked `media` objects |
| `departmentIds[]` | Target departments |
| `approvalStatus` | Summary; detail in `approvalRecordIds[]` |

---

## CreativeReference

**Types:** `image` · `video` · `pdf` · `document` · `sketch` · `storyboard` · `concept-art`

**Linkage:** ScriptRevision, Scene, Location, Character (`characterId` → cast-member), ShootDay, DepartmentPackage, Media

---

## DepartmentPackage

**Specializations** (`DEPARTMENT_PACKAGE_KIND_REGISTRY`):

Production Design · Art · Set Decoration · Props · Construction · Graphics · Costume · Hair · Makeup · SFX · VFX · Location (`location-department`) · Camera · Stunt

| Field | Notes |
|-------|-------|
| `packageName`, `department`, `revision` | Identity + version chain |
| `sourceDocumentIds[]` | Immutable source lineage (Article I) |
| `mediaAssetIds[]`, `sceneIds[]`, `locationIds[]` | Scope |
| `approvalIds[]` | `ApprovalRecord` refs |

---

## TechPack

Versioned technical artifacts with:

- `revisions[]` — `sourceDocumentId` per revision
- `format` — `TECH_PACK_FORMAT_REGISTRY` (PDF, DWG, PSD, MP4, …)
- `approvalStatus` / `approvalRecordIds[]`
- Parent `departmentPackageId`

---

## ApprovalRecord

| Status | Meaning |
|--------|---------|
| `pending` | Awaiting decision |
| `approved` | Cleared for operations |
| `rejected` | Blocked — revise package |
| `superseded` | Replaced by newer approval |

Tracks `approver`, `decidedAt`, `notes`, `subjectId` / `subjectKind`.

---

## Relationship graph (contracts only)

```
ScriptRevision → DirectorNote
DirectorNote → DepartmentPackage
DepartmentPackage → TechPack
DepartmentPackage → CreativeReference
DepartmentPackage → Scene
DepartmentPackage → Location
TechPack → Media
```

Constants: `CREATIVE_CANONICAL_RELATIONSHIP_PATHS`, `CREATIVE_RELATIONSHIP_SCHEMA_REGISTRY` (merged into platform schema registry).

No workflow engine, extraction, or UI in this phase.

---

## Examples of package contents (documentation)

Director notes · PD notes · mood boards · look books · construction drawings · graphics packages · costume/hair/makeup references · SFX references · location/scout packages · technical specifications — all map to **DepartmentPackage**, **CreativeReference**, or **TechPack** with source provenance.

---

## Imports

```ts
import {
  type DirectorNote,
  type DepartmentPackage,
  type TechPack,
  type CreativeReference,
  DEPARTMENT_PACKAGE_KIND_REGISTRY,
  CREATIVE_CANONICAL_RELATIONSHIP_PATHS,
} from "@/types/core";
```

---

*Preserves architecture: additive types only; logistics/propagation unchanged.*
