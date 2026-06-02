/**
 * SyncOffset Production Accounting Authority v1.1.1 — production cost line roles
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md
 */

/**
 * Distinguishes primary economic spend from episode allocations (stress Test 05).
 * Allocation lines are not duplicate builds — they reference `allocationOfProductionCostId`.
 */
export type ProductionCostLineRole = "primary" | "episode-allocation" | "ntf-draw" | "contingency-draw";

export type ProductionCostLineRoleDefinition = {
  readonly role: ProductionCostLineRole;
  readonly label: string;
  readonly requiresParentCostId: boolean;
};

export const PRODUCTION_COST_LINE_ROLE_REGISTRY: Record<ProductionCostLineRole, ProductionCostLineRoleDefinition> = {
  primary: {
    role: "primary",
    label: "Primary Cost",
    requiresParentCostId: false,
  },
  "episode-allocation": {
    role: "episode-allocation",
    label: "Episode Allocation",
    requiresParentCostId: true,
  },
  "ntf-draw": {
    role: "ntf-draw",
    label: "Draw Against NTF",
    requiresParentCostId: false,
  },
  "contingency-draw": {
    role: "contingency-draw",
    label: "Contingency Draw",
    requiresParentCostId: false,
  },
};
