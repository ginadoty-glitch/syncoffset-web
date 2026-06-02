/**
 * SyncOffset Production Accounting Authority v1.1.1 — lifecycle vocabulary (registry only)
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md
 */

export type AccountingStatus =
  | "draft"
  | "planned"
  | "authorized"
  | "committed"
  | "actualized"
  | "paid"
  | "reported"
  | "closed";

export type AccountingStatusDefinition = {
  readonly statusId: AccountingStatus;
  readonly label: string;
};

export const ACCOUNTING_STATUS_REGISTRY: Record<AccountingStatus, AccountingStatusDefinition> = {
  draft: { statusId: "draft", label: "Draft" },
  planned: { statusId: "planned", label: "Planned (Budget)" },
  authorized: { statusId: "authorized", label: "Authorized (NTF)" },
  committed: { statusId: "committed", label: "Committed" },
  actualized: { statusId: "actualized", label: "Actualized" },
  paid: { statusId: "paid", label: "Paid" },
  reported: { statusId: "reported", label: "Reported" },
  closed: { statusId: "closed", label: "Closed" },
};
