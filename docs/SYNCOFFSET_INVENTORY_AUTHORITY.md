# SyncOffset Inventory Authority v1.0

**Workspace 22** — possession, availability, location, condition, and provenance for production assets.

**Code:** `src/types/core/inventory/`

**Out of scope:** UI · routes · Supabase · services · workflows · automation · business logic · APIs · state management.

---

## Constitutional purpose

| Authority | Owns |
|-----------|------|
| **Asset** | Identity — what the item is |
| **Inventory** | Possession — where it is, how many, condition, availability |

Establishes **possession**, **availability**, **location tracking**, **condition tracking**, and **inventory provenance** for all production assets.

---

## Critical rules

### Rule 1 — Identity vs possession

**Asset** stores **identity**. **Inventory** stores **possession**.

### Rule 2 — Operational state on Inventory

**Current location**, **quantity**, **condition**, and **availability** belong to **Inventory Authority** — never Asset Authority.

### Rule 3 — Set traceability

All inventory must remain traceable to **Set** via **`setId`** and **`setNumber`**.

### Rule 4 — Immutable movement provenance

**Inventory movement history** is **immutable provenance** (append-only at service layer).

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **InventoryRecord** | `inventory-record` | Current possession state |
| **InventoryMovement** | `inventory-movement` | Movement provenance |
| **InventoryAudit** | `inventory-audit` | Location audit |
| **InventoryPackage** | `inventory-package` | Generated documentation |

---

## InventoryRecord — required fields

| Field | Notes |
|-------|-------|
| `assetId` | Asset identity (Rule 1) |
| `setId`, `setNumber` | **Required** (Rule 3) |
| `locationId` | Current location (Rule 2) |
| `quantity` | On-hand quantity |
| `conditionId` | `INVENTORY_CONDITION_REGISTRY` |
| `statusId` | `INVENTORY_STATUS_REGISTRY` |

---

## InventoryMovement — required fields

| Field | Notes |
|-------|-------|
| `assetId` | Asset moved |
| `fromLocationId` / `toLocationId` | Movement endpoints |
| `timestamp` | Movement time |
| `transportOrderId?` | Optional logistics link |
| `shipmentId?` | Optional shipment link |

---

## InventoryAudit — required fields

| Field | Notes |
|-------|-------|
| `locationId` | Audited location |
| `auditDate` | ISO date |
| `performedBy` | Auditor identity |

---

## InventoryPackage — required fields

| Field | Notes |
|-------|-------|
| `packageKind` | `INVENTORY_PACKAGE_KIND_REGISTRY` |
| `generatedAt` | Issue timestamp |
| `setId`, `setNumber` | Set trace |

Documentation generation only — no delivery workflow.

---

## Registries

### `INVENTORY_STATUS_REGISTRY`

`in-stock` · `allocated` · `on-set` · `in-transit` · `checked-out` · `missing` · `damaged` · `retired`

### `INVENTORY_CONDITION_REGISTRY`

`new` · `excellent` · `good` · `fair` · `poor` · `damaged` · `unserviceable`

### `INVENTORY_PACKAGE_KIND_REGISTRY`

`inventory-report-package` · `audit-package` · `movement-history-package` · `availability-package` · `set-inventory-package`

---

## Relationship contracts

`INVENTORY_CANONICAL_RELATIONSHIP_PATHS` · `INVENTORY_RELATIONSHIP_SCHEMA_REGISTRY`

| pathId | Path |
|--------|------|
| `asset-inventory` | Asset → Inventory Record |
| `inventory-movement-history` | Inventory Record → Inventory Movement |
| `inventory-audit` | Location → Inventory Audit → Inventory Record |
| `inventory-execution` | Set → Inventory Record → Shoot Day |
| `inventory-package-output` | Inventory Package → Generated Output |

---

## Naming collision — Asset Authority

| Identifier | Layer | Meaning |
|------------|-------|---------|
| `asset-inventory-report` | **AssetPackageKind** | Asset-side inventory report (see Naming Registry) |
| `inventory-package` | **CoreObjectKind** | Inventory Authority package object |

Use `InventoryPackageKind` vs `CoreObjectKind` to disambiguate. Prefer **Inventory Authority** for possession reports.

---

## Asset Authority coexistence

`asset-instance` and `asset-assignment` may reference deployment — **current possession state** is authoritative on **`inventory-record`** (Rule 2). Future services should read location/quantity/condition from Inventory, not Asset.

---

*Types, registries, and relationship contracts only.*
