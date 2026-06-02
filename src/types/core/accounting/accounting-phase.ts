/**
 * SyncOffset Production Accounting Authority v1.1 — production phase (not calendar month)
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1.md
 */

export type ProductionCostPhase =
  | "development"
  | "pre-production"
  | "prep"
  | "principal-photography"
  | "wrap"
  | "post-production"
  | "delivery"
  | "archive";

export type ProductionCostPhaseDefinition = {
  readonly phaseId: ProductionCostPhase;
  readonly label: string;
};

export const PRODUCTION_COST_PHASE_REGISTRY: Record<ProductionCostPhase, ProductionCostPhaseDefinition> = {
  development: { phaseId: "development", label: "Development" },
  "pre-production": { phaseId: "pre-production", label: "Pre-Production" },
  prep: { phaseId: "prep", label: "Prep" },
  "principal-photography": { phaseId: "principal-photography", label: "Principal Photography" },
  wrap: { phaseId: "wrap", label: "Wrap" },
  "post-production": { phaseId: "post-production", label: "Post-Production" },
  delivery: { phaseId: "delivery", label: "Delivery" },
  archive: { phaseId: "archive", label: "Archive" },
};
