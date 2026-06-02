import type { WorkOrderPriority } from "@/types/core/work-order/work-order-priority";
import type { WorkOrderStatus } from "@/types/core/work-order/work-order-status";
import type { TransportOrderStatus } from "@/types/operations/transport-order";

/** Postgres row → constitutional WorkOrder fields used in workspace UI. */
export type WorkOrderRow = {
  id: string;
  title: string;
  assigned_to: string;
  status_id: WorkOrderStatus;
  priority_id: WorkOrderPriority;
  required_by_date: string | null;
  work_order_number: string;
};

/** Postgres row → TransportOrder display subset for workspace UI. */
export type TransportOrderRow = {
  id: string;
  ref: string;
  title: string;
  origin_label: string;
  destination_label: string;
  status: TransportOrderStatus;
  assigned_driver: string | null;
  completed_at: string | null;
};

export const CLOSED_WORK_ORDER_STATUSES: WorkOrderStatus[] = ["completed", "cancelled"];

export const SETTLED_TRANSPORT_STATUSES: TransportOrderStatus[] = ["completed", "cancelled", "archived"];
