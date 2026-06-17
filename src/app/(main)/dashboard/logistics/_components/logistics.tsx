"use client";

/**
 * Logistics — Canonical operational movement surface for SyncOffset.
 *
 * Logistics IS dispatch. This surface handles:
 *   transport coordination · movement tracking · routing · escalation
 *   operational propagation · live delivery state · customs/delay
 *   timing risk · driver assignment · callsheet revision impact
 *
 * Three-column operational shell:
 *   LEFT  — Compact transport manifest (propagation-aware queue)
 *   CENTER — Transport order detail with propagation banners + map strip
 *   RIGHT  — Operational intelligence rail (conditions, revision, rush)
 *
 * Propagation engine computes cascading impact across all orders on every
 * render. Future: invalidated by Supabase realtime events on conditions,
 * revisions, and assignments.
 */

import * as React from "react";

import { computeGlobalPropagation } from "@/lib/operations/propagation";
import type { VendorRow } from "@/lib/vendors/types";

import type { DriverRow, LogisticsDeskDataSource, Shipment } from "../_lib/logistics-desk-types";
import type { DriverAssignment } from "./operational-data";
import { activeCallsheetRevision, operationalConditions, PRODUCTION_TIME } from "./operational-data";
import { OperationalIntelligence } from "./operational-intelligence";
import { TransportDetail } from "./transport-detail";
import { parseProductionMinutes, TransportQueue } from "./transport-queue";

export type LogisticsProps = {
  shipments: Shipment[];
  driverAssignments: DriverAssignment[];
  drivers: DriverRow[];
  vendors: VendorRow[];
  dataSource?: LogisticsDeskDataSource;
  fallbackReason?: string | null;
  persistenceAvailable?: boolean;
};

// ─── Manifest sort ─────────────────────────────────────────────────────────────
//
// Primary: urgency tier (priority → watch → normal → completed)
// Secondary within tier: temporal pressure (overdue → critical → on-time)
//
// Completed orders always sink to the bottom of the manifest regardless of
// urgency so coordinators can focus on active movement pressure.

const urgencyOrder = { priority: 0, watch: 1, normal: 2 } as const;

function sortShipments(shipments: Shipment[], productionMinutes: number): Shipment[] {
  return [...shipments].sort((a, b) => {
    const aCompleted = a.status === "Completed" ? 1 : 0;
    const bCompleted = b.status === "Completed" ? 1 : 0;
    if (aCompleted !== bCompleted) return aCompleted - bCompleted;

    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;

    return temporalSortKey(a, productionMinutes) - temporalSortKey(b, productionMinutes);
  });
}

/**
 * Returns a sort key based on temporal pressure for an order.
 * Lower = surfaces higher in the queue.
 */
function temporalSortKey(s: Shipment, productionMinutes: number): number {
  if (s.status === "Completed") return 90;
  if (s.status === "On Hold" || s.status === "Awaiting Clearance") return 5;

  const etaMin = parseProductionMinutes(s.eta) ?? parseProductionMinutes(s.etaMeta);
  if (etaMin === null) return 20;

  const delta = etaMin - productionMinutes;
  if (delta < 0) return 0;
  if (delta < 20) return 10;
  if (delta < 60) return 30;
  return 50;
}

export function Logistics({
  shipments,
  driverAssignments,
  drivers,
  vendors,
  dataSource: _dataSource = "live",
  fallbackReason = null,
}: LogisticsProps) {
  const productionMinutes = parseProductionMinutes(PRODUCTION_TIME) ?? 0;
  const sortedShipments = React.useMemo(
    () => sortShipments(shipments, productionMinutes),
    [shipments, productionMinutes],
  );

  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(
    () => sortShipments(shipments, productionMinutes)[0]?.id ?? null,
  );
  const [pendingSelectId, setPendingSelectId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelectedOrderId((current) => {
      if (current && sortedShipments.some((shipment) => shipment.id === current)) return current;
      return sortedShipments[0]?.id ?? null;
    });
  }, [sortedShipments]);

  React.useEffect(() => {
    if (!pendingSelectId) return;
    if (sortedShipments.some((shipment) => shipment.id === pendingSelectId)) {
      setSelectedOrderId(pendingSelectId);
      setPendingSelectId(null);
    }
  }, [sortedShipments, pendingSelectId]);

  const handleTransportOrderCreated = React.useCallback((id: string) => {
    setPendingSelectId(id);
    setSelectedOrderId(id);
  }, []);

  const derivedStates = React.useMemo(
    () => computeGlobalPropagation(sortedShipments, operationalConditions, activeCallsheetRevision, driverAssignments),
    [sortedShipments, driverAssignments],
  );

  const selectedShipment = shipments.find((s) => s.id === selectedOrderId) ?? null;
  const selectedAssignment = driverAssignments.find((da) => da.linkedOrderId === selectedOrderId) ?? null;
  const selectedDerived = selectedOrderId ? (derivedStates.get(selectedOrderId) ?? null) : null;
  const linkedConditions = selectedDerived?.linkedConditions ?? [];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {fallbackReason && shipments.length === 0 ? (
        <div className="shrink-0 border-border border-b bg-muted/20 px-4 py-2 text-muted-foreground text-sm">
          {fallbackReason}
        </div>
      ) : null}

      <div
        data-content-padding="false"
        className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[288px_minmax(0,1fr)_240px] lg:divide-x"
      >
        {/* LEFT — Compact transport manifest */}
        <div className="h-full overflow-hidden">
          <TransportQueue
            shipments={sortedShipments}
            derivedStates={derivedStates}
            selectedShipmentId={selectedOrderId}
            onSelectShipment={setSelectedOrderId}
            productionTime={PRODUCTION_TIME}
            vendors={vendors}
            drivers={drivers}
            onTransportOrderCreated={handleTransportOrderCreated}
          />
        </div>

        {/* CENTER — Order detail with propagation banners and embedded map. */}
        <div className="hidden h-full overflow-hidden lg:block lg:pt-[104px]">
          <TransportDetail
            shipment={selectedShipment}
            assignment={selectedAssignment}
            derived={selectedDerived}
            linkedConditions={linkedConditions}
          />
        </div>

        {/* RIGHT — Operational intelligence: conditions, revision, rush queue */}
        <div className="hidden h-full overflow-hidden lg:block">
          <OperationalIntelligence
            selectedOrderId={selectedOrderId}
            shipments={shipments}
            conditions={operationalConditions}
            revision={activeCallsheetRevision}
            derivedStates={derivedStates}
          />
        </div>
      </div>
    </div>
  );
}
