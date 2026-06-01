# SyncOffset Cast Authority

Version 1.0 — Types and graph contracts only

**Workspace:** 06 Cast & Crew (Cast section) · Script Authority (character origin)

**Code:** `src/types/core/cast/`

**Related:** [`SYNCOFFSET_SCRIPT_AUTHORITY.md`](./SYNCOFFSET_SCRIPT_AUTHORITY.md) · [`SYNCOFFSET_BACKGROUND_AUTHORITY.md`](./SYNCOFFSET_BACKGROUND_AUTHORITY.md)

---

## Four constitutional objects

| Object | `CoreObjectKind` | Meaning |
|--------|------------------|---------|
| **Character** | `character` | Scripted role — **not a performer** |
| **Cast Requirement** | `cast-requirement` | Production need to fulfill a character on a scene |
| **Cast Member** | `cast-member` | Performer who may play roles |
| **Cast Assignment** | `cast-assignment` | Binds performer + character + scene + shoot day |

**Rule:** Never collapse character, requirement, performer, or assignment into one record.

---

## Constitutional flow

```
Script Revision → Character (originates from script)
Character → Cast Requirement (need on scene)
Cast Requirement → Scene
Cast Member → Cast Assignment (performer fulfills need)
Character → Cast Assignment
Cast Assignment → Shoot Day
Shoot Day → Callsheet (generated output)
```

| Step | Explanation |
|------|-------------|
| **Character originates from script** | Names and scene presence derive from `ScriptRevision` / breakdown |
| **Cast Requirement originates from scene** | Each scene+character pair expresses production need |
| **Cast Member fulfills requirement** | Casting books a person — not the character record itself |
| **Cast Assignment binds schedule** | Links who plays whom, when (`shootDayId`) |

---

## Character

Examples: Detective Mason, Waitress, Casino Manager.

| Field | Notes |
|-------|-------|
| `characterName` | Display / script name |
| `scriptRevisionId` | Provenance |
| `sceneIds[]` | Appearances |

---

## Cast Requirement

| Field | Notes |
|-------|-------|
| `sceneId`, `characterId`, `scriptRevisionId` | Scoped need |
| `notes` | Casting / production notes |

---

## Cast Member

| Field | Notes |
|-------|-------|
| `performerName` | Person — not character name |
| `agency`, `unionStatus`, `contactInformation`, `availabilityStatus` | No payroll / deal memo |

---

## Cast Assignment

| Field | Notes |
|-------|-------|
| `characterId`, `castMemberId`, `sceneId`, `shootDayId` | Bridge |
| `assignmentStatus` | `pending` → `confirmed` → `on-set` → `wrapped` |
| `castRequirementId` | Optional link to requirement fulfilled |

---

## Relationship graph (contracts only)

Constants: `CAST_CANONICAL_RELATIONSHIP_PATHS`, `CAST_RELATIONSHIP_SCHEMA_REGISTRY`

Merged into platform `RELATIONSHIP_SCHEMA_REGISTRY`.

---

## Scene integration

`Scene` includes `characterIds[]`, `castRequirementIds[]`, and legacy `castIds[]` (deprecated alias).

---

## Comparison to Background authority

| Background | Cast |
|------------|------|
| `BgRequirement` | `CastRequirement` |
| `BackgroundPerformer` | `CastMember` |
| `BgAssignment` | `CastAssignment` |
| No named “character” object | `Character` is scripted role |

---

## Imports

```ts
import {
  type Character,
  type CastRequirement,
  type CastMember,
  type CastAssignment,
  CAST_CANONICAL_RELATIONSHIP_PATHS,
} from "@/types/core";
```

---

*No UI, workflows, payroll, or Supabase in this phase.*
