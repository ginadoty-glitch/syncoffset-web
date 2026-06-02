# SyncOffset Relationship Graph

Version 1.0 — Type foundation (no graph service, no DB)

**Governs:** Article III of [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md)

**Code:** `src/types/core/relationships/`

**Related:** [`SYNCOFFSET_CORE_OBJECT_REGISTRY.md`](./SYNCOFFSET_CORE_OBJECT_REGISTRY.md) · [`SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md`](./SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md) · [`SYNCOFFSET_RETURN_AUTHORITY.md`](./SYNCOFFSET_RETURN_AUTHORITY.md) · [`SYNCOFFSET_BROKERAGE_AUTHORITY.md`](./SYNCOFFSET_BROKERAGE_AUTHORITY.md) · [`SYNCOFFSET_SHIPMENT_AUTHORITY.md`](./SYNCOFFSET_SHIPMENT_AUTHORITY.md) · [`SYNCOFFSET_PURCHASE_AUTHORITY.md`](./SYNCOFFSET_PURCHASE_AUTHORITY.md) · [`SYNCOFFSET_SCENE_AUTHORITY.md`](./SYNCOFFSET_SCENE_AUTHORITY.md) · [`SYNCOFFSET_PRODUCTION_HIERARCHY.md`](./SYNCOFFSET_PRODUCTION_HIERARCHY.md) · [`SYNCOFFSET_SOURCE_INGESTION.md`](./SYNCOFFSET_SOURCE_INGESTION.md)

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
| Script Revision → Scene | `derived-from` |
| Scene → Breakdown Element | `derived-from` |
| Scene → Budget Requirement | `derived-from` |
| Scene → Set | `references` |
| Scene → Location Requirement | `derived-from` |
| Scene → Crew / Cast / BG Requirement | `derived-from` |
| Scene → Shoot Day | `scheduled-on` |
| Scene ↔ Location | `occurs-at` |
| Scene ↔ Cast | `assigned-to` |
| Scene → Set → Asset | `references` / `attached-to` (no direct Scene → Asset) |
| Asset → Budget Requirement | `references` |
| Asset → Asset Instance | `derived-from` |
| Asset → Asset Package | `attached-to` |
| Set → Asset | `attached-to` |
| Asset Assignment → Shoot Day | `scheduled-on` |
| Set → Asset / Location | `references` / `attached-to` |
| Budget Requirement → Purchase Order | `derived-from` |
| Purchase Order → Vendor / Set / Department | `references` / `assigned-to` |
| Purchase Order → Purchase Line / Package | `derived-from` / `attached-to` |
| Purchase Line → Asset | `references` |
| Purchase Order → Shipment | `depends-on` (from shipment) |
| Shipment → Stop / Event / Package | `derived-from` / `attached-to` |
| Shipment → Vendor / Asset / Location / Return / Output | various |
| Shipment Stop → Location | `occurs-at` |
| Shipment Package → Generated Output | `generated-from` |
| Shipment → Brokerage Record | `derived-from` |
| Brokerage Record → Line / Package / Vendor / Asset / PO / Return | various |
| Brokerage Package → Generated Output | `generated-from` |
| Return → Line / Package / Asset / Vendor / Shipment / PO / Brokerage | canonical Return Authority |
| Return Package → Generated Output | `generated-from` |
| Purchase Order → Return (closeout) | via `rental-closeout` path |
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
| `generated-outputs-by-callsheet` | Outputs for constitutional `callsheet` (preferred) |
| `generated-outputs-by-callsheet-revision` | **Deprecated** — source-document id only |
| `media-by-location` | Media attached to a location |
| `company-moves-by-shoot-day` | Company moves affecting a day |
| `generated-outputs-by-source-document` | Outputs by any source doc |
| `authority-records-by-generated-output` | Shoot day and other authority refs |

Future service: `RelationshipQueryService.execute(query)` — not implemented.

---

## Canonical paths (documentation only)

**Active:** `CANONICAL_RELATIONSHIP_PATHS` — includes `full-production-timeline`, `source-document-chain`, `callsheet-document-chain`, procurement/logistics document chains.

**Legacy (deprecated):** `LEGACY_CANONICAL_RELATIONSHIP_PATHS` — `schedule-shootday-callsheet`, `callsheetrevision-generated-output`.

**Schema:** `RELATIONSHIP_SCHEMA_REGISTRY` is merged from authority `*_RELATIONSHIP_SCHEMA_REGISTRY` exports (`relationship-schema-merge.ts`).

Full lists: `relationship-path.ts`

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
