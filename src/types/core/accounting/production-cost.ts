/**
 * SyncOffset Production Accounting Authority v1.1.1 — real production expense
 *
 * Authorization ladder: Budget → Authorized (NTF) → Committed → Actual → Paid (Rule 1).
 * Episode allocations reference a primary line via `allocationOfProductionCostId` (Rule 3).
 *
 * Constitutional object: kind "production-cost"
 *
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ProductionFinancialAmounts } from "./accounting-amounts";
import type { ProductionCostCategory } from "./accounting-category";
import type { ProductionCostLineRole } from "./accounting-line-role";
import type { ProductionCostPhase } from "./accounting-phase";
import type { AccountingStatus } from "./accounting-status";

export type ProductionCost = AuditableCoreObject &
  ProductionFinancialAmounts & {
    readonly kind: "production-cost";
    readonly statusId: AccountingStatus;
    readonly costLineRole: ProductionCostLineRole;
    readonly costNumber: string;
    readonly description: string;
    readonly showId: ObjectId;
    readonly episodeId?: ObjectId;
    readonly setId: ObjectId;
    readonly setNumber: string;
    readonly departmentId: ObjectId;
    readonly budgetRequirementId: ObjectId;
    readonly costCategoryId: ProductionCostCategory;
    readonly costPhaseId: ProductionCostPhase;
    readonly currencyCode: string;
    readonly notes: string;
    /**
     * NTF ceiling for this line — typically equals `authorizedAmount` when NTF is issued.
     * Distinct from planned budget when producer approves spend above estimate.
     */
    readonly notToExceedAmount?: number;
    readonly ntfDocumentId?: ObjectId;
    /**
     * Primary line for standing-set / multi-episode builds (stress Test 05).
     * Allocation children must not double-count in production-level actual totals.
     */
    readonly allocationOfProductionCostId?: ObjectId;
    readonly allocationPercent?: number;
    readonly sceneId?: ObjectId;
    readonly vendorId?: ObjectId;
    readonly purchaseOrderId?: ObjectId;
    readonly assetId?: ObjectId;
    readonly transportOrderId?: ObjectId;
    readonly shootDayId?: ObjectId;
    readonly shipmentId?: ObjectId;
    readonly brokerageRecordId?: ObjectId;
    readonly returnId?: ObjectId;
    readonly documentId?: ObjectId;
    readonly departmentCostIds: ReadonlyArray<ObjectId>;
  };
