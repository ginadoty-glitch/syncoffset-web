import { Truck } from "lucide-react";

import { TransportOrderCard } from "@/components/operations/transport-order-card";
import { SetSectionEmpty } from "@/components/set-detail/set-section-empty";
import type { TransportOrderRow } from "@/lib/operations/workspace-rows";

export function AssetMovementHistoryPanel({
  movements,
  hasAsset,
  tablesAvailable,
}: {
  movements: TransportOrderRow[];
  hasAsset: boolean;
  tablesAvailable: boolean;
}) {
  if (!hasAsset) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg tracking-tight">Movement history</h2>
        <SetSectionEmpty icon={Truck} title="No transport activity" description="Asset not found." />
      </section>
    );
  }

  if (!tablesAvailable) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg tracking-tight">Movement history</h2>
        <SetSectionEmpty
          icon={Truck}
          title="No transport activity"
          description="Apply migration 20260531000600_work_transport_orders.sql and link transport_orders.asset_id."
        />
      </section>
    );
  }

  if (movements.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg tracking-tight">Movement history</h2>
        <SetSectionEmpty
          icon={Truck}
          title="No transport activity"
          description="Pickup, delivery, and return transport for this asset appear here."
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium text-lg tracking-tight">Movement history</h2>
      <ul className="flex flex-col gap-3">
        {movements.map((order) => (
          <TransportOrderCard key={order.id} order={order} />
        ))}
      </ul>
    </section>
  );
}
