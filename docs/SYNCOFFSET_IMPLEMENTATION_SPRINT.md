# SyncOffset Implementation Sprint

**Version:** 1.0  
**Status:** Phase 1 complete · Phase 2 next  
**Companion:** [`SYNCOFFSET_CONSTITUTION_AUDIT_V1.md`](./SYNCOFFSET_CONSTITUTION_AUDIT_V1.md) · [`SYNCOFFSET_NAMING_REGISTRY.md`](./SYNCOFFSET_NAMING_REGISTRY.md)

---

## Overview

Six-phase program from constitutional consolidation through agentic extraction and search. Phases 3–6 require Supabase, runtime pipelines, and ML — **out of scope** until Phase 1–2 complete.

| Phase | Focus | Status |
|-------|--------|--------|
| **1** | Critical audit remediation | **Active** |
| **2** | Document migration (canonical provenance) | Planned |
| **3** | Supabase persistence (types only, no business logic) | Planned |
| **4** | Upload pipeline | Planned |
| **5** | Agentic extraction | Planned |
| **6** | Search architecture | Planned |

---

## Phase 1 — Critical Audit Remediation

### Goals

1. Resolve `callsheet-revision` naming collisions  
2. Resolve `inventory-package` naming collisions  
3. Update `SYNCOFFSET_CORE_OBJECT_REGISTRY.md` to match code  
4. Eliminate dual-registry drift  
5. Single source of truth for relationship schemas  
6. Complete document path migration (remove deprecated graph terminals from active paths)

### Deliverables

| Deliverable | Location |
|-------------|----------|
| Naming registry | `docs/SYNCOFFSET_NAMING_REGISTRY.md` |
| Schema merge | `src/types/core/relationships/relationship-schema-merge.ts` |
| Legacy paths | `LEGACY_CANONICAL_RELATIONSHIP_PATHS` in `relationship-path.ts` |
| Document chains | `document-relationship-contracts.ts` + global paths |
| Core registry doc | `docs/SYNCOFFSET_CORE_OBJECT_REGISTRY.md` v2 |

### Success criteria

- [x] No **Critical** findings remain in Constitution Audit  
- [x] Authority docs reference naming registry where collisions existed  
- [x] No deprecated terminals in `CANONICAL_RELATIONSHIP_PATHS`  
- [x] `RELATIONSHIP_SCHEMA_REGISTRY` built only from authority `*_RELATIONSHIP_SCHEMA_REGISTRY` exports  

---

## Phase 2 — Document Migration

### Target model

```
SourceDocument (Article I file)
    ↓
DocumentRevision
    ↓
Document (logical record)
```

### Requirements

- All uploaded files → `source-document`  
- Extraction outputs → `document-revision`  
- Business objects link via `document` / `document-link`  
- Callsheet paths: `callsheet` core object, not source terminal  
- Brokerage, shipment, purchase, accounting, communication use document chain  

### Success criteria

- One canonical document architecture  
- No authority bypasses document provenance  

---

## Phase 3 — Supabase Wiring

**Persistence only** — no business logic, workflows, or engines.

### Wire (tables mirror constitutional types)

Assets · Inventory · Vendors · Locations · Documents · Purchase Orders · Shipments · Returns · Transport Orders · Work Orders · Communications

### Table contract

- UUID primary keys  
- Soft delete (`deleted_at`)  
- Audit fields (`created_by`, `created_at`, `modified_by`, `modified_at`)  
- FK relationship references to constitutional kinds  

### Success criteria

- Every constitutional object has a persistence target  
- No orphaned authorities without tables  

---

## Phase 4 — Upload Pipeline

### Flow

```
Upload → SourceDocument → DocumentRevision → Document → Review Queue
```

### Supported uploads (v1)

Script · Script Revision · Callsheet · Calendar · One-Liner · Commercial Invoice · Packing List · Bill of Lading · Receipt · Purchase Order · Permit · Insurance · Memo

### Success criteria

- Any production file can enter the system  
- Provenance preserved end-to-end  

---

## Phase 5 — Agentic Extraction

### Pipeline

```
Upload → Classify → Extract → Validate (constitution) → Draft Objects → Human Review → Publish
```

### Priority templates

1. Commercial Invoice  
2. Packing List  
3. Callsheet  
4. Receipt  
5. Purchase Order  
6. Script Revision  

### Example graphs

| Source | Draft objects |
|--------|----------------|
| Commercial Invoice | Vendor → PO → Shipment → Brokerage Record |
| Callsheet | Shoot Day → Locations → Cast → Crew |
| Receipt | Production Cost |

### Success criteria

- Coordinators review extracted data instead of manual entry  

---

## Phase 6 — Search Architecture

### Global search objects

Assets · Vendors · Locations · Documents · Shipments · Purchase Orders · Work Orders · Transport Orders · Communications · Scenes · Sets

### Modes (v1)

Keyword · Set Number · Asset Number · Vendor · PO Number · Shipment Number · Document Number

### Future

Semantic search · Document search · Production knowledge graph search

### Success criteria

- Locate any production object in under 3 clicks  

---

## Constitutional spine (all phases)

```
Script Revision → Scene → Set → Budget Requirement
  → Shooting Schedule → Production Calendar → Calendar Day
  → Shoot Day → Callsheet
```

Document provenance wraps **files**; authorities own **business objects**.

---

*Sprint plan v1.0 — update phase checkboxes as work completes.*
