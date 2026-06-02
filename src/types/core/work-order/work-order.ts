/**
 * SyncOffset Work Order Authority — formal inter-department production request
 *
 * A Work Order is NOT a Purchase Order, Shipment, Transport Order, Asset,
 * Budget Requirement, Callsheet, or Shoot Day.
 *
 * Rule 4 — always belongs to a Set (`setId`, `setNumber` required).
 * Rule 5 — may reference Scene; scenes create the need, departments execute.
 *
 * Constitutional object: kind "work-order"
 *
 * @see docs/SYNCOFFSET_WORK_ORDER_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { WorkOrderPriority } from "./work-order-priority";
import type { WorkOrderStatus } from "./work-order-status";

export type WorkOrder = AuditableCoreObject & {
  readonly kind: "work-order";
  readonly workOrderNumber: string;
  readonly title: string;
  readonly description: string;
  readonly requestingDepartmentId: ObjectId;
  readonly assignedDepartmentId: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly sceneId?: ObjectId;
  readonly budgetRequirementId?: ObjectId;
  readonly priorityId: WorkOrderPriority;
  readonly statusId: WorkOrderStatus;
  readonly requestedBy: string;
  readonly requestedDate: string;
  readonly requiredByDate: string;
  readonly notes: string;
  readonly workOrderTaskIds: ReadonlyArray<ObjectId>;
  readonly workOrderPackageIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
