/**
 * SyncOffset Scene Authority — budget requirement (need from breakdown)
 *
 * Budgets originate from breakdown analysis — not from sets or assets directly.
 * Budget authority sits below Script and Scene but above Set, Asset, Vendor, Location, Logistics.
 *
 * Constitutional object: kind "budget-requirement"
 * No calculations or ledger logic in this layer.
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type BudgetRequirementStatus = "estimated" | "approved" | "revised" | "cut" | "archived";

export type BudgetRequirement = AuditableCoreObject & {
  readonly kind: "budget-requirement";
  readonly status: BudgetRequirementStatus;
  readonly sceneId: ObjectId;
  readonly breakdownElementId?: ObjectId;
  readonly setId?: ObjectId;
  readonly requirementLabel: string;
  readonly budgetLineId?: ObjectId;
  readonly notes?: string;
};
