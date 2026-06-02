/**
 * SyncOffset Production Accounting Authority v1.1.1 — contingency position snapshot (not a core kind)
 *
 * Rollup shape for stress Test 07 — stored on `cost-report` or computed at read time.
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md
 */

/** Contingency bucket position at a rollup scope (production / episode / set). */
export type ContingencyPositionSnapshot = {
  readonly contingencyAllocatedAmount: number;
  readonly contingencyConsumedAmount: number;
  readonly contingencyRemainingAmount: number;
};
