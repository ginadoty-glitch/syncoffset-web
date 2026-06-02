# SyncOffset Vendor Authority

Version 1.0 — Types and graph contracts only

**Workspace:** 08 Vendors & Purchasing

**Code:** `src/types/core/vendor/`

**Related:** [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md) · [`SYNCOFFSET_RELATIONSHIP_GRAPH.md`](./SYNCOFFSET_RELATIONSHIP_GRAPH.md)

---

## Constitutional objects

| Object | `CoreObjectKind` | Meaning |
|--------|------------------|---------|
| **Vendor** | `vendor` | Company or service provider (prop house, rental house, customs broker, …) |
| **VendorContact** | `vendor-contact` | Person at the vendor — not the vendor company |
| **VendorAgreement** | `vendor-agreement` | Standing production agreement or negotiated terms |

**Rule:** Vendor ≠ VendorContact ≠ VendorAgreement. Do not store people or contract terms only on the vendor record.

---

## Vendor

**Examples:** Prop House · Rental House · Customs Broker · Freight Forwarder · Shipping Carrier · Florist · Graphics Vendor · Construction Vendor · Transportation Vendor · Camera Vendor · Wardrobe Vendor

| Field | Notes |
|-------|-------|
| `vendorName` | Company name |
| `category` | `VENDOR_CATEGORY_REGISTRY` |
| `status` | active · preferred · on-hold · inactive · archived |
| `vendorContactIds[]`, `vendorAgreementIds[]`, `locationIds[]` | Graph membership |

---

## VendorContact

| Field | Notes |
|-------|-------|
| `vendorId` | Parent vendor |
| `contactName`, `role`, `contactInformation` | Dispatch, billing, customs, etc. |
| `isPrimary` | Primary production contact |

---

## VendorAgreement

Standing terms — **not** invoicing, payment, or accounting execution.

| Field | Notes |
|-------|-------|
| `agreementType` | master · rental · purchase · service · customs · transport |
| `effectiveDate`, `expirationDate` | Term window |
| `sourceDocumentId` | Immutable agreement PDF (Article I) |
| `termsSummary` | Human-readable summary |

**Out of scope:** payment runs, GL coding, invoice matching, payroll.

---

## Operational relationships (contracts only)

| From Vendor | To | Production use |
|-------------|-----|----------------|
| Vendor | Shipment | Carrier / forwarder on movement |
| Vendor | Transport Order | Transportation vendor on dispatch |
| Vendor | Brokerage Record | See [`SYNCOFFSET_BROKERAGE_AUTHORITY.md`](./SYNCOFFSET_BROKERAGE_AUTHORITY.md) |
| Vendor | Brokerage Package | Generated customs docs (`brokerage-package`) |
| Vendor | Purchase | `purchase-order` — see [`SYNCOFFSET_PURCHASE_AUTHORITY.md`](./SYNCOFFSET_PURCHASE_AUTHORITY.md) |
| Vendor | Rental | `purchase-order` with rental agreement provenance |
| Vendor | Return | Asset return to vendor |
| Vendor | Asset | Vendor-supplied asset custody |
| Vendor | Location | Location services, fees, site vendors |

Constants: `VENDOR_CANONICAL_RELATIONSHIP_PATHS` · `VENDOR_RELATIONSHIP_SCHEMA_REGISTRY`

---

## Imports

```ts
import {
  type Vendor,
  type VendorContact,
  type VendorAgreement,
  VENDOR_CATEGORY_REGISTRY,
  VENDOR_CANONICAL_RELATIONSHIP_PATHS,
} from "@/types/core";
```

---

*No UI, routes, Supabase, forms, scheduling, accounting, invoicing, payroll, or payments in this phase.*
