"use client";

import { useMemo, useState, useTransition } from "react";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ProductionReadDetailField } from "@/components/production-read/production-read-detail-field";
import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import { ProductionReadWorkspace } from "@/components/production-read/production-read-workspace";
import { Button } from "@/components/ui/button";
import { VendorFormDialog } from "@/components/vendors/vendor-form-dialog";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import { cn } from "@/lib/utils";
import type { VendorRow } from "@/lib/vendors/types";
import { deleteVendor } from "@/server/vendor-actions";

export function VendorsIndex({ data, showName }: { data: ProductionReadResult<VendorRow>; showName?: string | null }) {
  const [category, setCategory] = useState<string>("all");
  const [editing, setEditing] = useState<VendorRow | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(() => {
    const fromRows = new Set(data.rows.map((r) => r.category?.trim()).filter(Boolean) as string[]);
    return ["all", ...Array.from(fromRows).sort()];
  }, [data.rows]);

  const filteredRows = useMemo(() => {
    if (category === "all") return data.rows;
    return data.rows.filter((row) => (row.category ?? "").toLowerCase() === category.toLowerCase());
  }, [category, data.rows]);

  function handleDelete(id: string, name: string) {
    startTransition(async () => {
      const result = await deleteVendor(id);
      if (result.ok) {
        toast.success(`Deleted ${name}`);
        setPendingDeleteId(null);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <ProductionReadShell
      showName={showName}
      eyebrow="Accounting · Vendors"
      title="Vendor Lists"
      subtitle="Vendor directory · vendors table · live Supabase"
      tableLabel="vendors"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No vendors in"
      actions={<VendorFormDialog />}
      emptyActions={<VendorFormDialog />}
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full border px-2.5 py-1 font-bold text-[11px] uppercase tracking-[0.04em]",
              category === cat
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-[var(--desk-border-subtle)] bg-[var(--desk-surface-elevated)] text-muted-foreground",
            )}
          >
            {cat === "all" ? "All" : cat.replace(/-/g, " ")}
          </button>
        ))}
      </div>

      <ProductionReadWorkspace
        rows={filteredRows}
        searchPlaceholder="Search vendors…"
        getSearchText={(row) =>
          [row.name, row.phone ?? "", row.email ?? "", row.address ?? "", row.category ?? ""].join(" ")
        }
        renderListLabel={(row) => row.name}
        renderListMeta={(row) => [row.category, row.phone].filter(Boolean).join(" · ")}
        renderDetail={(row) => (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-[15px] tracking-[-0.02em]">{row.name}</h2>
                {row.category ? (
                  <p className="mt-1 font-bold text-[10px] text-[var(--desk-text-dim)] uppercase tracking-[0.06em]">
                    {row.category}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(row);
                    setEditOpen(true);
                  }}
                >
                  <Pencil className="mr-1 size-3.5" />
                  Edit
                </Button>
                {pendingDeleteId === row.id ? (
                  <div className="flex gap-1">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleDelete(row.id, row.name)}
                    >
                      Confirm
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPendingDeleteId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setPendingDeleteId(row.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>
            <dl className="mt-3">
              <ProductionReadDetailField label="Phone" value={row.phone} mono />
              <ProductionReadDetailField label="Email" value={row.email} />
              <ProductionReadDetailField label="Address" value={row.address} />
              <ProductionReadDetailField label="GST number" value={row.gst_number} mono />
              <ProductionReadDetailField
                label="GST confirmed"
                value={row.gst_confirmed == null ? null : row.gst_confirmed ? "Yes" : "No"}
              />
              <ProductionReadDetailField label="Account number" value={row.account_number} mono />
              <ProductionReadDetailField
                label="Credit limit"
                value={row.credit_limit != null ? `$${row.credit_limit.toLocaleString()}` : null}
              />
            </dl>
          </div>
        )}
      />

      {editing ? (
        <VendorFormDialog
          vendor={editing}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSaved={() => setEditing(null)}
        />
      ) : null}
    </ProductionReadShell>
  );
}
