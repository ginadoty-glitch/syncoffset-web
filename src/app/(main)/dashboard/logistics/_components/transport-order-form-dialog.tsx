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
import type { VendorRow } from "@/lib/vendors/types";
import { createTransportOrder } from "@/server/transport-order-actions";

import type { DriverRow } from "../_lib/logistics-desk-types";

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs";

type TransportOrderFormDialogProps = {
  vendors: VendorRow[];
  drivers: DriverRow[];
  trigger?: React.ReactNode;
  onCreated?: (id: string) => void;
};

function todayYmd(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function TransportOrderFormDialog({ vendors, drivers, trigger, onCreated }: TransportOrderFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [orderNumber, setOrderNumber] = useState("");
  const [vendor, setVendor] = useState<VendorSelection | null>(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [requestedDate, setRequestedDate] = useState(todayYmd());
  const [driverSub, setDriverSub] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setOrderNumber("");
    setVendor(null);
    setPickupLocation("");
    setDeliveryLocation("");
    setRequestedDate(todayYmd());
    setDriverSub("");
    setNotes("");
    setError(null);
  }, [open]);

  useEffect(() => {
    if (!vendor) return;
    const match = vendors.find((v) => v.id === vendor.id);
    if (match?.address?.trim() && !pickupLocation.trim()) {
      setPickupLocation(match.address.trim());
    }
  }, [vendor, vendors, pickupLocation]);

  function handleSubmit() {
    startTransition(async () => {
      setError(null);
      const result = await createTransportOrder({
        orderNumber,
        vendorId: vendor?.id,
        vendorName: vendor?.name ?? "",
        pickupLocation,
        deliveryLocation,
        requestedDate,
        driverSub: driverSub || undefined,
        notes: notes || undefined,
      });

      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("Transport order saved");
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
            New Transport Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>New Transport Order</DialogTitle>
          <DialogDescription>Manual transport order — saved to runsheets · live Supabase.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="to-order-number">Order number *</Label>
            <Input
              id="to-order-number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="TO-0042"
            />
          </div>
          <div className="grid gap-2">
            <Label>Vendor *</Label>
            <VendorPicker vendors={vendors} value={vendor} onChange={setVendor} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="to-pickup">Pickup location *</Label>
              <Input
                id="to-pickup"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Burnaby Warehouse"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to-delivery">Delivery location *</Label>
              <Input
                id="to-delivery"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Runaway Stage"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="to-date">Requested date *</Label>
              <Input
                id="to-date"
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to-driver">Assigned driver</Label>
              <select
                id="to-driver"
                value={driverSub}
                onChange={(e) => setDriverSub(e.target.value)}
                className={selectClass}
              >
                <option value="">Unassigned</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.user_sub}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="to-notes">Notes</Label>
            <Input
              id="to-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ontario shipment arrival"
            />
          </div>
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving…" : "Save Transport Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
