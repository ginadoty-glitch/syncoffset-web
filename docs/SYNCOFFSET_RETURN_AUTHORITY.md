# SyncOffset Return Authority

Version 1.0 — Constitutional foundation for recovery, strike, and closeout

**Code:** `src/types/core/return/`

**Related:** [`SYNCOFFSET_PURCHASE_AUTHORITY.md`](./SYNCOFFSET_PURCHASE_AUTHORITY.md) · [`SYNCOFFSET_SHIPMENT_AUTHORITY.md`](./SYNCOFFSET_SHIPMENT_AUTHORITY.md) · [`SYNCOFFSET_BROKERAGE_AUTHORITY.md`](./SYNCOFFSET_BROKERAGE_AUTHORITY.md) · [`SYNCOFFSET_ASSET_AUTHORITY.md`](./SYNCOFFSET_ASSET_AUTHORITY.md)

---

## Constitutional purpose

| Authority | Governs |
|-----------|---------|
| **Purchase** | Acquisition |
| **Shipment** | Movement |
| **Return** | **Recovery** — strike, closeout, disposal, vendor/asset returns |

---

## Critical constitutional rules

### Rule 1 — Ownership ≠ return completion

**Asset ownership** (on a Set) **does not imply** return completion.

### Rule 2 — Return completion is authoritative

**Return** status (`returned`, `closed`, …) is the constitutional signal for recovery completion.

### Rule 3 — Returned ≠ vendor acceptance

**Returned** status does **not** imply vendor acceptance or credit — vendor confirmation is out of scope here.

### Rule 4 — Recovery history authority

**ReturnRecord** and **ReturnLine** / **ReturnPackage** membership is the **authoritative source** for recovery history.

### Rule 5 — Cross-border returns

Cross-border returns **must** reference **Brokerage Authority** (`brokerageRecordId`).

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **ReturnRecord** | `return` | Vendor return, asset return, production closeout |
| **ReturnLine** | `return-line` | Individual returned item |
| **ReturnPackage** | `return-package` | Generated return documentation |

TypeScript: `ReturnRecord` (avoids collision with JS `return` keyword in some contexts).

---

## ReturnRecord — required fields

| Field | Notes |
|-------|-------|
| `returnNumber`, `returnName` | Production identifiers |
| `vendorId` | Receiving vendor / rental house |
| `setId`, `setNumber` | Set trace |
| `status` | `RETURN_STATUS_REGISTRY` |
| `notes` | May be empty string |

Optional: `purchaseOrderId`, `shipmentId`, `brokerageRecordId` (required for cross-border per Rule 5).

---

## ReturnLine — required fields

| Field | Notes |
|-------|-------|
| `returnId` | Parent return |
| `description`, `quantity` | Line detail |
| `notes` | May be empty string |
| `assetId?` | Set-bound asset when applicable |

---

## ReturnPackage — required fields

| Field | Notes |
|-------|-------|
| `returnId` | Parent return |
| `packageKind` | `RETURN_PACKAGE_KIND_REGISTRY` |
| `generatedAt` | Issue timestamp |

**Naming note:** `return-package` package kind id is distinct from core kind `return-package` and from brokerage `return-package` **package kind** on `BrokeragePackage`.

---

## Lifecycle — `RETURN_STATUS_REGISTRY`

`draft` · `scheduled` · `picked` · `loaded` · `in-transit` · `returned` · `partially-returned` · `closed` · `cancelled` · `lost` · `damaged`

Registry only — no workflow engine.

---

## Canonical paths

| pathId | Path |
|--------|------|
| `asset-recovery` | Asset → Return |
| `rental-closeout` | Purchase Order → Asset → Return |
| `return-logistics` | Return → Shipment |
| `cross-border-return` | Return → Brokerage Record |

`RETURN_CANONICAL_RELATIONSHIP_PATHS` · `RETURN_RELATIONSHIP_SCHEMA_REGISTRY`

---

## Relationship graph (canonical direction)

| From | To |
|------|-----|
| Return | Return Line, Return Package |
| Return | Asset, Vendor, Shipment, Purchase Order, Brokerage Record |
| Return | Generated Output |
| Return Package | Generated Output |
| Return Line | Asset (optional) |

Legacy edges (`asset` → `return`, `vendor` → `return`, …) are **deprecated** in favor of Return-centric edges.

---

## Imports

```ts
import {
  type ReturnRecord,
  type ReturnLine,
  type ReturnPackage,
  RETURN_STATUS_REGISTRY,
  RETURN_PACKAGE_KIND_REGISTRY,
} from "@/types/core";
```

---

*No UI, routes, Supabase, services, workflow engines, or vendor integrations in this phase.*
