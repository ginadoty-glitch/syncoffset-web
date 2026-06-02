/**
 * SyncOffset Production Accounting Authority v1.1 — department-level cost aggregation
 *
 * Rollup at Set + Department within Episode and Production (Rule 1).
 * Constitutional object: kind "department-cost"
 *
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ProductionFinancialAmounts, ProductionVarianceAmounts } from "./accounting-amounts";

export type DepartmentCost = AuditableCoreObject &
  ProductionFinancialAmounts &
  ProductionVarianceAmounts & {
    readonly kind: "department-cost";
    readonly showId: ObjectId;
    readonly episodeId?: ObjectId;
    readonly departmentId: ObjectId;
    readonly setId: ObjectId;
    readonly setNumber: string;
    readonly budgetRequirementId: ObjectId;
    readonly productionCostIds: ReadonlyArray<ObjectId>;
    readonly costReportIds: ReadonlyArray<ObjectId>;
  };
