# SyncOffset Purchase Authority

Version 1.0 — Constitutional foundation for procurement, receiving, shipment, return, and future accounting

**Workspace:** 08 Vendors & Purchasing (constitutional types)

**Code:** `src/types/core/purchase/`

**Related:** [`SYNCOFFSET_ASSET_AUTHORITY.md`](./SYNCOFFSET_ASSET_AUTHORITY.md) · [`SYNCOFFSET_VENDOR_AUTHORITY.md`](./SYNCOFFSET_VENDOR_AUTHORITY.md) · [`SYNCOFFSET_PRODUCTION_HIERARCHY.md`](./SYNCOFFSET_PRODUCTION_HIERARCHY.md)

---

## Constitutional purpose

Purchase Authority governs how productions **acquire** goods and services.

It is the **bridge between planning and execution**:

```
Budget Requirement
    ↓
Purchase Order
    ↓
Vendor
    ↓
Asset (optional)
    ↓
Shipment
    ↓
Return
```

| Rule | Meaning |
|------|---------|
| A **Purchase Order** may exist **without** an Asset | Service buys, deposits, fees |
| An **Asset** may **not** exist without a **Set** | Asset Authority |
| A **Shipment** may **not** exist without a **Purchase Order** | `shipment` **depends-on** `purchase-order` |
| **PO approval does not create availability** | See Shipment Authority Rule 1 |
| **Shipment delivery creates availability** | See Shipment Authority Rules 2–3 |

---

## Production hierarchy

```
Source → Script → Scene → Breakdown → Budget Requirement → Set → Asset → Purchase Order → Vendor
```

### Provenance (capability — no engine)

```
Purchase Line
    ↓
Purchase Order
    ↓
Budget Requirement
    ↓
Set
    ↓
Scene
    ↓
Script Revision
```

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **PurchaseOrder** | `purchase-order` | PO-245, PO-391, … |
| **PurchaseLine** | `purchase-line` | Desk, lumber package, wardrobe buy, … |
| **PurchasePackage** | `purchase-package` | Generated buyer/vendor/receiving docs |

---

## PurchaseOrder — required fields

| Field | Notes |
|-------|-------|
| `purchaseOrderNumber` | e.g. PO-245 |
| `showCode` | e.g. MOW104, FeatureA |
| `departmentId` | Art, Construction, … |
| `setId`, `setNumber` | Set spend trace |
| `vendorId` | Supplier |
| `budgetRequirementId` | Budget provenance |
| `status` | `PURCHASE_ORDER_STATUS_REGISTRY` |
| `notes` | May be empty string |

---

## PurchaseLine — required fields

| Field | Notes |
|-------|-------|
| `purchaseOrderId` | Parent PO |
| `description` | Line label |
| `quantity`, `unitCost` | Commercial terms — **not** GL accounting |
| `notes` | May be empty string |
| `assetId?` | When line fulfills a set-bound asset |

---

## PurchasePackage

| `packageKind` | Example |
|---------------|---------|
| `purchase-summary` | Purchase Summary |
| `vendor-package` | Vendor Package |
| `buyer-package` | Buyer Package |
| `purchase-department-package` | Department Package (not creative `department-package`) |
| `receiving-package` | Receiving Package (documentation only — no receiving workflow) |

Required: `purchaseOrderId`, `packageKind`, `generatedAt`

---

## Lifecycle (`PURCHASE_ORDER_STATUS_REGISTRY`)

`draft` · `quoted` · `approved` · `issued` · `partially-received` · `received` · `closed` · `cancelled`

Registry only — no approval or receiving engine.

---

## Department coding

All purchases support:

```
showCode + departmentId + setId (+ setNumber)
```

Production coordinators track:

```
Show → Department → Set Number → Purchase Order
```

Examples:

- MOW104 · Art · Set 101 · PO-245  
- FeatureA · Construction · Set 205 · PO-391  

---

## Set ownership

Spend and fulfillment trace to **Set** — not directly to Scene.

`PurchaseOrder.setId` / `setNumber` are required.

---

## Purchasing vs accounting

**Purchasing is not accounting.**

Out of scope (future **Production Accounting Authority**):

- Invoices · Bills · Payments · Checks · Credits · Taxes · GL accounts

`unitCost` on lines is a **commercial field** — not a ledger posting.

---

## Purchasing vs receiving

| Phase | Authority | This phase |
|-------|-----------|------------|
| **Purchasing** | Authorizes acquisition | Purchase Authority (types only) |
| **Receiving** | Confirms arrival | Future Shipment Authority — **not modeled here** |

`partially-received` / `received` statuses document lifecycle vocabulary only.

---

## Relationship graph

| From | To |
|------|-----|
| Purchase Order | Vendor, Budget Requirement, Set, Department |
| Purchase Order | Purchase Line, Purchase Package |
| Purchase Line | Asset |
| Purchase Order | Shipment (required parent) |
| Purchase Order | Return, Generated Output |

`PURCHASE_CANONICAL_RELATIONSHIP_PATHS` · `PURCHASE_RELATIONSHIP_SCHEMA_REGISTRY`

---

## Imports

```ts
import {
  type PurchaseOrder,
  type PurchaseLine,
  type PurchasePackage,
  PURCHASE_ORDER_STATUS_REGISTRY,
} from "@/types/core";
```

---

*No UI, Supabase, APIs, approval engines, accounting, or receiving workflows.*
