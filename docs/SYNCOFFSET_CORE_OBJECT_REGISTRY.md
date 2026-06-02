# SyncOffset Core Object Registry

**Version:** 2.0 — synced with `src/types/core/kinds.ts` and `registry.ts` (Phase 1 remediation)

**Companions:** [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md) · [`SYNCOFFSET_NAMING_REGISTRY.md`](./SYNCOFFSET_NAMING_REGISTRY.md) · [`SYNCOFFSET_IMPLEMENTATION_SPRINT.md`](./SYNCOFFSET_IMPLEMENTATION_SPRINT.md)

**Code:** `CORE_OBJECT_REGISTRY` in `src/types/core/registry.ts` — **94 kinds**

---

## Rule

Every record in SyncOffset must belong to a `CoreObjectKind`.

- Core objects may reference other core objects via the relationship graph.
- Core objects may generate `generated-output` records.
- Core objects may **not** overwrite Article I source files (`source-document`).

---

## Production spine

```
Script Revision → Scene → Set → Budget Requirement
  → Shooting Schedule → Production Calendar → Calendar Day
  → Shoot Day → Callsheet
```

**Document provenance (all authorities):**

```
source-document → document-revision → document
```

---

## Calendar authority flags

| `isCalendarAuthority` | Kinds |
|----------------------|-------|
| **true** | `production-calendar`, `calendar-day` |
| **false** | `shoot-day`, `shooting-schedule`, `callsheet`, all others |

**Shoot Day is execution, not master planning.** Production Calendar owns **when**; Shooting Schedule owns **what** gets shot.

---

## Authority index

| Authority | Doc | Core kinds |
|-----------|-----|------------|
| Script | [`SYNCOFFSET_SCRIPT_AUTHORITY.md`](./SYNCOFFSET_SCRIPT_AUTHORITY.md) | `script`, `script-revision`, `revision-change`, `breakdown-element` |
| Scene | [`SYNCOFFSET_SCENE_AUTHORITY.md`](./SYNCOFFSET_SCENE_AUTHORITY.md) | `scene`, `set`, `budget-requirement`, `element` |
| Shooting Schedule | [`SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md`](./SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md) | `shooting-schedule`, `shooting-schedule-revision`, `shooting-schedule-package` |
| Production Calendar | [`SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md`](./SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md) | `production-calendar`, `calendar-day`, `calendar-revision`, `calendar-package` |
| Shoot Day | [`SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md`](./SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md) | `shoot-day`, `shootday-assignment`, `shootday-package` |
| Callsheet | [`SYNCOFFSET_CALLSHEET_AUTHORITY.md`](./SYNCOFFSET_CALLSHEET_AUTHORITY.md) | `callsheet`, `callsheet-revision`, `callsheet-distribution`, `callsheet-package` |
| Document | [`SYNCOFFSET_DOCUMENT_AUTHORITY.md`](./SYNCOFFSET_DOCUMENT_AUTHORITY.md) | `document`, `document-revision`, `document-package`, `document-link` |
| Source (Article I) | [`SYNCOFFSET_SOURCE_INGESTION.md`](./SYNCOFFSET_SOURCE_INGESTION.md) | `source-document` |
| Creative | [`SYNCOFFSET_CREATIVE_AUTHORITY.md`](./SYNCOFFSET_CREATIVE_AUTHORITY.md) | `director-note`, `creative-reference`, `department-package`, `tech-pack`, `approval-record` |
| Cast | [`SYNCOFFSET_CAST_AUTHORITY.md`](./SYNCOFFSET_CAST_AUTHORITY.md) | `character`, `cast-requirement`, `cast-member`, `cast-assignment` |
| Crew | [`SYNCOFFSET_CREW_AUTHORITY.md`](./SYNCOFFSET_CREW_AUTHORITY.md) | `crew-requirement`, `crew-member`, `crew-assignment` |
| Background | [`SYNCOFFSET_BACKGROUND_AUTHORITY.md`](./SYNCOFFSET_BACKGROUND_AUTHORITY.md) | `bg-requirement`, `background-performer`, `bg-assignment` |
| Location | [`SYNCOFFSET_LOCATION_AUTHORITY.md`](./SYNCOFFSET_LOCATION_AUTHORITY.md) | `location`, `location-requirement`, `location-package`, `location-assignment`, `permit` |
| Asset | [`SYNCOFFSET_ASSET_AUTHORITY.md`](./SYNCOFFSET_ASSET_AUTHORITY.md) | `asset`, `asset-instance`, `asset-assignment`, `asset-package` |
| Inventory | [`SYNCOFFSET_INVENTORY_AUTHORITY.md`](./SYNCOFFSET_INVENTORY_AUTHORITY.md) | `inventory-record`, `inventory-movement`, `inventory-audit`, `inventory-package` |
| Vendor | [`SYNCOFFSET_VENDOR_AUTHORITY.md`](./SYNCOFFSET_VENDOR_AUTHORITY.md) | `vendor`, `vendor-contact`, `vendor-agreement` |
| Purchase | [`SYNCOFFSET_PURCHASE_AUTHORITY.md`](./SYNCOFFSET_PURCHASE_AUTHORITY.md) | `purchase-order`, `purchase-line`, `purchase-package` |
| Shipment | [`SYNCOFFSET_SHIPMENT_AUTHORITY.md`](./SYNCOFFSET_SHIPMENT_AUTHORITY.md) | `shipment`, `shipment-stop`, `shipment-event`, `shipment-package` |
| Brokerage | [`SYNCOFFSET_BROKERAGE_AUTHORITY.md`](./SYNCOFFSET_BROKERAGE_AUTHORITY.md) | `brokerage-record`, `brokerage-line`, `brokerage-package` |
| Return | [`SYNCOFFSET_RETURN_AUTHORITY.md`](./SYNCOFFSET_RETURN_AUTHORITY.md) | `return`, `return-line`, `return-package` |
| Work Order | [`SYNCOFFSET_WORK_ORDER_AUTHORITY.md`](./SYNCOFFSET_WORK_ORDER_AUTHORITY.md) | `work-order`, `work-order-task`, `work-order-package` |
| Accounting | [`SYNCOFFSET_PRODUCTION_ACCOUNTING_AUTHORITY.md`](./SYNCOFFSET_PRODUCTION_ACCOUNTING_AUTHORITY.md) | `production-cost`, `department-cost`, `cost-report`, `cost-report-package` |
| Communication | [`SYNCOFFSET_COMMUNICATION_AUTHORITY.md`](./SYNCOFFSET_COMMUNICATION_AUTHORITY.md) | `communication`, `distribution-list`, `communication-package` |

---

## Show / season / episode

| Kind | Role |
|------|------|
| `show` | Top-level production |
| `season` | Season container |
| `episode` | Episode slating |
| `department` | Organizational department |

---

## Scheduling (legacy kinds)

Prefer **`calendar-day`** + `CALENDAR_DAY_TYPE_REGISTRY` for new work.

| Kind | Notes |
|------|-------|
| `prep-day` | Legacy — use `calendar-day` `dayType: prep` |
| `wrap-day` | Legacy — use `calendar-day` `dayType: wrap` |
| `company-move` | Company move day; links to location assignments |

---

## People

| Kind | Role |
|------|------|
| `person` | Base person (thin registry) |
| `stunt-performer` | Stunt performer (thin registry) |

Cast, crew, and background kinds — see authority docs above.

---

## Operations (registry only / cross-layer)

| Kind | Code status |
|------|-------------|
| `transport-order` | Core kind + graph edges; canonical type in `src/types/operations/transport-order.ts` |
| `generated-output` | Derived outputs — Article VI |
| `media` | Media attachments |
| `risk-evaluation` | **Derived only** — intelligence, not authoritative |

---

## Relationship graph

| Concept | Location |
|---------|----------|
| Merged schema | `RELATIONSHIP_SCHEMA_REGISTRY` ← authority `*_RELATIONSHIP_SCHEMA_REGISTRY` only |
| Merge implementation | `relationship-schema-merge.ts` |
| Active paths | `CANONICAL_RELATIONSHIP_PATHS` |
| Legacy paths | `LEGACY_CANONICAL_RELATIONSHIP_PATHS` (deprecated terminals) |

See [`SYNCOFFSET_RELATIONSHIP_GRAPH.md`](./SYNCOFFSET_RELATIONSHIP_GRAPH.md).

---

## Naming collisions (resolved)

See [`SYNCOFFSET_NAMING_REGISTRY.md`](./SYNCOFFSET_NAMING_REGISTRY.md):

- `callsheet-revision` — SourceDocumentKind vs CoreObjectKind  
- `inventory-package` — CoreObjectKind vs `asset-inventory-report` (AssetPackageKind)  
- `shoot-schedule` vs `shooting-schedule` — source vs core  

---

## Audit envelope (all `AuditableCoreObject`)

| Field | Purpose |
|-------|---------|
| `createdBy` / `createdAt` | Creation provenance |
| `modifiedBy` / `modifiedAt` | Last mutation |
| `sourceDocumentId` | Article I link where applicable |
| `status` | Lifecycle |
| `relationships` | Typed edge hints |

---

## Implementation map

| Layer | Path |
|-------|------|
| Constitutional types | `src/types/core/` |
| Operations (Workspace 04) | `src/types/operations/` |
| Legacy Shoot Day services | `src/types/core/services/` — **deprecated**; prefer `shootday/` |

**New objects:** register `CoreObjectKind` + `CORE_OBJECT_REGISTRY` entry + authority `*-relationship-contracts.ts` before UI or Supabase.

---

*v2.0 — matches code as of Phase 1 remediation. Machine registry: `registry.ts`.*
