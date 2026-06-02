# SyncOffset Asset Authority

Version 1.1 — Constitutional foundation for purchasing, shipments, returns, inventory, and logistics

**Workspace:** 04 Assets

**Code:** `src/types/core/asset/`

**Related:** [`SYNCOFFSET_SCENE_AUTHORITY.md`](./SYNCOFFSET_SCENE_AUTHORITY.md) · [`SYNCOFFSET_PRODUCTION_HIERARCHY.md`](./SYNCOFFSET_PRODUCTION_HIERARCHY.md) · [`SYNCOFFSET_VENDOR_AUTHORITY.md`](./SYNCOFFSET_VENDOR_AUTHORITY.md)

---

## Constitutional purpose

An **Asset** is a physical production item required to support a **Set**.

| Rule | Meaning |
|------|---------|
| Assets **do not** belong directly to Scenes | No constitutional ownership on `Scene` |
| Assets **belong to** Sets | Required `setId` + `setNumber` |
| Sets **support** Scenes | Scene → Set → Asset only |
| Department + set number | Production accounting tracks `departmentId` + `setNumber` |

---

## Production hierarchy

```
Source
    ↓
Script
    ↓
Scene
    ↓
Breakdown
    ↓
Budget Requirement
    ↓
Set
    ↓
Asset
    ↓
Purchase Order (Purchase Authority) · Vendor · Shipment · Return · Shoot Day
```

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **Asset** | `asset` | Production item (Desk, Chair, Picture Vehicle, Rifle Prop, …) |
| **AssetInstance** | `asset-instance` | Tracked unit (Desk A, Desk B, …) |
| **AssetAssignment** | `asset-assignment` | Deployment to scene / shoot day / location |
| **AssetPackage** | `asset-package` | Generated documentation (reports, prep/strike/return packages) |

---

## Asset (`asset`)

### Required fields

| Field | Notes |
|-------|-------|
| `id`, `kind` | Via `AuditableCoreObject` |
| `assetNumber` | Production asset identifier |
| `assetName` | e.g. Police Desk, Hospital Bed |
| `categoryId` | `ASSET_CATEGORY_REGISTRY` |
| `departmentId` | Owning department |
| `setId`, `setNumber` | **Set ownership** + constitutional set-number trace |
| `status` | `ASSET_STATUS_REGISTRY` |
| `notes` | Production notes (may be empty string) |

### Provenance (capability, not engine)

Every asset must be **capable** of tracing:

```
Asset → Set → Budget Requirement → Breakdown Element → Scene → Script Revision
```

Optional FKs: `budgetRequirementId`, `breakdownElementId`.

---

## AssetInstance (`asset-instance`)

| Field | Notes |
|-------|-------|
| `assetId` | Parent asset |
| `setId`, `setNumber` | Set trace |
| `instanceLabel` | Desk A, Desk B, … |
| `serialNumber?`, `locationId?`, `vendorId?` | Unit tracking |
| `status` | Instance lifecycle |

---

## AssetAssignment (`asset-assignment`)

Deployment — not ownership.

| Field | Notes |
|-------|-------|
| `assetId`, `setId`, `setNumber` | Required set binding |
| `sceneId?` | Optional scene consumption (via set) |
| `shootDayId?`, `locationId?` | Calendar / staging |

---

## AssetPackage (`asset-package`)

Generated asset documentation — **not** workflows.

| `packageKind` | Examples |
|---------------|----------|
| `asset-report` | Asset Report |
| `asset-inventory-report` | Asset Inventory Report (not core `inventory-package`) |
| `prep-package` | Prep Package |
| `strike-package` | Strike Package |
| `return-package` | Return Package |

Links: `sourceDocumentIds[]`, `generatedOutputIds[]`, `mediaIds[]`.

---

## Lifecycle (`ASSET_STATUS_REGISTRY`)

`requested` · `quoted` · `approved` · `ordered` · `picked-up` · `in-transit` · `received` · `installed` · `on-set` · `wrapped` · `returned` · `lost` · `damaged` · `disposed`

Registry only — no automation in this phase.

---

## Categories (`ASSET_CATEGORY_REGISTRY`)

Props · Set Decoration · Construction · Graphics · Greens · Picture Vehicles · Special Effects · Weapons · Furniture · Electronics · Wardrobe Support · Makeup Support · Camera Support · Lighting Support · Grip Support · Custom

---

## Set ownership

> Assets belong to Sets. Not Scenes. Scenes consume Sets.

`AssetAssignment.sceneId` documents **deployment** only — ownership remains on `setId`.

---

## Department ownership

> Production accounting tracks assets by **department** and **set number**.

Required on every `Asset`: `departmentId`, `setId`, `setNumber`.

---

## Set-number tracking

`setNumber` mirrors `ProductionSet.setNumber` (e.g. SET 101, SET 205).

Purchases, rentals, returns, shipments, and logistics records must trace back to this identifier.

---

## Relationship graph

| Path | Connection |
|------|------------|
| Set → Asset | `attached-to` |
| Asset → Asset Instance | `derived-from` |
| Asset → Vendor | `references` |
| Asset → Location | `occurs-at` |
| Asset → Budget Requirement | `references` |
| Asset → Purchase Order | `derived-from` |
| Asset → Shipment | via `asset-assignment` `depends-on` |
| Asset → Return | `assigned-to` |
| Asset → Shoot Day | via `asset-assignment` `scheduled-on` |
| Asset → Asset Package | `attached-to` |
| Scene → Set → Asset | indirect only |

`ASSET_CANONICAL_RELATIONSHIP_PATHS` · `ASSET_RELATIONSHIP_SCHEMA_REGISTRY`

---

## Imports

```ts
import {
  type Asset,
  type AssetInstance,
  type AssetAssignment,
  type AssetPackage,
  ASSET_CATEGORY_REGISTRY,
  ASSET_STATUS_REGISTRY,
} from "@/types/core";
```

---

## Out of scope

Inventory UI · barcodes · QR · scanning · Supabase · logistics/purchase/shipment/return **workflows**

---

*Types, registries, relationship contracts, and documentation only.*
