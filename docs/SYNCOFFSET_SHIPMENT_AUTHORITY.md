# SyncOffset Shipment Authority

Version 1.0 — Constitutional foundation for movement, delivery, and availability

**Code:** `src/types/core/shipment/`

**Related:** [`SYNCOFFSET_PURCHASE_AUTHORITY.md`](./SYNCOFFSET_PURCHASE_AUTHORITY.md) · [`SYNCOFFSET_ASSET_AUTHORITY.md`](./SYNCOFFSET_ASSET_AUTHORITY.md) · [`SYNCOFFSET_LOCATION_AUTHORITY.md`](./SYNCOFFSET_LOCATION_AUTHORITY.md)

---

## Constitutional purpose

Shipment Authority governs **movement**.

A **Shipment** is the constitutional object representing movement of assets, purchases, documents, and production materials between locations.

| Phase | Meaning |
|-------|---------|
| **Purchase** | Creates **intent** |
| **Shipment** | Creates **movement** |
| **Delivery** | Creates **availability** |

---

## Critical constitutional rules

### Rule 1 — Purchase approval ≠ availability

**Purchase Order approval does NOT create availability.**

Budget and PO status document authorization to acquire — not on-set presence.

### Rule 2 — Delivery creates availability

**Shipment delivery** (status `delivered` / `partially-delivered`) is the constitutional signal that materials may become available for production use.

### Rule 3 — Asset assignment gate

**Assets may not be considered available for assignment** until a shipment has **delivered** them (or equivalent constitutional delivery event).

Asset Authority assignments consume this rule — no availability engine in this phase.

### Rule 4 — Movement history authority

**Shipment** (via **ShipmentEvent** records) is the **authoritative source** for movement history.

No parallel tracking store replaces shipment events.

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **Shipment** | `shipment` | Movement record |
| **ShipmentStop** | `shipment-stop` | Pickup, transfer, warehouse, broker, studio, delivery stop |
| **ShipmentEvent** | `shipment-event` | Immutable movement timeline (append-only semantics) |
| **ShipmentPackage** | `shipment-package` | Generated transport/delivery/POD docs |

---

## Shipment — required fields

| Field | Notes |
|-------|-------|
| `shipmentNumber` | e.g. SH-1042 |
| `shipmentName` | Production label |
| `purchaseOrderId` | **Required** — shipment may not exist without PO |
| `originLocationId`, `destinationLocationId` | Movement endpoints |
| `setId`, `setNumber` | Set trace (department coding) |
| `status` | `SHIPMENT_STATUS_REGISTRY` |
| `notes` | May be empty string |

---

## ShipmentStop — required fields

| Field | Notes |
|-------|-------|
| `shipmentId`, `stopNumber` | Ordered stops |
| `locationId` | Stop site |
| `arrivalPlanned`, `departurePlanned` | Planned window |
| `notes` | May be empty string |

---

## ShipmentEvent — required fields

| Field | Notes |
|-------|-------|
| `shipmentId` | Parent shipment |
| `eventType` | `SHIPMENT_EVENT_TYPE_REGISTRY` |
| `occurredAt` | Event timestamp |
| `notes` | May be empty string |

---

## ShipmentPackage — required fields

| Field | Notes |
|-------|-------|
| `shipmentId` | Parent shipment |
| `packageKind` | `SHIPMENT_PACKAGE_KIND_REGISTRY` |
| `generatedAt` | Issue time |

Kinds: `transport-package` · `delivery-package` · `pod-package` · `shipping-package` · `receiving-package`

---

## Lifecycle — `SHIPMENT_STATUS_REGISTRY`

`draft` · `scheduled` · `ready-for-pickup` · `picked-up` · `in-transit` · `at-stop` · `delivered` · `partially-delivered` · `returned` · `delayed` · `cancelled` · `lost` · `damaged`

Registry only — no tracking integrations or workflow engine.

---

## Canonical paths

| pathId | Path |
|--------|------|
| `purchase-to-delivery` | Budget → PO → Shipment → Asset → Set → Scene |
| `purchaseorder-shipment` | PO → Shipment |
| `shipment-lifecycle` | Shipment → Shipment Event |
| `delivery-chain` | Shipment → Stop → Location |

`SHIPMENT_CANONICAL_RELATIONSHIP_PATHS` · `SHIPMENT_RELATIONSHIP_SCHEMA_REGISTRY`

---

## Relationship graph

| From | To |
|------|-----|
| Purchase Order | Shipment (`shipment` **depends-on** `purchase-order`) |
| Shipment | Shipment Stop, Shipment Event, Shipment Package |
| Shipment | Vendor, Asset, Location, Return, Generated Output |
| Shipment Stop | Location |
| Shipment Package | Generated Output |

---

## Separation from Brokerage Authority

**Shipment governs movement.** **Brokerage Authority** governs customs legality, clearance, and commercial invoices.

| Topic | Authority |
|-------|-----------|
| Pickup, transit, delivery | Shipment |
| `customs-held` **ShipmentEvent** | Movement state only — **not** clearance |
| Commercial invoice, clearance packages | Brokerage |

See [`SYNCOFFSET_BROKERAGE_AUTHORITY.md`](./SYNCOFFSET_BROKERAGE_AUTHORITY.md).

---

## Purchasing vs receiving

| Authority | Role |
|-----------|------|
| **Purchase** | Authorizes acquisition |
| **Shipment** | Records movement and delivery state |
| **Receiving** | Confirmed by delivery status + events — not a separate workflow here |

---

## Out of scope

UI · routes · forms · Supabase · services · engines · workflow execution · tracking integrations · maps · barcode/QR

---

## Imports

```ts
import {
  type Shipment,
  type ShipmentStop,
  type ShipmentEvent,
  type ShipmentPackage,
  SHIPMENT_STATUS_REGISTRY,
  SHIPMENT_EVENT_TYPE_REGISTRY,
} from "@/types/core";
```
