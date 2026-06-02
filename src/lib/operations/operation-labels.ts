import type { WorkOrderPriority } from "@/types/core/work-order/work-order-priority";
import { WORK_ORDER_PRIORITY_REGISTRY } from "@/types/core/work-order/work-order-priority";
import type { WorkOrderStatus } from "@/types/core/work-order/work-order-status";
import { WORK_ORDER_STATUS_REGISTRY } from "@/types/core/work-order/work-order-status";
import type { TransportOrderStatus } from "@/types/operations/transport-order";

export function workOrderStatusLabel(statusId: WorkOrderStatus): string {
  return WORK_ORDER_STATUS_REGISTRY[statusId]?.label ?? statusId;
}

export function workOrderPriorityLabel(priorityId: WorkOrderPriority): string {
  return WORK_ORDER_PRIORITY_REGISTRY[priorityId]?.label ?? priorityId;
}

const TRANSPORT_STATUS_LABELS: Record<TransportOrderStatus, string> = {
  draft: "Draft",
  staged: "Staged",
  scheduled: "Scheduled",
  dispatched: "Dispatched",
  "en-route": "En Route",
  held: "Held",
  "awaiting-clearance": "Awaiting Clearance",
  completed: "Completed",
  cancelled: "Cancelled",
  archived: "Archived",
};

export function transportStatusLabel(status: TransportOrderStatus): string {
  return TRANSPORT_STATUS_LABELS[status] ?? status;
}

export function formatDueDate(isoDate: string | null): string {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatCompletedAt(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
