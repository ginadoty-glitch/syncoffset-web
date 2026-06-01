# SyncOffset Core Object Registry

Version 1.0

**Companions:** [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md) · [`SYNCOFFSET_PLATFORM_WORKSPACES.md`](./SYNCOFFSET_PLATFORM_WORKSPACES.md) · TypeScript: `src/types/core/`

---

## Rule

Every record in SyncOffset must belong to a Core Object.

- Core Objects may reference other Core Objects.
- Core Objects may generate Outputs.
- Core Objects may **not** overwrite Source Documents.

---

## Production

### Show

**Purpose:** Top-level production entity.

**Relationships:** Seasons, Episodes, Shoot Days, Departments, Locations, Vendors, Assets

### Season

**Relationships:** Show, Episodes

### Episode

**Relationships:** Show, Scenes, Shoot Days

### Department

**Examples:** Production, Art, Set Dec, Props, Construction, Locations, Transportation, Costume, Makeup, Camera, Grip, Electric, Sound

---

## Scheduling

### ShootDay

**Platform authority object.**

**Owns:** Date, Call Time, Unit, Schedule State

**Relationships:** Scenes, Locations, Callsheets, Crew, Cast, Company Moves, Assets, Shipments

### PrepDay

**Relationships:** Department, ShootDay

### WrapDay

**Relationships:** Department, ShootDay

### CompanyMove

**Relationships:** ShootDay, Locations, Vehicles, Crew

---

## Script

### Script authority

See [`SYNCOFFSET_SCRIPT_AUTHORITY.md`](./SYNCOFFSET_SCRIPT_AUTHORITY.md). Types: `src/types/core/script/`

| Object | Kind |
|--------|------|
| ScriptRevision | `script-revision` |
| RevisionChange | `revision-change` |
| Scene | `scene` |
| BreakdownElement | `breakdown-element` |

### Script (parent)

**Relationships:** Revisions, Scenes

### Element (legacy)

**Types:** Prop, Vehicle, Costume, … — prefer `breakdown-element` for new work

**Relationships:** Scene

---

## People

### Person

Base object. **Subtypes:** Cast, Crew, Vendor Contact

### Cast authority (see [`SYNCOFFSET_CAST_AUTHORITY.md`](./SYNCOFFSET_CAST_AUTHORITY.md))

| Object | Kind |
|--------|------|
| Character | `character` |
| CastRequirement | `cast-requirement` |
| CastMember | `cast-member` |
| CastAssignment | `cast-assignment` |

### CastMember

**Relationships:** CastAssignment, Scene, ShootDay, GeneratedOutput — performer, not character

### BackgroundPerformer

**Relationships:** ShootDay, Scene, BgAssignment, GeneratedOutput

### BgRequirement

Production need from breakdown — **not a person**. **Relationships:** Scene, BreakdownElement, Element, BgAssignment, ScriptRevision

### BgAssignment

Bridge: performer ↔ requirement ↔ shoot day. **Relationships:** BackgroundPerformer, BgRequirement, ShootDay, Scene

See [`SYNCOFFSET_BACKGROUND_AUTHORITY.md`](./SYNCOFFSET_BACKGROUND_AUTHORITY.md).

### StuntPerformer

**Relationships:** Scene, ShootDay, Safety Documents

### Crew authority (see [`SYNCOFFSET_CREW_AUTHORITY.md`](./SYNCOFFSET_CREW_AUTHORITY.md))

| Object | Kind |
|--------|------|
| Department | `department` |
| CrewRequirement | `crew-requirement` |
| CrewMember | `crew-member` |
| CrewAssignment | `crew-assignment` |

### Department (organizational)

**Relationships:** CrewMember, CrewRequirement, DepartmentPackage, CrewAssignment

### CrewMember

**Relationships:** Department, CrewAssignment, ShootDay, GeneratedOutput

---

## Locations

### Location

**Relationships:** ShootDay, Scene, Permit, Media, CompanyMove

### Permit

**Relationships:** Location — **Immutable source**

---

## Assets

### Asset

Parent object. **Subtypes:** Prop, SetDecoration, Costume, Equipment, Vehicle

**Relationships:** Scene, Shipment, Vendor

---

## Vendors

### Vendor

**Relationships:** Assets, Orders, Shipments, Invoices

### PurchaseOrder

**Relationships:** Vendor, Assets, Budget Lines

---

## Operations

### TransportOrder

**Relationships:** ShootDay, Assets, Vendor, Shipment

### Shipment

**Relationships:** TransportOrder, Asset, Vendor, Location

### Return

**Relationships:** Asset, Vendor

---

## Documents

### Creative authority (see [`SYNCOFFSET_CREATIVE_AUTHORITY.md`](./SYNCOFFSET_CREATIVE_AUTHORITY.md))

| Object | Kind | Role |
|--------|------|------|
| DirectorNote | `director-note` | Creative instruction |
| CreativeReference | `creative-reference` | Mood boards, look books, concept art |
| DepartmentPackage | `department-package` | Department production intent |
| TechPack | `tech-pack` | Technical implementation files |
| ApprovalRecord | `approval-record` | Approval lifecycle |

### Document

Parent object. **Examples:** One-Liner, Callsheet, Schedule, Permit, Invoice — **Immutable**

### GeneratedOutput

**Relationships:** Source Documents, Source Records

**Examples:** Callsheet PDF, DOOD Report, Logistics Package, Brokerage Package

---

## Media

### Media

Parent object. **Subtypes:** Photo, Video, Audio, Daily, Reference

**Relationships:** Scene, ShootDay, Location, Asset, Person

---

## Intelligence

### RiskEvaluation

**Derived only. Never authoritative.**

**Generated from:** ShootDays, Locations, Assets, Shipments, Vendors

**Cannot mutate source records.**

---

## Relationship graph

Core objects are **authoritative**. Relationships **connect** them and must not become a second source of truth.

| Concept | Location |
|---------|----------|
| Graph edges | `PlatformRelationship` — `src/types/core/relationships/` |
| Embedded hints | `CoreRelationship` on `AuditableCoreObject.relationships[]` |
| Query contracts | `RelationshipQuery` (no service yet) |
| Propagation paths | `CANONICAL_RELATIONSHIP_PATHS` (documentation only) |

See [`SYNCOFFSET_RELATIONSHIP_GRAPH.md`](./SYNCOFFSET_RELATIONSHIP_GRAPH.md).

Future propagation may traverse the graph; existing `propagation.ts` in logistics is unchanged in this phase.

---

## Audit (required on every Core Object)

| Field | Purpose |
|-------|---------|
| `createdBy` | Actor at creation |
| `createdAt` | Timestamp |
| `modifiedBy` | Last mutating actor |
| `modifiedAt` | Last mutation |
| `sourceDocumentId` | Immutable source link (Art. I) |
| `sourceVersionId` | Extraction/revision version |
| `status` | Lifecycle state |
| `relationships` | Typed edges to other core objects |

---

## Implementation map (syncoffset-web)

| Registry object | Code status | Notes |
|-----------------|-------------|-------|
| `TransportOrder` | **Canonical type** | `src/types/operations/transport-order.ts` |
| `CallsheetRevision` | **Canonical type** (scheduling doc) | `src/types/operations/callsheet-revision.ts` — maps to issued callsheet lineage |
| `Shipment` | **UI mock name** | `shipment-data.ts` — migrate to `TransportOrder` + display alias |
| `Document` / `OwnedDocument` | **Partial** | `src/types/operations/shared.ts` — parent-owned docs, not global Media Hub |
| `RiskEvaluation` | **Derived** | `DerivedOrderState` in `propagation.ts` — not persisted |
| `ShootDay` | **Authority contracts** | `src/types/core/services/` — `ShootDay`, `ShootDayAuthorityService` |
| `BgRequirement`, `BgAssignment` | **Typed** | `src/types/core/background/` |
| Creative authority objects | **Typed** | `src/types/core/creative/` |
| Script authority objects | **Typed** | `src/types/core/script/` |
| Cast authority objects | **Typed** | `src/types/core/cast/` |
| Crew authority objects | **Typed** | `src/types/core/crew/` |
| `BackgroundPerformer` | **Typed** | `src/types/core/background/background-performer.ts` |
| `Show` … `Media` (other) | **Registry only** | `src/types/core/` — kinds + audit base; fixtures TBD |

### Operations layer vs core registry

- **`src/types/operations/`** — Detailed contracts for live Workspace 04 modules (transport, conditions, revisions).
- **`src/types/core/`** — Platform-wide object kinds, audit envelope, relationship vocabulary, registry metadata.

New objects must register a `CoreObjectKind` before UI or Supabase schemas are added.

### Immutable / derived flags

| Kind | Immutable source | Derived only | Calendar authority |
|------|------------------|--------------|-------------------|
| Document, Permit, Media | ✓ | | |
| ScriptRevision (source file) | ✓ | via `source/` ingestion | |
| ScriptRevision (authority) | | | |
| GeneratedOutput | | ✓ (output) | |
| RiskEvaluation | | ✓ | |
| ShootDay | | | ✓ |
| TransportOrder, Shipment | | | |

---

*Normative registry. Code registry: `CORE_OBJECT_REGISTRY` in `src/types/core/registry.ts`.*
