# SyncOffset Production Accounting Authority v1.1

**Enhancement pass** — real-world film budgeting and forecasting.

**Code:** `src/types/core/accounting/`

**Companion (v1.0 baseline):** [`SYNCOFFSET_PRODUCTION_ACCOUNTING_AUTHORITY.md`](./SYNCOFFSET_PRODUCTION_ACCOUNTING_AUTHORITY.md)

**v1.1.1 (stress-test patch):** [`SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md`](./SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md) — NTF ladder, `paidAmount`, allocation lines, contingency snapshot.

**Out of scope:** QuickBooks · Sage · Xero · payroll · AP/AR · tax · UI · reporting screens · Supabase · workflows · calculation engines.

---

## Constitutional purpose

SyncOffset must always answer:

**“Where are we financially right now?”**

at four **production-native** levels:

| Level | Constitutional object | Rollup role |
|-------|----------------------|-------------|
| **Production** | `show` | Entire show / feature |
| **Episode** | `episode` | Episodic unit (optional for single-unit features) |
| **Set** | `set` | Physical production container (`setNumber`) |
| **Department** | `department` | Spending department (Art, Props, Locations, …) |

Financials follow **production activity** — not calendar months, fiscal quarters, or ERP periods.

---

## Financial vocabulary

| Term | Meaning |
|------|---------|
| **Planned** | Budget-driven expectation (`budget-requirement`) |
| **Committed** | PO / obligation (`purchase-order`) |
| **Actual** | Real spend (receipts, invoices via `document`) |
| **Forecast** | Estimate-to-complete at time of record |
| **EFC** | Estimate final cost (optional on line) |
| **Variance** | Planned / forecast vs actual (on rollups) |

| This authority is | This authority is NOT |
|-------------------|----------------------|
| Producer-facing production economics | Corporate GL |
| Set / episode / department traceability | Payroll |
| Constitutional cost objects | QuickBooks “authority” |

---

## Rollup ladder (Rule 1)

```
Production (show)
    ↓
Episode (episode)          ← optional for features
    ↓
Set (set + setNumber)
    ↓
Department (department)
    ↓
ProductionCost (line)
    ↓
DepartmentCost (rollup)
    ↓
CostReport (scoped summary)
```

**Not:**

```
January → February → March   ✗
```

Use `ProductionCostPhase` (`prep`, `principal-photography`, `wrap`, …) and `ForecastHorizon` (`current-week`, `through-wrap`, …) instead of fiscal months.

---

## Critical rules

### Rule 1 — Production activity drives rollups

Financials roll up through **show → episode → set → department**, using existing graph objects.

### Rule 2 — Every ProductionCost must support

| Dimension | Field | Required |
|-----------|-------|----------|
| Production | `showId` | **Yes** |
| Episode | `episodeId` | **Yes** for episodic; omit for single-unit features |
| Set | `setId`, `setNumber` | **Yes** |
| Department | `departmentId` | **Yes** |
| Budget line | `costCategoryId` | **Yes** — `PRODUCTION_COST_CATEGORY_REGISTRY` |
| Phase | `costPhaseId` | **Yes** — `PRODUCTION_COST_PHASE_REGISTRY` |
| Currency | `currencyCode` | **Yes** — e.g. `USD` |
| Amounts | `plannedAmount`, `committedAmount`, `actualAmount`, `forecastAmount` | **Yes** |
| EFC | `estimateFinalCost` | Optional |
| Budget provenance | `budgetRequirementId` | **Yes** |
| Scene trace | `sceneId` | Optional |

### Rule 3 — Purchase Order = committed

**Purchase Orders** create **commitments** reflected in `committedAmount` — not `actualAmount` until receipt/invoice is actualized.

### Rule 4 — Shoot Day = execution spend

**Shoot Day** activity may spawn or reference **Production Cost** lines for execution-day economics.

### Rule 5 — Document = actual provenance

**Receipts** and **invoices** resolve through **Document Authority** (`document` → `production-cost`). No authority bypasses document provenance.

### Rule 6 — Logistics and customs flow to cost

**Shipment**, **Brokerage Record**, and **Return** may derive **Production Cost** lines (movement and recovery economics).

### Rule 7 — Cost Reports summarize only

**CostReport** records answer “where are we now?” at `reportScope` (`production` | `episode` | `set` | `department`). Reports **do not approve** spending.

### Rule 8 — Corporate accounting is external

QuickBooks, Sage, Xero, and ERP systems remain **integrations** — not SyncOffset authorities.

---

## Objects (unchanged kinds, v1.1 fields)

| Object | `CoreObjectKind` | v1.1 enhancement |
|--------|------------------|------------------|
| **ProductionCost** | `production-cost` | Full dimensional + forecast amounts |
| **DepartmentCost** | `department-cost` | `showId`, `episodeId`, variance fields |
| **CostReport** | `cost-report` | `reportScope`, `forecastHorizon`, `showId`, rollup amounts |
| **CostReportPackage** | `cost-report-package` | Unchanged — documentation export |

No new core kinds in v1.1 — rollups use **show**, **episode**, **set**, **department** already in the graph.

---

## Registries (v1.1)

| Registry | File |
|----------|------|
| `PRODUCTION_FINANCIAL_ROLLUP_REGISTRY` | `accounting-rollup.ts` |
| `COST_REPORT_SCOPE_REGISTRY` | `accounting-rollup.ts` |
| `FORECAST_HORIZON_REGISTRY` | `accounting-rollup.ts` |
| `PRODUCTION_COST_CATEGORY_REGISTRY` | `accounting-category.ts` |
| `PRODUCTION_COST_PHASE_REGISTRY` | `accounting-phase.ts` |
| `ACCOUNTING_STATUS_REGISTRY` | `accounting-status.ts` (v1.0) |
| `COST_REPORT_PACKAGE_KIND_REGISTRY` | `cost-report-package.ts` (v1.0) |

---

## ProductionCost — required fields (v1.1)

| Field | Notes |
|-------|-------|
| `costNumber` | e.g. PC-2401 |
| `description` | Line label |
| `showId` | Production (Rule 1) |
| `episodeId?` | Episode when episodic |
| `setId`, `setNumber` | Set (Rule 1) |
| `departmentId` | Department (Rule 1) |
| `budgetRequirementId` | Budget anchor |
| `costCategoryId` | ATL/BTL/department category |
| `costPhaseId` | prep / shoot / post / … |
| `currencyCode` | ISO currency code |
| `plannedAmount` / `committedAmount` / `actualAmount` / `forecastAmount` | Rule 2 |
| `estimateFinalCost?` | Optional EFC |
| `statusId` | `ACCOUNTING_STATUS_REGISTRY` |
| `notes` | May be empty string |

**Optional provenance:** `sceneId`, `vendorId`, `purchaseOrderId`, `assetId`, `transportOrderId`, `shootDayId`, `shipmentId`, `brokerageRecordId`, `returnId`, `documentId`.

---

## DepartmentCost — required fields (v1.1)

| Field | Notes |
|-------|-------|
| `showId` | Production rollup |
| `episodeId?` | Episode rollup |
| `departmentId` | Department |
| `setId`, `setNumber` | Set |
| `budgetRequirementId` | Budget anchor |
| `plannedAmount` / `committedAmount` / `actualAmount` / `forecastAmount` | Aggregated |
| `varianceToPlanned` / `varianceToForecast` | Documented variance (computed elsewhere) |
| `productionCostIds` | Member lines |

---

## CostReport — required fields (v1.1)

| Field | Notes |
|-------|-------|
| `reportNumber` | Report id |
| `reportDate` | ISO date |
| `reportScope` | `production` \| `episode` \| `set` \| `department` |
| `forecastHorizon` | Production-relative forecast window |
| `showId` | **Required** |
| `episodeId?` | When scope ≥ episode |
| `setId?` | When scope = set |
| `departmentId?` | When scope = department |
| `plannedAmount` / `committedAmount` / `actualAmount` / `forecastAmount` | Position snapshot |
| `notes` | May be empty string |

**Examples:** Production Hot Cost · Episode Financial Summary · Set 101 Cost Report · Art Department Weekly

---

## Relationship contracts

`ACCOUNTING_CANONICAL_RELATIONSHIP_PATHS` · `ACCOUNTING_RELATIONSHIP_SCHEMA_REGISTRY`

| pathId | Path |
|--------|------|
| `production-financial-rollup` | show → episode → set → department → production-cost |
| `budget-to-cost` | Budget → Production Cost → Department Cost → Cost Report |
| `procurement-to-cost` | PO → Production Cost |
| `shipment-to-cost` | Shipment → Production Cost |
| `brokerage-to-cost` | Brokerage → Production Cost |
| `return-to-cost` | Return → Production Cost |
| `receipt-document-cost` | Document → Production Cost |
| `episode-cost-report` | Episode → Department Cost → Cost Report |

---

## Answering “where are we financially right now?”

| Question | Query shape (future) | Constitutional objects |
|----------|----------------------|------------------------|
| Whole show? | `cost-report` where `reportScope: production` + `showId` | show, department-cost, production-cost |
| One episode? | `reportScope: episode` + `episodeId` | episode, set, department-cost |
| One set? | `reportScope: set` + `setId` | set, production-cost lines |
| One department on a set? | `reportScope: department` + `setId` + `departmentId` | department, department-cost |

---

## Imports

```ts
import {
  type ProductionCost,
  type DepartmentCost,
  type CostReport,
  PRODUCTION_COST_CATEGORY_REGISTRY,
  PRODUCTION_FINANCIAL_ROLLUP_REGISTRY,
  ACCOUNTING_CANONICAL_RELATIONSHIP_PATHS,
} from "@/types/core";
```

---

*v1.1 — types, registries, relationships, and constitutional accounting logic only.*
