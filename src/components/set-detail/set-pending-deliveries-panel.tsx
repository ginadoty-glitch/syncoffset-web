import { Truck } from "lucide-react";

import { TransportOrderCard } from "@/components/operations/transport-order-card";
import type { TransportOrderRow } from "@/lib/operations/workspace-rows";

import { SetSectionEmpty } from "./set-section-empty";

export function SetPendingDeliveriesPanel({
  deliveries,
  hasSet,
  tablesAvailable,
}: {
  deliveries: TransportOrderRow[];
  hasSet: boolean;
  tablesAvailable: boolean;
}) {
  if (!hasSet) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-base tracking-tight">Pending deliveries</h2>
        <SetSectionEmpty
          icon={Truck}
          title="No transport activity"
          description="Transport orders affecting this set appear here when persistence is populated."
        />
      </section>
    );
  }

  if (!tablesAvailable) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-base tracking-tight">Pending deliveries</h2>
        <SetSectionEmpty
          icon={Truck}
          title="No transport activity"
          description="Apply migration 20260531000600_work_transport_orders.sql and seed transport_orders with set_id."
        />
      </section>
    );
  }

  if (deliveries.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-base tracking-tight">Pending deliveries</h2>
        <SetSectionEmpty
          icon={Truck}
          title="No transport activity"
          description="Inbound or active transport orders linked to this set will appear here."
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium text-base tracking-tight">Pending deliveries</h2>
      <ul className="flex flex-col gap-3">
        {deliveries.map((order) => (
          <TransportOrderCard key={order.id} order={order} showCompletedDate={false} />
        ))}
      </ul>
    </section>
  );
}
