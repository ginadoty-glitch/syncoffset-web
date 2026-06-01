# SyncOffset Source Document Ingestion

Version 1.0 — Type foundation (no extraction runtime)

**Governs:** Article I, IV, VI of [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md)

**Code:** `src/types/core/source/`, `src/types/core/generated/`, `src/types/core/relationships/`

---

## Principles

1. Original source documents are immutable.
2. Source files are preserved exactly as received (`SourceFileReference` + checksum).
3. Extraction may create core objects and outputs — never overwrite sources.
4. All derived records carry `RecordProvenance` / `SourceIngestionProvenance`.
5. `ShootDay` remains calendar authority (Article VII) — ingestion proposes links only; commits via `ShootDayAuthorityService` (future).

---

## Source documents (12 kinds)

| Kind | Type | Registry |
|------|------|----------|
| Script Revision | `ScriptRevisionSourceDocument` | `SOURCE_INGESTION_REGISTRY` |
| Shoot Schedule | `ShootScheduleSourceDocument` | ✓ |
| One-Liner | `OneLinerSourceDocument` | ✓ |
| Callsheet Revision | `CallsheetRevisionSourceDocument` | ✓ (source file; not `operations/callsheet-revision`) |
| Breakdown Package | `BreakdownPackageSourceDocument` | ✓ |
| Location Package | `LocationPackageSourceDocument` | ✓ |
| Crew List | `CrewListSourceDocument` | ✓ |
| Cast List | `CastListSourceDocument` | ✓ |
| DOOD | `DoodSourceDocument` | ✓ |
| Vendor Document | `VendorDocumentSourceDocument` | ✓ |
| Permit | `PermitSourceDocument` | ✓ |
| Reference Media | `ReferenceMediaSourceDocument` | ✓ |

All extend `ImmutableSourceDocument` → `AuditableCoreObject` with `kind: "document"`.

---

## Generated outputs (7 kinds)

| Kind | Type |
|------|------|
| Callsheet | `CallsheetGeneratedOutput` |
| DOOD | `DoodGeneratedOutput` |
| Crew List | `CrewListGeneratedOutput` |
| Cast List | `CastListGeneratedOutput` |
| Department Report | `DepartmentReportGeneratedOutput` |
| Logistics Package | `LogisticsPackageGeneratedOutput` |
| Brokerage Package | `BrokeragePackageGeneratedOutput` |

All extend `GeneratedOutput` with `kind: "generated-output"` and `RecordProvenance`.

---

## Imports

```ts
import {
  SOURCE_INGESTION_REGISTRY,
  type ScriptRevisionSourceDocument,
  type SourceSystem,
} from "@/types/core";

import {
  GENERATED_OUTPUT_REGISTRY,
  type CallsheetGeneratedOutput,
} from "@/types/core";
```

---

*Extraction services, storage, and UI are out of scope for v1 foundation.*
