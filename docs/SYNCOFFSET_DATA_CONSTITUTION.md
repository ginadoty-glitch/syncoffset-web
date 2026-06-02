# SyncOffset Data Constitution

Version 1.0

**Companion documents:**

- [`SYNCOFFSET_CORE_OBJECT_REGISTRY.md`](./SYNCOFFSET_CORE_OBJECT_REGISTRY.md) — canonical object kinds and relationships
- [`SYNCOFFSET_SOURCE_INGESTION.md`](./SYNCOFFSET_SOURCE_INGESTION.md) — immutable sources, provenance, generated outputs (types)
- [`SYNCOFFSET_RELATIONSHIP_GRAPH.md`](./SYNCOFFSET_RELATIONSHIP_GRAPH.md) — graph edges, queries, canonical paths (types)
- [`SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md`](./SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md) — Shoot Day execution authority (constitutional)
- [`SYNCOFFSET_SHOOTDAY_AUTHORITY.md`](./SYNCOFFSET_SHOOTDAY_AUTHORITY.md) — legacy service contracts (deprecated)
- [`SYNCOFFSET_BACKGROUND_AUTHORITY.md`](./SYNCOFFSET_BACKGROUND_AUTHORITY.md) — BG requirement, performer, assignment (Workspace 06)
- [`SYNCOFFSET_CREATIVE_AUTHORITY.md`](./SYNCOFFSET_CREATIVE_AUTHORITY.md) — creative packages, tech packs, approvals (Media Hub / departments)
- [`SYNCOFFSET_PRODUCTION_HIERARCHY.md`](./SYNCOFFSET_PRODUCTION_HIERARCHY.md) — normative production flow (source → shoot day)
- [`SYNCOFFSET_SCRIPT_AUTHORITY.md`](./SYNCOFFSET_SCRIPT_AUTHORITY.md) — script revision, breakdown provenance
- [`SYNCOFFSET_SCENE_AUTHORITY.md`](./SYNCOFFSET_SCENE_AUTHORITY.md) — scene, set, budget requirement (central hub)
- [`SYNCOFFSET_CAST_AUTHORITY.md`](./SYNCOFFSET_CAST_AUTHORITY.md) — character, cast requirement, member, assignment
- [`SYNCOFFSET_CREW_AUTHORITY.md`](./SYNCOFFSET_CREW_AUTHORITY.md) — department, crew requirement, member, assignment
- [`SYNCOFFSET_VENDOR_AUTHORITY.md`](./SYNCOFFSET_VENDOR_AUTHORITY.md) — vendor, contact, agreement (Workspace 08)
- [`SYNCOFFSET_ASSET_AUTHORITY.md`](./SYNCOFFSET_ASSET_AUTHORITY.md) — asset, requirement, assignment on sets (Workspace 04)
- [`SYNCOFFSET_PURCHASE_AUTHORITY.md`](./SYNCOFFSET_PURCHASE_AUTHORITY.md) — purchase order, line, package (Workspace 08)
- [`SYNCOFFSET_SHIPMENT_AUTHORITY.md`](./SYNCOFFSET_SHIPMENT_AUTHORITY.md) — shipment, stop, event, package (movement)
- [`SYNCOFFSET_BROKERAGE_AUTHORITY.md`](./SYNCOFFSET_BROKERAGE_AUTHORITY.md) — brokerage record, line, package (customs)
- [`SYNCOFFSET_RETURN_AUTHORITY.md`](./SYNCOFFSET_RETURN_AUTHORITY.md) — return record, line, package (recovery)
- [`SYNCOFFSET_PLATFORM_WORKSPACES.md`](./SYNCOFFSET_PLATFORM_WORKSPACES.md) — where data is consumed in the UI
- [`SYNCOFFSET_LAYOUT_CONSTITUTION.md`](./SYNCOFFSET_LAYOUT_CONSTITUTION.md) — how surfaces present data (no replacement of source truth)

---

## Purpose

SyncOffset shall preserve original production information while transforming, relating, distributing, and operationalizing that information throughout the platform.

No generated output may replace its source.

Every generated output must be traceable to the source records that produced it.

---

## ARTICLE I — SOURCE PRESERVATION

A source document is immutable.

**Examples:**

- Script, Script Revision, One-Liner, Shooting Schedule, Day Out Of Days
- Callsheet, Crew List, Cast List, Vendor List, Deal Memo
- Location Agreement, Permit, Purchase Order, Invoice, Receipt
- Customs Document, Asset Report, Daily Production Report
- Photo, Video, Audio Recording

Source documents are never overwritten.

Revisions create new versions.

The platform preserves:

- Original file
- Upload date
- Author
- Version history
- Relationships
- Extraction history

---

## ARTICLE II — CORE OBJECTS

Everything in SyncOffset shall resolve to one or more core objects.

### Production

- Show, Season, Episode, Unit, Department

### Scheduling

- Shoot Day, Prep Day, Wrap Day, Company Move, Holiday, Milestone

### Script & Scene

- Script, Revision, Scene (Scene Authority), Breakdown Element, Budget Requirement
- See [`SYNCOFFSET_PRODUCTION_HIERARCHY.md`](./SYNCOFFSET_PRODUCTION_HIERARCHY.md)

### Sets (production containers)

- Set (`set`) — supports scenes; **not** a location subtype. See Scene Authority.

### People

- Cast Member, Background Performer, Stand-In, Stunt Performer, Crew Member, Vendor Contact

### Locations

- Location, Stage, Parking Area, Holding Area (physical sites — distinct from production **Set** containers)

### Assets

- Asset, Prop, Set Decoration, Costume, Vehicle, Equipment

### Vendors

- Vendor, Rental House, Service Provider, Broker

### Logistics

- Shipment, Transport Order, Pickup, Delivery, Return, Damage Event

### Documents

- Document, Attachment, Generated Output

### Media

- Photo, Video, Audio, Reference Image, Daily

---

## ARTICLE III — RELATIONSHIPS

Objects exist through relationships.

**Examples:**

| From | To |
|------|-----|
| Scene | Shoot Day, Location, Cast Member, Asset |
| Shoot Day | Callsheet, Company Move |
| Location | Permit |
| Asset | Vendor |
| Vendor | Shipment |
| Photo | Scene |
| Video | Shoot Day |
| Crew Member | Department |
| Background Performer | Shoot Day |

No object exists in isolation.

**Implementation:** `src/types/core/relationships/` — `PlatformRelationship`, `RelationshipQuery`, `CANONICAL_RELATIONSHIP_PATHS`. Objects hold truth; edges hold links only.

---

## ARTICLE IV — DOCUMENT INGESTION

Documents are sources. Documents generate records.

| Source | Generates (examples) |
|--------|----------------------|
| One-Liner | Shoot Days, Locations, Scenes, Company Moves |
| Shooting Schedule | Shoot Days, Cast Requirements, Department Requirements |
| Callsheet | Call Times, Locations, Crew Calls, Cast Calls |

Original document remains untouched. Generated records remain linked to source.

---

## ARTICLE V — MEDIA INGESTION

**Documents:** PDF, DOCX, XLSX, CSV, TXT

**Images:** JPG, PNG, HEIC, TIFF, PSD

**Video:** MP4, MOV, MXF, ProRes

**Audio:** WAV, MP3, AAC

**Production data:** Movie Magic exports, Scenechronize exports, scheduling exports, budget exports

All media may be attached to: Shows, Shoot Days, Scenes, Locations, Assets, People, Vendors.

---

## ARTICLE VI — GENERATED OUTPUTS

Outputs are derived products. Outputs are never sources.

**Examples:** Callsheets, Department Reports, Logistics Orders, Vendor Packages, Brokerage Packages, Asset Reports, DOOD Reports, Crew Lists, Cast Lists, Risk Reports, Budget Reports.

Every output shall contain references to the records and sources used to generate it.

---

## ARTICLE VII — CALENDAR AUTHORITY

The Production Calendar is the operational backbone.

The calendar owns: Shoot Days, Prep Days, Wrap Days, Company Moves, Location Occupancy, Department Schedules.

Changes to calendar records propagate to dependent records.

| Calendar change | Propagates to |
|-----------------|---------------|
| Shoot Day change | Callsheets, Logistics, Crew Calls, Vendor Deliveries, Asset Requirements |

**Implementation:** `ShootDayAuthorityService` and related contracts in `src/types/core/services/`. ShootDay is the sole calendar authority object; generated outputs are consumers only. See [`SYNCOFFSET_SHOOTDAY_AUTHORITY.md`](./SYNCOFFSET_SHOOTDAY_AUTHORITY.md).

---

## ARTICLE VIII — DEPARTMENT LENSES

Departments do not own data. Departments view data.

| Department | Views |
|------------|-------|
| Art | Scenes, Assets, Locations, Deliveries |
| Transportation | Company Moves, Vehicles, Deliveries |
| Locations | Permits, Occupancy, Restrictions |
| Accounting | Vendors, Receipts, Invoices |

All departments view the same underlying records.

---

## ARTICLE IX — INTELLIGENCE

The Intelligence Layer does not create records. It evaluates records.

**Examples:** Schedule conflicts, permit expiration, missing assets, missing approvals, vendor delays, budget overruns, crew turnaround violations, location conflicts, company move risks.

Intelligence produces recommendations. Users approve actions.

---

## ARTICLE X — AUDITABILITY

Every record shall maintain:

- Created By, Created Date
- Modified By, Modified Date
- Source Document, Source Version
- Relationship History

No operational change shall become orphaned from its source.

---

## ARTICLE XI — PLATFORM PRINCIPLE

Information enters once. Relationships are established once. Outputs are generated many times.

The platform preserves the original truth while distributing operational knowledge to every department that requires it.

This principle supersedes convenience, duplication, and temporary workflows.

---

## Implementation alignment (syncoffset-web v1)

*Architecture snapshot — not a compliance certification. Mock data and template modules exist outside this model.*

### Articles already reflected in code

| Article | Current expression | Location |
|---------|-------------------|----------|
| I (immutable sources) | `CallsheetRevision` — `isImmutableAfterIssue`, supersede chain, append-only `revisionLog` | `src/types/operations/callsheet-revision.ts` |
| III (relationships) | `linkedConditionIds`, `linkedTransportOrderIds`, `affectedOrderIds` on conditions | `operational-data.ts`, `operational-condition.ts` |
| VI (derived outputs) | `DerivedOrderState` — computed, not stored | `src/lib/operations/propagation.ts` |
| VII (calendar propagation) | Callsheet revision → conditions → transport impact | `computeRevisionImpact`, logistics UI banners |
| IX (intelligence) | Propagation engine + intelligence rail; no record creation | `propagation.ts`, `operational-intelligence.tsx` |
| X (auditability) | `RevisionLogEntry`, `DeptAcknowledgmentRecord` types (mock partial fill) | `callsheet-revision.ts` |

### Gaps to close before production data layer

| Article | Gap |
|---------|-----|
| I | No `Document` entity with file hash, upload metadata, or extraction history in DB |
| II | Core object registry in `src/types/core/`; `TransportOrder` in `types/operations`; UI still uses `Shipment` mock alias |
| IV | Source ingestion **types** in `src/types/core/source/`; extraction runtime not implemented |
| V | Media Hub workspace not implemented; attachments on orders are mock refs |
| VI | Generated outputs (callsheets, reports) lack `sourceRefs[]` on output records |
| VII | No `ShootDay` object or calendar service — revision mock stands in for calendar authority |
| VIII | Department lens = UI filter/tabs only, not shared query layer |
| X | `createdBy` / `modifiedBy` not on mock shipments; brokerage events lack full audit chain |

### Dependency rule (preserve)

`src/lib/operations/propagation.ts` imports logistics fixture modules. Any move to shared data services must keep **read-only** propagation over relationship graphs — Article IX forbids intelligence mutating sources.

### Workspace mapping (data flow)

| Workspace | Primary sources (Art. I) | Primary objects (Art. II) | Generated outputs (Art. VI) |
|-----------|-------------------------|---------------------------|----------------------------|
| 01 Calendar | Schedules, DOOD, one-liner | Shoot Day, Company Move | Tasks, feeds, callsheet inputs |
| 02 Breakdown | Script revisions | Scene, Element | Asset/location/cast requirements |
| 03 Callsheet Studio | Calendar + DOOD + availability | Shoot Day (anchor) | Callsheet PDF, distribution |
| 04 Operations | Calendar, POs, breakdown | Transport Order, Shipment, Document | Runsheets, customs packages |
| 05 Media Hub | All immutable files | Document, Media | Previews only (not sources) |
| 06 Cast & Crew | Lists, deal memos | People objects | Rosters, DOOD reports |
| 07 Locations | Agreements, permits | Location, Permit | Restriction notices, moves |
| 08 Vendors | POs, contracts | Vendor | Orders, deliveries |
| 09 Finance | Budget, invoices | (lines via PO/receipt) | Cost reports, variance |
| 10 Intelligence | — | — | Recommendations only (Art. IX) |

### Target schema principle (future Supabase)

```
sources (immutable documents)
  → extractions (versioned, linked to source_id)
    → core_objects (normalized records, source_id + extraction_id)
      → relationships (edge table, typed)
        → generated_outputs (source_refs[], never written back to sources)
          → intelligence_evaluations (derived flags, user_actions)
```

### UI constitution linkage

- **Layout:** IntelligencePanel and StatusStrip display Article IX evaluations; they must not edit Article I sources inline.
- **Layout:** DetailPanel tabs may show **links** to source documents (Media Hub), not inline overwrite of PDFs/scripts.
- **Workspaces:** Department Lens views (Art. VIII) are filters on the same `core_objects` — not duplicate tables per department.

---

*Status: Normative platform law. Implementation tracked via operations types, propagation engine, and future ingestion services.*
