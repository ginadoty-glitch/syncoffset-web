import { ArrowRight, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCompletedAt, transportStatusLabel } from "@/lib/operations/operation-labels";
import type { TransportOrderRow } from "@/lib/operations/workspace-rows";
import { cn } from "@/lib/utils";

const ACTIVE_TRANSPORT = new Set(["dispatched", "en-route", "scheduled", "staged"]);

export function TransportOrderCard({
  order,
  showCompletedDate = true,
  className,
}: {
  order: TransportOrderRow;
  showCompletedDate?: boolean;
  className?: string;
}) {
  const isActive = ACTIVE_TRANSPORT.has(order.status);

  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border/70 bg-card/50 p-4",
        isActive && "border-[#47AE90]/30",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Truck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{order.ref}</span>
            <Badge variant={isActive ? "default" : "outline"} className="text-[10px]">
              {transportStatusLabel(order.status)}
            </Badge>
          </div>
          <p className="mt-1 font-medium text-sm leading-snug">{order.title}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground text-xs">
        <span className="max-w-[40%] truncate">{order.origin_label}</span>
        <ArrowRight className="size-3 shrink-0" />
        <span className="max-w-[40%] truncate">{order.destination_label}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div>
          <dt className="text-muted-foreground">Driver</dt>
          <dd className="font-medium">{order.assigned_driver?.trim() || "Unassigned"}</dd>
        </div>
        {showCompletedDate && (
          <div>
            <dt className="text-muted-foreground">Completed</dt>
            <dd className="font-medium tabular-nums">{formatCompletedAt(order.completed_at)}</dd>
          </div>
        )}
      </dl>
    </li>
  );
}
