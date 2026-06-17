"use client";

import { useState, useTransition } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VendorPicker, type VendorSelection } from "@/components/vendors/vendor-picker";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import type { ShipmentLogRow } from "@/lib/shipments/load-shipment-logs";
import type { VendorRow } from "@/lib/vendors/types";
import { createShipmentLog } from "@/server/shipment-actions";

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs";

export function ShipmentTrackingWorkspace({
  shipments,
  vendors,
  showName,
  loadError,
}: {
  shipments: ProductionReadResult<ShipmentLogRow>;
  vendors: VendorRow[];
  showName?: string | null;
  loadError: string | null;
}) {
  const [vendor, setVendor] = useState<VendorSelection | null>(null);
  const [direction, setDirection] = useState<"inbound" | "outbound">("inbound");
  const [destination, setDestination] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    if (!vendor) {
      toast.error("Select a vendor.");
      return;
    }
    startTransition(async () => {
      const result = await createShipmentLog({
        vendorId: vendor.id,
        vendorName: vendor.name,
        direction,
        destination,
        carrier,
        trackingNumber,
      });
      if (result.ok) {
        toast.success("Shipment logged");
        setDestination("");
        setCarrier("");
        setTrackingNumber("");
        setVendor(null);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="mx-auto flex h-full max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="text-muted-foreground text-xs uppercase tracking-widest">{showName ?? "Production"}</p>
        <h1 className="font-extrabold text-2xl tracking-tight">Shipment Tracking</h1>
        <p className="text-muted-foreground text-sm">Vendor sender · shipments table · live Supabase</p>
      </header>

      <section className="rounded-lg border border-[var(--desk-border-subtle)] bg-[var(--desk-surface-elevated)] p-4">
        <h2 className="font-bold text-sm">Log shipment</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Sender / vendor *</Label>
            <VendorPicker vendors={vendors} value={vendor} onChange={setVendor} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ship-direction">Direction</Label>
            <select
              id="ship-direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value as "inbound" | "outbound")}
              className={selectClass}
            >
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ship-destination">Destination</Label>
            <Input id="ship-destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ship-carrier">Carrier</Label>
            <Input id="ship-carrier" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="ship-tracking">Tracking number</Label>
            <Input id="ship-tracking" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
          </div>
        </div>
        <Button className="mt-4" onClick={handleCreate} disabled={isPending || !vendor}>
          <Plus className="mr-2 size-4" />
          {isPending ? "Saving…" : "Log Shipment"}
        </Button>
      </section>

      <section>
        <h2 className="mb-3 font-bold text-sm">Shipments ({shipments.rows.length})</h2>
        {loadError ? <p className="text-destructive text-sm">{loadError}</p> : null}
        {shipments.rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">No shipments logged for this production.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[var(--desk-border-subtle)]">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-2">Vendor (origin)</th>
                  <th className="px-3 py-2">Direction</th>
                  <th className="px-3 py-2">Destination</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Tracking</th>
                </tr>
              </thead>
              <tbody>
                {shipments.rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">{row.origin}</td>
                    <td className="px-3 py-2 capitalize">{row.direction}</td>
                    <td className="px-3 py-2">{row.destination}</td>
                    <td className="px-3 py-2">{row.status}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.tracking_number ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
