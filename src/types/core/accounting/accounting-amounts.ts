/**
 * SyncOffset Production Accounting Authority v1.1.1 — financial amount vocabulary
 *
 * Film authorization ladder (Rule 1): Budget → Authorized (NTF) → Committed → Actual → Paid.
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md
 */

/**
 * Production economics on a single cost line (no calculation logic in this layer).
 *
 * | Field | Ladder step | Typical source |
 * |-------|-------------|----------------|
 * | `plannedAmount` | Budget | `budget-requirement` |
 * | `authorizedAmount` | Authorized (NTF ceiling) | NTF memo / producer approval |
 * | `committedAmount` | Committed | `purchase-order` |
 * | `actualAmount` | Actual | `document` (receipt / invoice) |
 * | `paidAmount` | Paid | payment confirmation on `document` or PO |
 * | `forecastAmount` | Forecast (EFC trajectory) | rollup engine |
 */
export type ProductionFinancialAmounts = {
  /** Budget — planned spend from breakdown / budget requirement. */
  readonly plannedAmount: number;
  /** Authorized — Not To Exceed (NTF) or approved spending ceiling (Rule 1). */
  readonly authorizedAmount: number;
  /** Committed — purchase orders and firm obligations (Rule 3 v1.0). */
  readonly committedAmount: number;
  /** Actual — invoiced or receipt-backed spend (Rule 5 v1.1). */
  readonly actualAmount: number;
  /** Paid — cash disbursed against the line (v1.1.1 — closes stress Test 03). */
  readonly paidAmount: number;
  /** Estimate-to-complete / expected final spend — not current spend (Rule 6 stress test). */
  readonly forecastAmount: number;
  /** Estimate final cost — optional producer-facing EFC. */
  readonly estimateFinalCost?: number;
  /** Open quotes not yet committed — optional input to forecast rollup (stress Test 06). */
  readonly openQuoteAmount?: number;
};

/** Variance context on rollups (computed elsewhere). */
export type ProductionVarianceAmounts = {
  readonly varianceToPlanned: number;
  readonly varianceToAuthorized: number;
  readonly varianceToForecast: number;
  readonly varianceToNtf?: number;
};
