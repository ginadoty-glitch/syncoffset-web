"use client";

import { useEffect, useState, useTransition } from "react";

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
import { VENDOR_CATEGORIES } from "@/lib/vendors/constants";
import type { VendorRow } from "@/lib/vendors/types";
import { createVendor, updateVendor } from "@/server/vendor-actions";

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs";

type VendorFormDialogProps = {
  vendor?: VendorRow | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  onSaved?: () => void;
};

export function VendorFormDialog({
  vendor,
  open: controlledOpen,
  onOpenChange,
  trigger,
  onSaved,
}: VendorFormDialogProps) {
  const isEdit = Boolean(vendor?.id);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("other");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [gstConfirmed, setGstConfirmed] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(vendor?.name ?? "");
    setCategory(vendor?.category?.trim() || "other");
    setAddress(vendor?.address ?? "");
    setPhone(vendor?.phone ?? "");
    setEmail(vendor?.email ?? "");
    setGstNumber(vendor?.gst_number ?? "");
    setGstConfirmed(vendor?.gst_confirmed ?? false);
    setAccountNumber(vendor?.account_number ?? "");
    setCreditLimit(vendor?.credit_limit != null ? String(vendor.credit_limit) : "");
    setError(null);
  }, [open, vendor]);

  function handleSubmit() {
    startTransition(async () => {
      const form = {
        name,
        category: category === "all" ? "other" : category,
        address,
        phone,
        email,
        gst_number: gstNumber,
        gst_confirmed: gstConfirmed,
        account_number: accountNumber,
        credit_limit: creditLimit,
      };
      if (isEdit) {
        if (!vendor?.id) {
          setError("Missing vendor id.");
          return;
        }
        const result = await updateVendor(vendor.id, form);
        if (result.ok) {
          toast.success("Vendor saved");
          setOpen(false);
          onSaved?.();
        } else {
          setError(result.error);
        }
        return;
      }
      const result = await createVendor(form);
      if (result.ok) {
        toast.success("Vendor added");
        setOpen(false);
        onSaved?.();
      } else {
        setError(result.error);
      }
    });
  }

  const body = (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Update vendor directory entry." : "Add a supplier, rental house, or vendor contact."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="vendor-name">Name *</Label>
          <Input id="vendor-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Vendor name" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="vendor-category">Category</Label>
            <select
              id="vendor-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              {VENDOR_CATEGORIES.filter((c) => c !== "all").map((c) => (
                <option key={c} value={c}>
                  {c.replace(/-/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vendor-phone">Phone</Label>
            <Input id="vendor-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vendor-address">Address</Label>
          <Input id="vendor-address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vendor-email">Email</Label>
          <Input id="vendor-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="vendor-gst">GST number</Label>
            <Input id="vendor-gst" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vendor-account">Account number</Label>
            <Input id="vendor-account" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="vendor-credit">Credit limit</Label>
            <Input id="vendor-credit" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} />
          </div>
          <div className="flex items-end gap-2 pb-1">
            <input
              id="vendor-gst-confirmed"
              type="checkbox"
              checked={gstConfirmed}
              onChange={(e) => setGstConfirmed(e.target.checked)}
              className="size-4"
            />
            <Label htmlFor="vendor-gst-confirmed">GST confirmed</Label>
          </div>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isPending || !name.trim()}>
          {isPending ? "Saving…" : isEdit ? "Save Vendor" : "Add Vendor"}
        </Button>
      </DialogFooter>
    </>
  );

  if (trigger !== undefined || !isEdit) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger !== undefined ? (
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        ) : (
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[520px]">{body}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[520px]">{body}</DialogContent>
    </Dialog>
  );
}
