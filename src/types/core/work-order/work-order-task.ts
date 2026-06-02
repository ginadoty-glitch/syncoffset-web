/**
 * SyncOffset Work Order Authority — individual execution item
 *
 * Examples: build counter, print menus, age walls, install drapes, strike set.
 * Constitutional object: kind "work-order-task"
 *
 * @see docs/SYNCOFFSET_WORK_ORDER_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { WorkOrderTaskStatus } from "./work-order-status";

export type WorkOrderTask = AuditableCoreObject & {
  readonly kind: "work-order-task";
  readonly workOrderId: ObjectId;
  readonly title: string;
  readonly description: string;
  readonly statusId: WorkOrderTaskStatus;
  readonly assignedTo?: string;
  readonly dueDate?: string;
};
