"use client";

import { useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VendorPicker, type VendorSelection } from "@/components/vendors/vendor-picker";
import type { RunsheetOption } from "@/lib/logistics/load-runsheet-options";
import type { VendorRow } from "@/lib/vendors/types";
import { createShipmentLog } from "@/server/shipment-actions";

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs";

function runsheetLabel(row: RunsheetOption): string {
  const parts = [row.po_number, row.pickup_vendor_name, row.dropoff_location_name].filter(Boolean);
  if (parts.length > 0) return parts.join(" · ");
  return row.pickup_address?.trim() || row.id.slice(0, 8);
}

type ShipmentFormDialogProps = {
  vendors: VendorRow[];
  runsheets: RunsheetOption[];
  trigger?: React.ReactNode;
  onCreated?: (id: string) => void;
};

export function ShipmentFormDialog({ vendors, runsheets, trigger, onCreated }: ShipmentFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [vendor, setVendor] = useState<VendorSelection | null>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [direction, setDirection] = useState<"inbound" | "outbound">("inbound");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [runsheetId, setRunsheetId] = useState("");

  useEffect(() => {
    if (!open) return;
    setVendor(null);
    setOrigin("");
    setDestination("");
    setDirection("inbound");
    setCarrier("");
    setTrackingNumber("");
    setRunsheetId("");
    setError(null);
  }, [open]);

  function handleSubmit() {
    if (!vendor) {
      toast.error("Select a vendor.");
      return;
    }
    startTransition(async () => {
      setError(null);
      const result = await createShipmentLog({
        vendorName: vendor.name,
        origin,
        destination,
        direction,
        carrier,
        trackingNumber,
        runsheetId: runsheetId || undefined,
      });
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Shipment logged");
      setOpen(false);
      if (result.id) onCreated?.(result.id);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            Log Shipment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Log Shipment</DialogTitle>
          <DialogDescription>Inbound/outbound shipment · shipments table · live Supabase.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Vendor *</Label>
            <VendorPicker vendors={vendors} value={vendor} onChange={setVendor} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ship-origin">Origin *</Label>
              <Input
                id="ship-origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Ontario, Canada"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ship-destination">Destination *</Label>
              <Input
                id="ship-destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Runaway Stage"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="ship-carrier">Carrier</Label>
              <Input
                id="ship-carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="FedEx"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ship-tracking">Tracking number</Label>
            <Input
              id="ship-tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="7728 4412 8891"
            />
          </div>
          {runsheets.length > 0 ? (
            <div className="grid gap-2">
              <Label htmlFor="ship-runsheet">Transport Order</Label>
              <select
                id="ship-runsheet"
                value={runsheetId}
                onChange={(e) => setRunsheetId(e.target.value)}
                className={selectClass}
              >
                <option value="">None</option>
                {runsheets.map((row) => (
                  <option key={row.id} value={row.id}>
                    {runsheetLabel(row)}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isPending || !vendor}>
            {isPending ? "Saving…" : "Save Shipment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
