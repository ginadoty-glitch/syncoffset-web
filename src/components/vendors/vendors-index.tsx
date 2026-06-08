"use client";

import { useMemo, useState } from "react";

import { ProductionReadDetailField } from "@/components/production-read/production-read-detail-field";
import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import { ProductionReadWorkspace } from "@/components/production-read/production-read-workspace";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import { cn } from "@/lib/utils";
import type { VendorRow } from "@/lib/vendors/types";

export function VendorsIndex({ data, showName }: { data: ProductionReadResult<VendorRow>; showName?: string | null }) {
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const fromRows = new Set(data.rows.map((r) => r.category?.trim()).filter(Boolean) as string[]);
    return ["all", ...Array.from(fromRows).sort()];
  }, [data.rows]);

  const filteredRows = useMemo(() => {
    if (category === "all") return data.rows;
    return data.rows.filter((row) => (row.category ?? "").toLowerCase() === category.toLowerCase());
  }, [category, data.rows]);

  return (
    <ProductionReadShell
      showName={showName}
      eyebrow="Accounting · Vendors"
      title="Vendor Lists"
      subtitle="Read-only · vendors table · live Supabase"
      tableLabel="vendors"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No vendors in"
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
            <h2 className="font-extrabold text-[15px] tracking-[-0.02em]">{row.name}</h2>
            {row.category ? (
              <p className="mt-1 font-bold text-[10px] text-[var(--desk-text-dim)] uppercase tracking-[0.06em]">
                {row.category}
              </p>
            ) : null}
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
    </ProductionReadShell>
  );
}
