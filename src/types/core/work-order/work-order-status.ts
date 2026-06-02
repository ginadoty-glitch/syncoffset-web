/**
 * SyncOffset Work Order Authority — lifecycle vocabulary (registry only)
 * @see docs/SYNCOFFSET_WORK_ORDER_AUTHORITY.md
 */

export type WorkOrderStatus =
  | "draft"
  | "requested"
  | "reviewing"
  | "approved"
  | "assigned"
  | "in-progress"
  | "blocked"
  | "completed"
  | "cancelled";

export type WorkOrderStatusDefinition = {
  readonly statusId: WorkOrderStatus;
  readonly label: string;
};

export const WORK_ORDER_STATUS_REGISTRY: Record<WorkOrderStatus, WorkOrderStatusDefinition> = {
  draft: { statusId: "draft", label: "Draft" },
  requested: { statusId: "requested", label: "Requested" },
  reviewing: { statusId: "reviewing", label: "Reviewing" },
  approved: { statusId: "approved", label: "Approved" },
  assigned: { statusId: "assigned", label: "Assigned" },
  "in-progress": { statusId: "in-progress", label: "In Progress" },
  blocked: { statusId: "blocked", label: "Blocked" },
  completed: { statusId: "completed", label: "Completed" },
  cancelled: { statusId: "cancelled", label: "Cancelled" },
};

export type WorkOrderTaskStatus = "pending" | "in-progress" | "blocked" | "completed" | "cancelled";

export type WorkOrderTaskStatusDefinition = {
  readonly statusId: WorkOrderTaskStatus;
  readonly label: string;
};

export const WORK_ORDER_TASK_STATUS_REGISTRY: Record<WorkOrderTaskStatus, WorkOrderTaskStatusDefinition> = {
  pending: { statusId: "pending", label: "Pending" },
  "in-progress": { statusId: "in-progress", label: "In Progress" },
  blocked: { statusId: "blocked", label: "Blocked" },
  completed: { statusId: "completed", label: "Completed" },
  cancelled: { statusId: "cancelled", label: "Cancelled" },
};
