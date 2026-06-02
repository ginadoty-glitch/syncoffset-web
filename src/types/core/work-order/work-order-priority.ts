/**
 * SyncOffset Work Order Authority — priority vocabulary (registry only)
 * @see docs/SYNCOFFSET_WORK_ORDER_AUTHORITY.md
 */

export type WorkOrderPriority = "low" | "normal" | "high" | "rush" | "critical";

export type WorkOrderPriorityDefinition = {
  readonly priorityId: WorkOrderPriority;
  readonly label: string;
};

export const WORK_ORDER_PRIORITY_REGISTRY: Record<WorkOrderPriority, WorkOrderPriorityDefinition> = {
  low: { priorityId: "low", label: "Low" },
  normal: { priorityId: "normal", label: "Normal" },
  high: { priorityId: "high", label: "High" },
  rush: { priorityId: "rush", label: "Rush" },
  critical: { priorityId: "critical", label: "Critical" },
};
