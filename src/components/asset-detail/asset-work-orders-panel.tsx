import { ClipboardList } from "lucide-react";

import { WorkOrderCard } from "@/components/operations/work-order-card";
import { SetSectionEmpty } from "@/components/set-detail/set-section-empty";
import type { WorkOrderRow } from "@/lib/operations/workspace-rows";

export function AssetWorkOrdersPanel({
  workOrders,
  hasAsset,
  tablesAvailable,
}: {
  workOrders: WorkOrderRow[];
  hasAsset: boolean;
  tablesAvailable: boolean;
}) {
  if (!hasAsset) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg tracking-tight">Related work orders</h2>
        <SetSectionEmpty icon={ClipboardList} title="No work orders assigned" description="Asset not found." />
      </section>
    );
  }

  if (!tablesAvailable) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg tracking-tight">Related work orders</h2>
        <SetSectionEmpty
          icon={ClipboardList}
          title="No work orders assigned"
          description="Apply migration 20260531000600_work_transport_orders.sql and link work_orders.asset_id."
        />
      </section>
    );
  }

  if (workOrders.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg tracking-tight">Related work orders</h2>
        <SetSectionEmpty
          icon={ClipboardList}
          title="No work orders assigned"
          description="Work orders linked to this asset appear here. Read-only."
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium text-lg tracking-tight">Related work orders</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {workOrders.map((order) => (
          <WorkOrderCard key={order.id} order={order} />
        ))}
      </ul>
    </section>
  );
}
