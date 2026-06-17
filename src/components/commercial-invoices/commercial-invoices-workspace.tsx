"use client";

import { useState, useTransition } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VendorPicker, type VendorSelection } from "@/components/vendors/vendor-picker";
import type { CommercialInvoiceRow } from "@/lib/commercial-invoices/load-commercial-invoices";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import type { VendorRow } from "@/lib/vendors/types";
import { createCommercialInvoiceRecord } from "@/server/commercial-invoice-actions";

export function CommercialInvoicesWorkspace({
  invoices,
  vendors,
  showName,
  loadError,
}: {
  invoices: ProductionReadResult<CommercialInvoiceRow>;
  vendors: VendorRow[];
  showName?: string | null;
  loadError: string | null;
}) {
  const [vendor, setVendor] = useState<VendorSelection | null>(null);
  const [title, setTitle] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    if (!vendor) {
      toast.error("Select a vendor.");
      return;
    }
    startTransition(async () => {
      const result = await createCommercialInvoiceRecord({
        vendorId: vendor.id,
        vendorName: vendor.name,
        title: title || undefined,
        invoiceNo: invoiceNo || undefined,
      });
      if (result.ok) {
        toast.success("Commercial invoice staged");
        setTitle("");
        setInvoiceNo("");
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
        <h1 className="font-extrabold text-2xl tracking-tight">Commercial Invoices</h1>
        <p className="text-muted-foreground text-sm">Vendor-linked CI records · pai_assets · live Supabase</p>
      </header>

      <section className="rounded-lg border border-[var(--desk-border-subtle)] bg-[var(--desk-surface-elevated)] p-4">
        <h2 className="font-bold text-sm">Stage commercial invoice</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Vendor *</Label>
            <VendorPicker vendors={vendors} value={vendor} onChange={setVendor} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ci-invoice-no">Invoice number</Label>
            <Input
              id="ci-invoice-no"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="CI-0042"
            />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="ci-title">Title</Label>
            <Input
              id="ci-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Commercial Invoice — Camera Package"
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleCreate} disabled={isPending || !vendor}>
          <Plus className="mr-2 size-4" />
          {isPending ? "Saving…" : "Stage Invoice"}
        </Button>
      </section>

      <section>
        <h2 className="mb-3 font-bold text-sm">Records ({invoices.rows.length})</h2>
        {loadError ? <p className="text-destructive text-sm">{loadError}</p> : null}
        {invoices.rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">No commercial invoices staged for this production.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[var(--desk-border-subtle)]">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Vendor</th>
                  <th className="px-3 py-2">Invoice #</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {invoices.rows.map((row) => {
                  const meta = row.metadata ?? {};
                  const vendorName = typeof meta.vendor_name === "string" ? meta.vendor_name : "—";
                  const invNo = typeof meta.invoice_no === "string" ? meta.invoice_no : "—";
                  return (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="px-3 py-2 font-medium">{row.title ?? "—"}</td>
                      <td className="px-3 py-2">{vendorName}</td>
                      <td className="px-3 py-2 font-mono text-xs">{invNo}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
