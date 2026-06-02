/**
 * SyncOffset Production Accounting Authority v1.1.1 — authorization ladder & NTF (registry only)
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md
 */

/**
 * Constitutional spend authorization ladder (Rule 1).
 * Production-native — not fiscal months or GL periods.
 */
export type ProductionAuthorizationStage = "budget" | "authorized" | "committed" | "actual" | "paid";

export type ProductionAuthorizationStageDefinition = {
  readonly stage: ProductionAuthorizationStage;
  readonly label: string;
  /** Maps to `ProductionFinancialAmounts` field updated at this stage. */
  readonly amountField: "plannedAmount" | "authorizedAmount" | "committedAmount" | "actualAmount" | "paidAmount";
};

export const PRODUCTION_AUTHORIZATION_LADDER_REGISTRY: ReadonlyArray<ProductionAuthorizationStageDefinition> = [
  { stage: "budget", label: "Budget (Planned)", amountField: "plannedAmount" },
  { stage: "authorized", label: "Authorized (NTF)", amountField: "authorizedAmount" },
  { stage: "committed", label: "Committed", amountField: "committedAmount" },
  { stage: "actual", label: "Actual", amountField: "actualAmount" },
  { stage: "paid", label: "Paid", amountField: "paidAmount" },
];

/**
 * NTF — Not To Exceed — industry authorization document approving spend up to a ceiling.
 * Stored as `document` + reflected in `authorizedAmount` / `notToExceedAmount` on the cost line.
 */
export type NotToExceedReference = {
  readonly ntfNumber: string;
  readonly approvedAt: string;
  readonly approvedBy: string;
  readonly notToExceedAmount: number;
  readonly documentId?: string;
};
