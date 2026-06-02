# SyncOffset Production Accounting Stress Test

**Version:** 1.0  
**Purpose:** Validate whether **Production Accounting Authority v1.1** can survive real-world production accounting **without** additional authorities or core kinds.

**Companion:** [`SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1.md`](./SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1.md)

**Scope:** Constitutional validation only — **no code changes**, no UI, no Supabase, no integrations.

**Canonical chain under test:**

```
Source Document
    ↓
Document Revision
    ↓
Document
    ↓
Production Cost
```

---

## Executive summary

| Result | Count |
|--------|-------|
| **Pass** (constitutional model sufficient) | 3 |
| **Partial** (model supports; gaps in registry vocabulary or aggregation) | 6 |
| **Fail** (requires pattern outside v1.1 or future phase) | 1 |

**Verdict:** v1.1 is a **strong benchmark** for Phases 2–6, but **not all ten tests pass** on types alone. Document migration, extraction, and rollup engines must implement documented patterns below. **Do not declare accounting “production-ready” until Partials are closed or explicitly accepted as Phase 5/6 runtime concerns.**

| Phase | Readiness |
|-------|-----------|
| Phase 2 — Document Migration | **Ready** — chain is normative; petty cash / receipts / invoices map cleanly |
| Phase 3 — Supabase | **Ready with schema notes** — mirror `ProductionCost` dimensions + document FKs |
| Phase 4 — Upload Pipeline | **Ready** — supported upload categories include `memo`, `receipt`, `purchase-order` |
| Phase 5 — Agentic Extraction | **Partial** — classification vocabulary gaps (Tests 02, 05, 07) |
| Phase 6 — Global Search | **Ready** — roll up by `showId`, `episodeId`, `setNumber`, `departmentId`, `costNumber` |

---

## Constitutional assets used (no new kinds)

| Authority | Role in stress tests |
|-----------|---------------------|
| **Document** | `source-document` → `document-revision` → `document` |
| **Production Accounting v1.1** | `production-cost`, `department-cost`, `cost-report` |
| **Scene** | `budget-requirement`, `set`, `scene` |
| **Purchase** | `purchase-order` → committed spend |
| **Vendor** | vendor provenance, rental agreements |
| **Shipment** | movement cost (separate line) |
| **Brokerage** | customs cost (separate line) |
| **Return** | rental closeout — not inventory ownership |
| **Inventory** | possession only — Rule 1 identity vs possession |
| **Asset** | identity — rentals do not become owned inventory without explicit asset acquisition |

---

## Test 01 — Petty Cash Envelope

### Source

Petty Cash Envelope #17  
Paint · Tape · Brushes  
Total: **$423.67**

### Expected extraction

Vendor · Amount · Date · Department · Set Number · Episode

### Graph mapping

```
Petty Cash Envelope (file)
    ↓
Source Document
    ↓
Document Revision
    ↓
Document (categoryId: memo | receipt)
    ↓
Production Cost (actualAmount)
    ↓
Set → Episode → Department
```

### Success criteria

System automatically determines:

```text
Actual Cost
Cost Category: Expendable
Department: Set Decoration
Set: 101
Episode: 103
```

without duplicate entry.

### Constitutional verdict: **PASS** (with vocabulary note)

| Criterion | Assessment |
|-----------|------------|
| Document chain | **Pass** — Rule 5; path `receipt-document-cost` |
| Rollup dimensions | **Pass** — `showId`, `episodeId`, `setId`, `setNumber`, `departmentId` on `ProductionCost` |
| Actual vs duplicate | **Pass at schema** — dedupe is **extraction/runtime** (Phase 5), not a missing kind |
| “Expendable” category | **Partial** — no `expendable` in `PRODUCTION_COST_CATEGORY_REGISTRY`; map to **`set-decoration`** or **`props`** + `notes`, or **`custom`** until registry append (still no new **kind**) |

**Implementation note:** One envelope → one `document` → one or more `production-cost` lines only if line-item split is required; single total → **one** `production-cost` is correct.

---

## Test 02 — P-Card Statement

### Source

AMEX Statement · Home Depot · **$1,842.77**

### Constitutional challenge

Can AI distinguish **Build Cost** from **Set Cost** using receipt contents and project context?

### Success criteria

System proposes **build-cost** or **set-cost** classification for human approval.

### Constitutional verdict: **PARTIAL**

| Criterion | Assessment |
|-----------|------------|
| Document → Production Cost | **Pass** |
| Build vs set discriminator | **Partial** — registry has **`art-construction`** (build) vs **`set-decoration`** / **`props`** (set spend), not literal `build-cost` / `set-cost` strings |
| Human approval | **Pass** — `ApprovalRecord` (Creative) or extraction review queue (Phase 5); accounting does not own approval |
| AI behavior | **Out of scope** — Phase 5; constitution only supplies **`costCategoryId`** + `custom` |

**Benchmark for extraction:** Propose `costCategoryId: "art-construction" | "set-decoration"` with confidence; coordinator confirms in review.

---

## Test 03 — Purchase Order

### Source

**PO-2034** · Universal Prop House · **$8,000**

### Constitutional requirement

PO creation must immediately affect **Committed** without waiting for delivery.

### Success criteria

Production financial position updates:

```text
Budget
Committed
Actual
Paid
```

correctly.

### Constitutional verdict: **PARTIAL**

| Criterion | Assessment |
|-----------|------------|
| PO → committed | **Pass** — Rule 3; edge `purchase-order` → `production-cost`; `committedAmount` on line |
| Budget (planned) | **Pass** — `budget-requirement` → `plannedAmount` |
| Actual | **Pass** — on receipt/invoice `document` → `actualAmount` |
| **Paid** | **Fail on vocabulary** — v1.1 has **no `paidAmount`**; use **`actualAmount`** when paid, or Phase 3 payment status on `purchase-order` (operations), not accounting authority |
| “Production Financial Position” object | **Partial** — no `production-financial-position` **kind**; use scoped **`cost-report`** snapshot (Rule 7) |

**Benchmark:** Position dashboard = aggregate `CostReport` + sum of `production-cost` by scope — not a missing authority, missing **paid** dimension in v1.1 amounts.

---

## Test 04 — Rental Lifecycle

### Source

Rental **$8,000** · Return due June 18

### Constitutional requirement

Rental must **not** become inventory ownership.

### Success criteria

- Cost category: **rental**
- Return Authority linked
- Inventory does not assume ownership

### Constitutional verdict: **PASS** (with vocabulary note)

| Criterion | Assessment |
|-----------|------------|
| Not inventory ownership | **Pass** — Inventory Rule 1; rental PO does not create `inventory-record` unless check-out workflow explicitly links **asset-instance** (operational) |
| Return linkage | **Pass** — `return` → `production-cost`; path `rental-closeout` in Return Authority |
| PO as rental | **Pass** — Vendor `rental` agreement + `purchase-order` |
| Category “rental” | **Partial** — use **`general-expense`** or **`custom`** with `notes: "rental"`; or map to vendor category **rental-house** on vendor, not `costCategoryId` |

---

## Test 05 — Standing Set Amortization

### Source

Sheriff Station Build · **$100,000**  
Used in Episodes **101–105**

### Constitutional requirement

Single build · multiple episode allocations · **no duplicate ProductionCost records**

### Expected allocation

$20,000 per episode (5 episodes)

### Constitutional verdict: **FAIL** (constitutional pattern undefined)

| Criterion | Assessment |
|-----------|------------|
| One build economically | **Pass** — one `document` (build estimate / invoice) |
| Five episode views | **Conflict** — each `production-cost` requires **one** `episodeId` (episodic). Five episodes ⇒ **five lines** OR **one line without episode** (loses episode rollup) |
| “No duplicate ProductionCost” | **Fails** if interpreted as one row — v1.1 has **no allocation / amortization** fields (`parentCostId`, `allocationPercent`, `episodeAllocation[]`) |
| Without new kind | **Accepted pattern (document only):** 1 **parent** `production-cost` on **set** with `actualAmount: 100000`, `episodeId` omitted + 5 **`department-cost`** or **`cost-report`** episode-scoped summaries with **allocated** amounts in report fields only — rollups are **reporting**, not line-level |

**Recommendation before Phase 5:** Either allow **N allocation lines** linked to same `documentId` (semantic duplicates forbidden; **allocation lines** allowed), or extend v1.1.1 with `allocationOfProductionCostId?: ObjectId` on `ProductionCost` (**field**, not new kind). Stress test marks this **blocking for standing-set amortization** until pattern is chosen.

---

## Test 06 — Forecast Overrun

### Current state

| Budget | $50,000 |
| Committed | $42,000 |
| Actual | $30,000 |
| Open quotes | $8,000 |

### Constitutional requirement

**Forecast** = expected final spend, not current spend.

### Success criteria

System reports **Forecast** and **Forecast Variance** before overrun.

### Constitutional verdict: **PARTIAL**

| Criterion | Assessment |
|-----------|------------|
| Forecast on line | **Pass** — `forecastAmount`, `estimateFinalCost` on `ProductionCost` |
| Forecast variance | **Pass** — `varianceToForecast` on `DepartmentCost` |
| Open quotes in forecast | **Partial** — quotes are **not** a core object; model as `purchase-order` **draft** committed or separate `production-cost` with `statusId: planned` and `committedAmount` only |
| Early warning | **Pass at schema** — rollup engine compares `forecastAmount` to `plannedAmount` on `cost-report`; no calculation in types layer |

**Formula (documentation only):** `forecastAmount ≥ actualAmount + openQuoteCommitted`.

---

## Test 07 — Contingency Consumption

### Source

Contingency **$250,000** · Emergency construction **$25,000**

### Success criteria

Track at production / episode / set:

```text
Contingency Allocated
Contingency Consumed
Contingency Remaining
```

### Constitutional verdict: **PARTIAL**

| Criterion | Assessment |
|-----------|------------|
| Contingency bucket | **Pass** — `costCategoryId: "contingency"` |
| Consumption draw | **Pass** — emergency line `costCategoryId: "art-construction"` (or `custom`) with `budgetRequirementId` pointing to contingency budget line |
| Allocated / consumed / remaining | **Partial** — **no fields** on `show` / `episode` / `set`; derive by **aggregating** `production-cost` + `budget-requirement` where category = contingency (Phase 5/6 engine) |
| Without new kind | **Pass** if rollup is query-defined on existing objects |

---

## Test 08 — Cross-Border Shipment

### Source

Purchase Order · Shipment · Brokerage Record · Commercial Invoice

### Constitutional requirement

Single spend must **not** be double-counted.

### Success criteria

Separate **purchase**, **shipping**, **brokerage** costs with shared provenance.

### Constitutional verdict: **PASS**

| Line | Constitutional object | Edge |
|------|----------------------|------|
| Purchase | `production-cost` | `purchase-order` → `production-cost` |
| Shipping | `production-cost` | `shipment` → `production-cost` |
| Brokerage | `production-cost` | `brokerage-record` → `production-cost` |
| Provenance | Same `documentId` / `purchaseOrderId` on each line | Document chain |

**Rule:** Sum **actualAmount** across lines for total spend; never merge into one category.

---

## Test 09 — Financial Position Rollups

### Production level

Must answer: Budget · Committed · Actual · Paid · Forecast · Contingency Remaining

### Episode level

Must answer: Budget · Committed · Actual · Paid · Forecast · Variance

### Set level

Must answer: Build cost · Set cost · Rentals · Purchases · Expendables · Transportation

### Department level

Must answer: Current spend · Forecast · Variance

### Constitutional verdict: **PARTIAL**

| Level | Assessment |
|-------|------------|
| Production | **Partial** — `cost-report` `reportScope: production` + sums; **Paid** and **Contingency Remaining** need derived metrics (Test 03, 07) |
| Episode | **Pass** — `reportScope: episode`, `episodeId`, variance fields |
| Set | **Partial** — filter `production-cost` by `setId` + `costCategoryId` (build = `art-construction`, rentals = `custom`+vendor, etc.) |
| Department | **Pass** — `department-cost` + `reportScope: department` |

**No new rollup kind required** — aggregation is **read model** over `production-cost` and `cost-report`.

---

## Test 10 — Production Meeting Question

> “Where are we financially right now?”

Must answer: Production · Episode · Set · Department position · Forecast · Contingency · Major risks

### Constitutional verdict: **PARTIAL**

| Answer | Constitutional support |
|--------|------------------------|
| Production position | `cost-report` + `showId` |
| Episode position | `cost-report` + `episodeId` |
| Set position | `cost-report` + `setId` |
| Department position | `cost-report` + `departmentId` |
| Forecast | `forecastAmount` / `forecastHorizon` on reports |
| Contingency | Aggregate query (Test 07) |
| Major risks | **`risk-evaluation`** (derived only, Intelligence) — references shoot day, location, asset, shipment; **not** accounting-owned |

**Pass** for financial position without spreadsheet **if** Phases 5–6 implement rollups. **Partial** for “major risks” — cross-authority (Intelligence + Accounting).

---

## Scorecard

| Test | Name | Verdict |
|------|------|---------|
| 01 | Petty Cash Envelope | **PASS** |
| 02 | P-Card Statement | **PARTIAL** |
| 03 | Purchase Order | **PARTIAL** |
| 04 | Rental Lifecycle | **PASS** |
| 05 | Standing Set Amortization | **FAIL** |
| 06 | Forecast Overrun | **PARTIAL** |
| 07 | Contingency Consumption | **PARTIAL** |
| 08 | Cross-Border Shipment | **PASS** |
| 09 | Financial Position Rollups | **PARTIAL** |
| 10 | Production Meeting | **PARTIAL** |

---

## Gaps to close (no new authorities; allowed actions)

| Gap | Remediation | Phase |
|-----|-------------|-------|
| No `paidAmount` | Document as **`actualAmount`** when paid; optional PO payment flag in Purchase types | 3 / 5 |
| No `expendable` / `rental` category | Append to **`PRODUCTION_COST_CATEGORY_REGISTRY`** (registry only) | 1.1.1 doc + types |
| No `build-cost` / `set-cost` literals | Use **`art-construction`** vs **`set-decoration`** in extraction rubric | 5 |
| Standing set amortization | Add optional **`allocationOfProductionCostId`** on `ProductionCost` OR allow linked allocation lines sharing `documentId` | 1.1.1 or 5 policy |
| Open quotes in forecast | Treat draft PO / planned costs as committed in forecast rollup | 5 / 6 |
| Contingency remaining | Document aggregation query over `budget-requirement` + `costCategoryId: contingency` | 6 |
| Production Financial Position | Standardize **`cost-report`** as position snapshot; no new kind | 2–6 |

---

## Outcome

**If** Tests 01, 04, 08 **pass** and **Partials** are implemented as runtime/rollup behavior (not new authorities), Production Accounting v1.1 is **implementation-ready** for:

| Phase | Status |
|-------|--------|
| Phase 2 — Document Migration | **Go** — canonical chain validated |
| Phase 3 — Supabase Schema | **Go** — with `paid` and allocation notes |
| Phase 4 — Upload Pipeline | **Go** |
| Phase 5 — Agentic Extraction | **Go with rubric** — category mapping + Test 05 policy |
| Phase 6 — Global Search | **Go** |

**Test 05** resolved in **v1.1.1** — primary + `episode-allocation` children via `allocationOfProductionCostId`. See [`SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md`](./SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md).

**With v1.1.1 applied, all ten stress tests pass** at the constitutional layer (rollup engines still Phase 5/6).

This document is the **benchmark** every upload pipeline, extraction agent, Supabase table, and dashboard must satisfy.

---

*Stress test v1.0 — validation only. No source files modified.*
