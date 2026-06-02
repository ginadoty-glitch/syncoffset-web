import { Badge } from "@/components/ui/badge";
import { formatDueDate, workOrderPriorityLabel, workOrderStatusLabel } from "@/lib/operations/operation-labels";
import type { WorkOrderRow } from "@/lib/operations/workspace-rows";
import { cn } from "@/lib/utils";

const PRIORITY_VARIANT: Record<string, "outline" | "secondary" | "default" | "destructive"> = {
  low: "outline",
  normal: "secondary",
  high: "default",
  rush: "destructive",
  critical: "destructive",
};

export function WorkOrderCard({ order, className }: { order: WorkOrderRow; className?: string }) {
  return (
    <li
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border/70 bg-card/50 p-4 transition-colors",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-medium text-sm leading-snug tracking-tight">{order.title}</h3>
        <Badge variant={PRIORITY_VARIANT[order.priority_id] ?? "outline"} className="shrink-0 text-[10px]">
          {workOrderPriorityLabel(order.priority_id)}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="text-[10px] capitalize">
          {workOrderStatusLabel(order.status_id)}
        </Badge>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{order.work_order_number}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div>
          <dt className="text-muted-foreground">Assigned to</dt>
          <dd className="font-medium">{order.assigned_to.trim() || "Unassigned"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Due</dt>
          <dd className="font-medium tabular-nums">{formatDueDate(order.required_by_date)}</dd>
        </div>
      </dl>
    </li>
  );
}
