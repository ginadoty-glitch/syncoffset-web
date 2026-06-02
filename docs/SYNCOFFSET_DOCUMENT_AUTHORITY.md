# SyncOffset Document Authority v1.0

**Workspace 23** — constitutional source of truth for all production documents.

**Code:** `src/types/core/document/`

**Out of scope:** UI · uploads · OCR · AI · search · storage adapters · Supabase · workflows · notifications.

---

## Constitutional purpose

| Principle | Meaning |
|-----------|---------|
| **Document is first-class** | Not an attachment — a production object |
| **Every file resolves here** | Upload → `source-document` (Article I) → `document-revision` → `document` |
| **Platform-independent** | Outlook, Gmail, Apple Mail are delivery — not authority |

---

## Critical rules

### Rule 1 — Every upload becomes a Document

Uploaded files ingest as **`source-document`** (immutable) and resolve to **Document** + **DocumentRevision**.

### Rule 2 — Supports any authority

Documents may **reference** Scene, Set, Asset, Shipment, Vendor, etc. via **DocumentLink** — never owned by UI screens.

### Rule 3 — Immutable revision history

**DocumentRevision** is append-only provenance.

### Rule 4 — Production hierarchy trace

Documents support optional **`setId`**, **`setNumber`**, **`sceneId`** where applicable.

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **Document** | `document` | Logical production document |
| **DocumentRevision** | `document-revision` | Immutable revision |
| **DocumentPackage** | `document-package` | Generated collections |
| **DocumentLink** | `document-link` | Authority reference (no ownership) |

---

## Article I migration — `source-document`

| Before | After |
|--------|-------|
| `ImmutableSourceDocument.kind: "document"` | `kind: "source-document"` |
| Registry `document` (immutable) | `source-document` + Document Authority `document` |

**No runtime migration in this workspace** — types and registry only.

---

## Document — required fields

| Field | Notes |
|-------|-------|
| `documentNumber` | e.g. DOC-2401 |
| `title` | Display title |
| `categoryId` | `DOCUMENT_CATEGORY_REGISTRY` |
| `statusId` | `DOCUMENT_STATUS_REGISTRY` |
| `notes` | May be empty string |
| `setId?`, `setNumber?`, `sceneId?` | Rule 4 |

---

## DocumentRevision — required fields

| Field | Notes |
|-------|-------|
| `documentId` | Parent document |
| `revisionNumber` | Revision index |
| `createdAt` / `createdBy` | Provenance |
| `revisionColor?` | Production revision color |
| `sourceDocumentId?` | Article I ingestion link |

---

## DocumentPackage — package kinds

`document-package` · `distribution-package` · `archive-package` · `submission-package` · `production-package`

Examples in docs (not core kinds): `callsheet-package`, `calendar-package`, `brokerage-package`, `cost-report-package` — authority-specific **package kind strings** on those authorities.

---

## Registries

### `DOCUMENT_STATUS_REGISTRY`

`draft` · `review` · `approved` · `issued` · `superseded` · `archived`

### `DOCUMENT_CATEGORY_REGISTRY`

`script` · `script-revision` · `one-liner` · `calendar` · `callsheet` · `budget` · `cost-report` · `purchase-order` · `vendor-quote` · `commercial-invoice` · `packing-list` · `bill-of-lading` · `customs-form` · `pod` · `receipt` · `permit` · `insurance` · `location-agreement` · `reference` · `photo` · `drawing` · `map` · `contract` · `memo` · `other`

---

## Naming collisions (resolved)

See [`SYNCOFFSET_NAMING_REGISTRY.md`](./SYNCOFFSET_NAMING_REGISTRY.md) for the canonical disambiguation table.

| Identifier | Layer | Resolution |
|------------|-------|------------|
| `document` | **CoreObjectKind** | Document Authority logical record |
| `source-document` | **CoreObjectKind** | Article I `ImmutableSourceDocument` |
| `SourceDocumentKind` | Ingestion discriminator | Unchanged — not a core kind |
| `callsheet-revision` | Source vs core | Documented in Callsheet Authority |
| `document-revision` | Document Authority | Distinct from callsheet-revision |
| `document-package` | Document Authority core kind | Distinct from `callsheet-package`, `calendar-package`, etc. |
| `distribution-package` | Package kind id | Used on Communication, Document, Callsheet packages — disambiguate by type |
| **uploaded-file** | Informal term | Maps to `source-document` → `document-revision` |

---

## Relationship contracts

`DOCUMENT_CANONICAL_RELATIONSHIP_PATHS` · `DOCUMENT_RELATIONSHIP_SCHEMA_REGISTRY`

| pathId | Path |
|--------|------|
| `document-revision-history` | Document → Document Revision |
| `document-production-context` | Document → Scene / Set / Callsheet / Calendar |
| `document-logistics-context` | Document → Shipment / Return / Asset |
| `document-financial-context` | Document → PO / Vendor / Brokerage |
| `document-package-output` | Document → Document Package → Generated Output |
| `source-ingestion-document` | Source Document → Document Revision |

---

*Types, registries, and relationship contracts only.*
