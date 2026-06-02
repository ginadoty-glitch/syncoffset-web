/**
 * SyncOffset Production Accounting Authority v1.1 — rollup dimensions (production activity, not fiscal months)
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1.md
 */

/**
 * Constitutional rollup ladder (Rule 1):
 * Production (show) → Episode → Set → Department
 */
export type ProductionFinancialRollupLevel = "production" | "episode" | "set" | "department";

export type ProductionFinancialRollupLevelDefinition = {
  readonly level: ProductionFinancialRollupLevel;
  readonly label: string;
  readonly coreObjectKind: "show" | "episode" | "set" | "department";
};

export const PRODUCTION_FINANCIAL_ROLLUP_REGISTRY: Record<
  ProductionFinancialRollupLevel,
  ProductionFinancialRollupLevelDefinition
> = {
  production: { level: "production", label: "Production (Show)", coreObjectKind: "show" },
  episode: { level: "episode", label: "Episode", coreObjectKind: "episode" },
  set: { level: "set", label: "Set", coreObjectKind: "set" },
  department: { level: "department", label: "Department", coreObjectKind: "department" },
};

/** Scope of a CostReport — answers “where are we financially right now?” at one level. */
export type CostReportScope = ProductionFinancialRollupLevel;

export type CostReportScopeDefinition = {
  readonly scope: CostReportScope;
  readonly label: string;
};

export const COST_REPORT_SCOPE_REGISTRY: Record<CostReportScope, CostReportScopeDefinition> = {
  production: { scope: "production", label: "Production Cost Report" },
  episode: { scope: "episode", label: "Episode Cost Report" },
  set: { scope: "set", label: "Set Cost Report" },
  department: { scope: "department", label: "Department Cost Report" },
};

/** Forecast horizon — production-relative, not calendar month. */
export type ForecastHorizon = "current-week" | "through-wrap" | "episode-complete" | "show-complete";

export type ForecastHorizonDefinition = {
  readonly horizon: ForecastHorizon;
  readonly label: string;
};

export const FORECAST_HORIZON_REGISTRY: Record<ForecastHorizon, ForecastHorizonDefinition> = {
  "current-week": { horizon: "current-week", label: "Current Production Week" },
  "through-wrap": { horizon: "through-wrap", label: "Through Wrap" },
  "episode-complete": { horizon: "episode-complete", label: "Episode Complete" },
  "show-complete": { horizon: "show-complete", label: "Show Complete" },
};
