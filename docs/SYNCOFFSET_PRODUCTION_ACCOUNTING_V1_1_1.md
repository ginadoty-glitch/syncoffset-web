# SyncOffset Production Accounting Authority v1.1.1

**Constitutional patch** — closes gaps from [`SYNCOFFSET_PRODUCTION_ACCOUNTING_STRESS_TEST.md`](./SYNCOFFSET_PRODUCTION_ACCOUNTING_STRESS_TEST.md).

**Code:** `src/types/core/accounting/`

**Companions:** [`SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1.md`](./SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1.md) · [`SYNCOFFSET_PRODUCTION_ACCOUNTING_AUTHORITY.md`](./SYNCOFFSET_PRODUCTION_ACCOUNTING_AUTHORITY.md)

**Out of scope:** QuickBooks · payroll · UI · Supabase · workflows · calculation engines.

**No new authorities. No new core kinds.**

---

## Patch purpose

Film production requires an explicit **authorization ladder** between budget approval and cash payment, plus constitutional patterns for **episode allocations**, **contingency position**, and **stress-test category vocabulary**.

---

## Constitutional Rule 1 — Authorization ladder (NTF)

Production accounting is driven by **production activity**, with this **financial authorization chain**:

```
Budget (planned)
    ↓
Authorized (NTF — Not To Exceed)
    ↓
Committed (Purchase Order)
    ↓
Actual (Receipt / Invoice)
    ↓
Paid (Cash disbursement)
```

| Stage | `ProductionFinancialAmounts` field | Typical trigger |
|-------|-----------------------------------|-----------------|
| Budget | `plannedAmount` | `budget-requirement` |
| Authorized | `authorizedAmount` | NTF memo / producer approval (`document`) |
| Committed | `committedAmount` | `purchase-order` issued |
| Actual | `actualAmount` | `document` (receipt / invoice) |
| Paid | `paidAmount` | Payment confirmed |

**NTF (Not To Exceed)** is the industry authorization document capping spend. It is **not** a core kind — it is a **`document`** (category `memo` or `contract`) linked via `ntfDocumentId` with `notToExceedAmount` on the `production-cost` line.

Registry: `PRODUCTION_AUTHORIZATION_LADDER_REGISTRY` in `accounting-authorization.ts`.

---

## Constitutional Rule 2 — Extended `ProductionFinancialAmounts`

v1.1.1 adds:

| Field | Purpose |
|-------|---------|
| `authorizedAmount` | NTF / approved spending ceiling |
| `paidAmount` | Cash paid (closes stress Test 03) |
| `openQuoteAmount?` | Uncommitted quotes in forecast (stress Test 06) |

Existing fields retained: `plannedAmount`, `committedAmount`, `actualAmount`, `forecastAmount`, `estimateFinalCost?`.

**Variance** extended on rollups (`ProductionVarianceAmounts`):

- `varianceToPlanned`
- `varianceToAuthorized`
- `varianceToForecast`
- `varianceToNtf?`

---

## Constitutional Rule 3 — Episode allocation (stress Test 05)

Standing-set and multi-episode builds use **one primary** `production-cost` plus **allocation children**:

| Field | Role |
|-------|------|
| `costLineRole: "primary"` | Single economic build (e.g. $100,000 Sheriff Station) |
| `costLineRole: "episode-allocation"` | Episode slice (e.g. $20,000 × 5 episodes) |
| `allocationOfProductionCostId` | Points to primary line |
| `allocationPercent?` | Optional split (e.g. 20% per episode) |
| `episodeId` | Required on allocation children |

**Rollup rule (documentation):** Production-level **actual** totals sum **primary** lines only; episode rollups sum **allocation** lines. Prevents double-counting while answering per-episode position.

Path: `standing-set-amortization` in `ACCOUNTING_CANONICAL_RELATIONSHIP_PATHS`.

---

## Constitutional Rule 4 — Stress-test categories (registry only)

Added to `PRODUCTION_COST_CATEGORY_REGISTRY`:

| Category | Stress test |
|----------|-------------|
| `expendable` | Test 01 — petty cash |
| `rental` | Test 04 — rental lifecycle |
| `build-cost` | Test 02 — P-card build spend |
| `set-cost` | Test 02 — P-card set spend |

---

## Constitutional Rule 5 — Contingency position (stress Test 07)

Contingency is tracked via `costCategoryId: "contingency"` on budget lines and `costLineRole: "contingency-draw"` on draws.

**`ContingencyPositionSnapshot`** (not a core kind) may be attached to `cost-report`:

```text
contingencyAllocatedAmount
contingencyConsumedAmount
contingencyRemainingAmount
```

---

## Constitutional Rule 6 — `AccountingStatus` alignment

Added statuses: **`authorized`**, **`paid`** — aligned with the authorization ladder.

---

## Objects (unchanged kinds)

| Kind | v1.1.1 changes |
|------|----------------|
| `production-cost` | Ladder amounts, NTF fields, line role, allocation parent |
| `department-cost` | Inherits extended amounts + variance |
| `cost-report` | Optional `contingencyPosition` snapshot |
| `cost-report-package` | Unchanged |

---

## Stress test resolution

| Test | v1.1.1 resolution |
|------|------------------|
| 01 Petty cash | **PASS** — `expendable` category |
| 02 P-card | **PASS** — `build-cost` / `set-cost` |
| 03 PO | **PASS** — `paidAmount` + ladder |
| 04 Rental | **PASS** — `rental` category |
| 05 Amortization | **PASS** — primary + allocation pattern |
| 06 Forecast | **PASS** — `openQuoteAmount` + `forecastAmount` |
| 07 Contingency | **PASS** — `ContingencyPositionSnapshot` on report |
| 08 Cross-border | **PASS** (unchanged) |
| 09 Rollups | **PASS** — full ladder on reports |
| 10 Producer question | **PASS** — scoped `cost-report` + contingency |

---

## ProductionCost — required fields (v1.1.1 delta)

All v1.1 fields remain required, plus:

| Field | Notes |
|-------|-------|
| `costLineRole` | `primary` unless allocation / draw |
| `authorizedAmount` | NTF-approved ceiling |
| `paidAmount` | Cash disbursed |
| `notToExceedAmount?` | NTF document ceiling |
| `ntfDocumentId?` | Link to authorization `document` |
| `allocationOfProductionCostId?` | Required when `costLineRole: episode-allocation` |
| `allocationPercent?` | Optional episode split |

---

## Relationship contracts

New paths:

- `authorization-ladder` — budget → document (NTF) → production-cost
- `standing-set-amortization` — primary → allocation children

New edge:

- `production-cost` → `production-cost` (allocation reference)

---

## Imports

```ts
import {
  type ProductionCost,
  PRODUCTION_AUTHORIZATION_LADDER_REGISTRY,
  PRODUCTION_COST_LINE_ROLE_REGISTRY,
  type ContingencyPositionSnapshot,
} from "@/types/core";
```

---

*v1.1.1 — constitutional patch. Types, registries, relationships, documentation only.*
