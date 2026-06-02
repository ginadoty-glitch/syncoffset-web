/**
 * SyncOffset Production Accounting Authority v1.1.1 — constitutional cost report
 *
 * Summarizes production reality at production / episode / set / department scope (Rule 1).
 * Does not approve spending (Rule 6). Not ERP or payroll (Rule 5).
 *
 * Constitutional object: kind "cost-report"
 *
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CalendarRevisionColor } from "../production-calendar/calendar-revision-colors";
import type { ProductionFinancialAmounts } from "./accounting-amounts";
import type { ContingencyPositionSnapshot } from "./accounting-contingency";
import type { CostReportScope, ForecastHorizon } from "./accounting-rollup";

export type CostReport = AuditableCoreObject &
  ProductionFinancialAmounts & {
    readonly kind: "cost-report";
    readonly reportNumber: string;
    readonly reportDate: string;
    readonly reportScope: CostReportScope;
    readonly forecastHorizon: ForecastHorizon;
    readonly showId: ObjectId;
    readonly episodeId?: ObjectId;
    readonly setId?: ObjectId;
    readonly departmentId?: ObjectId;
    readonly notes: string;
    readonly revisionColor?: CalendarRevisionColor;
    readonly departmentCostIds: ReadonlyArray<ObjectId>;
    readonly costReportPackageIds: ReadonlyArray<ObjectId>;
    readonly generatedOutputIds: ReadonlyArray<ObjectId>;
    /** Optional contingency bucket snapshot (stress Test 07) — not a core kind. */
    readonly contingencyPosition?: ContingencyPositionSnapshot;
  };
