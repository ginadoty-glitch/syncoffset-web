import { ClipboardList } from "lucide-react";

import { WorkOrderCard } from "@/components/operations/work-order-card";
import type { WorkOrderRow } from "@/lib/operations/workspace-rows";

import { SetSectionEmpty } from "./set-section-empty";

export function SetOpenWorkOrdersPanel({
  workOrders,
  hasSet,
  tablesAvailable,
}: {
  workOrders: WorkOrderRow[];
  hasSet: boolean;
  tablesAvailable: boolean;
}) {
  if (!hasSet) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-base tracking-tight">Open work orders</h2>
        <SetSectionEmpty
          icon={ClipboardList}
          title="No work orders assigned"
          description="Work orders for this set appear here when persistence is populated."
        />
      </section>
    );
  }

  if (!tablesAvailable) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-base tracking-tight">Open work orders</h2>
        <SetSectionEmpty
          icon={ClipboardList}
          title="No work orders assigned"
          description="Apply migration 20260531000600_work_transport_orders.sql and seed work_orders for this set."
        />
      </section>
    );
  }

  if (workOrders.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-base tracking-tight">Open work orders</h2>
        <SetSectionEmpty
          icon={ClipboardList}
          title="No work orders assigned"
          description="Open constitutional work orders for this set will appear here. Read-only — no creation in this sprint."
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium text-base tracking-tight">Open work orders</h2>
      <ul className="flex flex-col gap-3">
        {workOrders.map((order) => (
          <WorkOrderCard key={order.id} order={order} />
        ))}
      </ul>
    </section>
  );
}
