# SyncOffset Relationship Graph

Version 1.0 — Type foundation (no graph service, no DB)

**Governs:** Article III of [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md)

**Code:** `src/types/core/relationships/`

**Related:** [`SYNCOFFSET_CORE_OBJECT_REGISTRY.md`](./SYNCOFFSET_CORE_OBJECT_REGISTRY.md) · [`SYNCOFFSET_SOURCE_INGESTION.md`](./SYNCOFFSET_SOURCE_INGESTION.md)

---

## Constitutional rules

1. **Objects remain authoritative** — state lives on `AuditableCoreObject` records (Shoot Day, Scene, Transport Order, etc.).
2. **Relationships connect objects** — `PlatformRelationship` edges link endpoints by ID; they do not duplicate object payloads.
3. **Relationships are never source-of-truth** — immutable truth stays in source documents (Article I); edges are audit-able links only (`isSourceOfTruth: false`).
4. **Graph supports future propagation** — canonical paths document intended hops; `logistics/propagation.ts` remains the current app-layer bridge until unified.

---

## Layer model

| Layer | Type | Role |
|-------|------|------|
| Object | `AuditableCoreObject` | Authoritative record |
| Embedded hint | `CoreRelationship` on object | Optional summary edge on object |
| Graph edge | `PlatformRelationship` | Canonical directed edge |
| Query | `RelationshipQuery` | Future traversal contract (no impl) |
| Path | `CanonicalRelationshipPath` | Documented multi-hop specification |

---

## Relationship kinds

`references` · `derived-from` · `generated-from` · `scheduled-on` · `occurs-at` · `assigned-to` · `requires` · `attached-to` · `supersedes` · `impacts` · `depends-on`

Registry: `RELATIONSHIP_KIND_REGISTRY` in `relationship-kind.ts`

---

## Problem-statement edges (supported)

| Connection | Typical kind |
|------------|----------------|
| ShootDay ↔ Scene | `scheduled-on` |
| ShootDay ↔ Location | `occurs-at` |
| ShootDay ↔ CompanyMove | `scheduled-on` / `impacts` |
| ShootDay ↔ Media | `attached-to` |
| Scene ↔ Location | `occurs-at` |
| Scene ↔ Cast | `assigned-to` |
| Scene ↔ Assets | `requires` |
| Location ↔ Permits | `attached-to` / `requires` |
| GeneratedOutput ↔ Source Documents | `generated-from` |
| GeneratedOutput ↔ Authority Records | `generated-from` / `references` |

Schema samples: `RELATIONSHIP_SCHEMA_REGISTRY`

---

## Query contracts (interfaces only)

| Query type | Purpose |
|------------|---------|
| `shoot-days-by-location` | All shoot days linked to a location |
| `scenes-by-shoot-day` | Scenes on a shoot day |
| `generated-outputs-by-callsheet-revision` | Outputs from callsheet source |
| `media-by-location` | Media attached to a location |
| `company-moves-by-shoot-day` | Company moves affecting a day |
| `generated-outputs-by-source-document` | Outputs by any source doc |
| `authority-records-by-generated-output` | Shoot day and other authority refs |

Future service: `RelationshipQueryService.execute(query)` — not implemented.

---

## Canonical paths (documentation only)

| pathId | Path |
|--------|------|
| `schedule-shootday-callsheet` | Shoot Schedule → Shoot Day → Callsheet |
| `schedule-shootday-transport` | Shoot Schedule → Shoot Day → Transport Order |
| `schedule-shootday-company-move` | Shoot Schedule → Shoot Day → Company Move |
| `scriptrevision-scene-shootday` | Script Revision → Scene → Shoot Day |
| `callsheetrevision-generated-output` | Callsheet Revision → Generated Output |

Full list: `CANONICAL_RELATIONSHIP_PATHS` in `relationship-path.ts`

**No path evaluation engine** in this phase.

---

## Imports

```ts
import {
  type PlatformRelationship,
  type RelationshipQuery,
  CANONICAL_RELATIONSHIP_PATHS,
  RELATIONSHIP_KIND_REGISTRY,
} from "@/types/core";
```

---

*Next phase (out of scope): graph persistence, query service, propagation engine migration.*
