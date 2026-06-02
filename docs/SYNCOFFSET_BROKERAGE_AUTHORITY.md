# SyncOffset Brokerage Authority

Version 1.0 — Constitutional foundation for customs, import/export, and clearance

**Code:** `src/types/core/brokerage/`

**Related:** [`SYNCOFFSET_SHIPMENT_AUTHORITY.md`](./SYNCOFFSET_SHIPMENT_AUTHORITY.md) · [`SYNCOFFSET_VENDOR_AUTHORITY.md`](./SYNCOFFSET_VENDOR_AUTHORITY.md) · [`SYNCOFFSET_PURCHASE_AUTHORITY.md`](./SYNCOFFSET_PURCHASE_AUTHORITY.md)

---

## Constitutional purpose

| Authority | Governs |
|-----------|---------|
| **Shipment** | **Movement** |
| **Brokerage** | **Legality** — customs, import, export, clearance, border documentation |

Brokerage Authority is **separate from Shipment Authority**. Shipment must not absorb customs clearance, commercial invoices, or broker workflows.

---

## Critical constitutional rules

### Rule 1 — Movement ≠ clearance

**Shipment movement** (including `customs-held` **ShipmentEvent** types) **does not imply** customs clearance.

Movement events document physical/logistical state — not legal clearance.

### Rule 2 — Clearance ≠ delivery

**Brokerage clearance** (`cleared` / `partially-cleared`) **does not imply** shipment delivery or asset availability.

Delivery remains Shipment Authority (Rules 2–3 in Shipment doc).

### Rule 3 — Customs history authority

**BrokerageRecord** (and line/package membership) is the **authoritative source** for customs history.

### Rule 4 — Commercial Invoice origin

**Commercial Invoice** is generated from **Brokerage Authority** (`commercial-invoice` package kind) — **not** Shipment Authority.

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **BrokerageRecord** | `brokerage-record` | Customs / import / export file |
| **BrokerageLine** | `brokerage-line` | Declared item |
| **BrokeragePackage** | `brokerage-package` | Generated customs documentation |

---

## BrokerageRecord — required fields

| Field | Notes |
|-------|-------|
| `brokerageNumber`, `brokerageName` | File identifiers |
| `shipmentId` | Parent movement (legality follows movement) |
| `vendorId` | Customs broker / forwarder |
| `setId`, `setNumber` | Production set trace |
| `status` | `BROKERAGE_STATUS_REGISTRY` |
| `notes` | May be empty string |

---

## BrokerageLine — required fields

| Field | Notes |
|-------|-------|
| `brokerageRecordId` | Parent file |
| `description`, `quantity` | Declared item |
| `countryOfOrigin`, `declaredValue` | Customs fields — not accounting GL |
| `notes` | May be empty string |
| `assetId?` | When line maps to set-bound asset |

---

## BrokeragePackage — required fields

| Field | Notes |
|-------|-------|
| `brokerageRecordId` | Parent file |
| `packageKind` | `BROKERAGE_PACKAGE_KIND_REGISTRY` |
| `generatedAt` | Issue timestamp |

**Package kinds:** `commercial-invoice` · `broker-package` · `customs-package` · `export-package` · `import-package` · `clearance-package` · `return-package`

---

## Lifecycle — `BROKERAGE_STATUS_REGISTRY`

`draft` · `review` · `pending-documents` · `submitted` · `under-review` · `cleared` · `partially-cleared` · `held` · `returned` · `cancelled`

Registry only — no customs APIs or workflow engine.

---

## Canonical paths

| pathId | Path |
|--------|------|
| `import-chain` | PO → Shipment → Brokerage Record → Asset |
| `customs-clearance` | Shipment → Brokerage Record → Brokerage Package |
| `return-import-export` | Asset → Return → Brokerage Record |

`BROKERAGE_CANONICAL_RELATIONSHIP_PATHS` · `BROKERAGE_RELATIONSHIP_SCHEMA_REGISTRY`

---

## Relationship graph

| From | To |
|------|-----|
| Shipment | Brokerage Record |
| Brokerage Record | Brokerage Line, Brokerage Package |
| Brokerage Record | Vendor, Asset, Purchase Order, Return, Generated Output |
| Brokerage Package | Generated Output |

---

## Provenance (documentation only)

```
Purchase Line → Purchase Order → Budget Requirement → Set → Scene → Script Revision
        ↓
    Shipment (movement)
        ↓
    Brokerage Record (legality)
        ↓
    Brokerage Line → Asset
```

---

## Purchasing vs accounting

`declaredValue` is a **customs declaration field** — not invoices, payments, or GL (future Production Accounting Authority).

---

## Out of scope

UI · routes · Supabase · customs APIs · workflow engines · PDF generation · receiving workflows

---

## Imports

```ts
import {
  type BrokerageRecord,
  type BrokerageLine,
  type BrokeragePackage,
  BROKERAGE_STATUS_REGISTRY,
  BROKERAGE_PACKAGE_KIND_REGISTRY,
} from "@/types/core";
```
