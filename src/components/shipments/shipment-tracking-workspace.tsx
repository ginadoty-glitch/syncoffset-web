"use client";

import { useCallback, useMemo, useState } from "react";

import Link from "next/link";

import { ProductionReadDetailField } from "@/components/production-read/production-read-detail-field";
import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import { ProductionReadWorkspace } from "@/components/production-read/production-read-workspace";
import type { RunsheetOption } from "@/lib/logistics/load-runsheet-options";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import type { ShipmentLogRow } from "@/lib/shipments/load-shipment-logs";
import type { VendorRow } from "@/lib/vendors/types";

import { ShipmentFormDialog } from "./shipment-form-dialog";

function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function runsheetLabel(row: RunsheetOption): string {
  const parts = [row.po_number, row.pickup_vendor_name, row.dropoff_location_name].filter(Boolean);
  if (parts.length > 0) return parts.join(" · ");
  return row.pickup_address?.trim() || row.id.slice(0, 8);
}

export function ShipmentTrackingWorkspace({
  shipments,
  vendors,
  runsheets,
  showName,
  loadError,
}: {
  shipments: ProductionReadResult<ShipmentLogRow>;
  vendors: VendorRow[];
  runsheets: RunsheetOption[];
  showName?: string | null;
  loadError: string | null;
}) {
  const runsheetById = useMemo(() => new Map(runsheets.map((row) => [row.id, row])), [runsheets]);
  const [focusRowId, setFocusRowId] = useState<string | null>(null);

  const handleCreated = useCallback((id: string) => {
    setFocusRowId(id);
  }, []);

  return (
    <ProductionReadShell
      showName={showName}
      eyebrow="Logistics · Shipments"
      title="Shipment Tracking"
      subtitle="Inbound/outbound shipments · shipments table · live Supabase"
      tableLabel="shipments"
      count={shipments.rows.length}
      loadError={loadError ?? shipments.loadError}
      emptyMessage="No shipments in"
      actions={<ShipmentFormDialog vendors={vendors} runsheets={runsheets} onCreated={handleCreated} />}
      emptyActions={<ShipmentFormDialog vendors={vendors} runsheets={runsheets} onCreated={handleCreated} />}
    >
      {shipments.rows.length > 0 ? (
        <ProductionReadWorkspace
          key={focusRowId ?? "shipments"}
          rows={shipments.rows}
          searchPlaceholder="Search origin, destination, carrier, tracking…"
          getSearchText={(row) =>
            [row.origin, row.destination, row.carrier, row.tracking_number, row.status, row.direction]
              .filter(Boolean)
              .join(" ")
          }
          renderListLabel={(row) => row.origin}
          renderListMeta={(row) => [row.direction, row.destination, row.tracking_number].filter(Boolean).join(" · ")}
          emptySelectionMessage="Select a shipment to view tracking detail."
          initialSelectedId={focusRowId}
          renderDetail={(row) => {
            const linkedRunsheet = row.runsheet_id ? runsheetById.get(row.runsheet_id) : undefined;
            return (
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-[10px] text-[var(--desk-primary)] uppercase tracking-[0.06em]">
                    Shipment detail
                  </p>
                  <h3 className="font-extrabold text-lg tracking-tight">{row.origin}</h3>
                  <p className="text-muted-foreground text-sm capitalize">
                    {row.direction} · {row.status.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ProductionReadDetailField label="Origin" value={row.origin} />
                  <ProductionReadDetailField label="Destination" value={row.destination} />
                  <ProductionReadDetailField label="Carrier" value={row.carrier} />
                  <ProductionReadDetailField label="Tracking" value={row.tracking_number} mono />
                  <ProductionReadDetailField label="Status" value={row.status.replace(/_/g, " ")} />
                  <ProductionReadDetailField label="Direction" value={row.direction} />
                  <ProductionReadDetailField label="Logged" value={formatTimestamp(row.created_at)} />
                  <ProductionReadDetailField label="Updated" value={formatTimestamp(row.updated_at)} />
                </div>
                {linkedRunsheet ? (
                  <div className="rounded-lg border border-[var(--desk-border-subtle)] bg-[var(--desk-surface-elevated)]/40 p-3">
                    <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-[0.06em]">
                      Linked Transport Order
                    </p>
                    <p className="mt-1 font-medium text-sm">{runsheetLabel(linkedRunsheet)}</p>
                    <Link
                      href="/dashboard/logistics/transport-orders"
                      className="mt-2 inline-block text-[var(--desk-primary)] text-xs underline-offset-2 hover:underline"
                    >
                      Open Transport Orders manifest
                    </Link>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No transport order linked.</p>
                )}
              </div>
            );
          }}
        />
      ) : null}
    </ProductionReadShell>
  );
}
