# SyncOffset Production Accounting Authority v1.0

**Workspace 21** — production spend tracking (not corporate accounting).

**v1.1 (budgeting & forecasting):** [`SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1.md`](./SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1.md) — show/episode/set/department rollups, forecast amounts, film budget categories.

**Code:** `src/types/core/accounting/`

**Out of scope:** UI · routes · QuickBooks · Sage · Xero · payroll · AP/AR · invoicing · payment processors · Supabase · tax · bookkeeping workflows.

---

## Constitutional purpose

Production Accounting tracks **where the money goes** on a show:

| Dimension | Meaning |
|-----------|---------|
| **Planned Cost** | Budget-driven expectation |
| **Committed Cost** | PO / obligation |
| **Actual Cost** | Real spend |
| **Variance** | Planned vs actual (and committed rollups) |

| This authority is | This authority is NOT |
|-----------------|----------------------|
| Production execution economics | Corporate accounting |
| Set / department / scene traceability | Payroll |
| Constitutional cost objects | Tax reporting |
| Cost reports for producers | QuickBooks, Sage, ERP **authorities** (integrations only — Rule 5) |

---

## Production hierarchy

```
Script Revision
    ↓
Scene
    ↓
Set
    ↓
Budget Requirement
    ↓
Purchase Order
    ↓
Production Cost
    ↓
Department Cost
    ↓
Cost Report
```

---

## Critical rules

### Rule 1 — Set traceability

All costs must trace to a **Set** — `setId` and `setNumber` are **required** on **ProductionCost** and **DepartmentCost**.

### Rule 2 — Budget = planned

**Budget Requirements** create **planned** spend — not actual spend.

### Rule 3 — PO = committed

**Purchase Orders** create **commitments** — not actual spend until reflected on **Production Cost**.

### Rule 4 — Production Cost = real spending

**Production Cost** represents real production spending (`plannedAmount`, `committedAmount`, `actualAmount`).

### Rule 5 — Corporate accounting is external

QuickBooks, Sage, Xero, and ERP systems are **integrations**, not SyncOffset authorities.

### Rule 6 — Reports summarize only

**Cost Reports** summarize production reality — they **do not approve** spending.

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **ProductionCost** | `production-cost` | Line-level production expense |
| **DepartmentCost** | `department-cost` | Department rollup + variance |
| **CostReport** | `cost-report` | Weekly / department / set / variance reports |
| **CostReportPackage** | `cost-report-package` | Generated report documentation |

---

## ProductionCost — required fields

| Field | Notes |
|-------|-------|
| `costNumber` | e.g. PC-2401 |
| `description` | Expense label |
| `setId`, `setNumber` | **Required** (Rule 1) |
| `departmentId` | Spending department |
| `budgetRequirementId` | Budget provenance |
| `plannedAmount` / `committedAmount` / `actualAmount` | Production economics |
| `statusId` | `ACCOUNTING_STATUS_REGISTRY` |
| `notes` | May be empty string |

Optional trace: `vendorId`, `purchaseOrderId`, `assetId`, `transportOrderId`, `shootDayId`.

---

## DepartmentCost — required fields

| Field | Notes |
|-------|-------|
| `departmentId` | Art, Set Dec, Props, Construction, Locations, Transportation, … |
| `setId`, `setNumber` | **Required** |
| `budgetRequirementId` | Budget anchor |
| `plannedAmount` / `committedAmount` / `actualAmount` | Rollups |
| `varianceAmount` | Planned vs actual (and committed context) |

---

## CostReport — required fields

| Field | Notes |
|-------|-------|
| `reportNumber` | Report identifier |
| `reportDate` | ISO date |
| `notes` | May be empty string |

Optional: `setId`, `departmentId`, `revisionColor` (production revision colors).

**Examples:** Weekly Cost Report · Department Cost Report · Set Cost Report · Variance Report

---

## CostReportPackage — required fields

| Field | Notes |
|-------|-------|
| `costReportId` | Parent report |
| `packageKind` | `COST_REPORT_PACKAGE_KIND_REGISTRY` |
| `generatedAt` | Issue timestamp |

**Kinds:** `cost-report-package` · `department-cost-package` · `variance-package` · `producer-package`

---

## Registries

### `ACCOUNTING_STATUS_REGISTRY`

`draft` · `planned` · `committed` · `actualized` · `reported` · `closed`

---

## Relationship contracts

`ACCOUNTING_CANONICAL_RELATIONSHIP_PATHS` · `ACCOUNTING_RELATIONSHIP_SCHEMA_REGISTRY`

| pathId | Path |
|--------|------|
| `budget-to-cost` | Budget Requirement → Production Cost → Department Cost → Cost Report |
| `procurement-to-cost` | Purchase Order → Production Cost |
| `logistics-to-cost` | Transport Order → Production Cost |
| `execution-cost` | Shoot Day → Production Cost |
| `cost-report-package-output` | Cost Report → Cost Report Package → Generated Output |

### Required edges

| Edge |
|------|
| `budget-requirement` → `production-cost` |
| `purchase-order` → `production-cost` |
| `vendor` → `production-cost` |
| `asset` → `production-cost` |
| `transport-order` → `production-cost` |
| `shoot-day` → `production-cost` |
| `production-cost` → `department-cost` |
| `department-cost` → `cost-report` |
| `cost-report` → `cost-report-package` |
| `cost-report-package` → `generated-output` |

---

*Types, registries, and relationship contracts only.*
