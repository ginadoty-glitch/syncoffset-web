"use client";

import { ProductionReadDetailField } from "@/components/production-read/production-read-detail-field";
import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import { ProductionReadWorkspace } from "@/components/production-read/production-read-workspace";
import type { LocationRow } from "@/lib/locations/types";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";

function mapsLink(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

export function LocationsIndex({ data }: { data: ProductionReadResult<LocationRow> }) {
  return (
    <ProductionReadShell
      eyebrow="Production · Locations"
      title="Locations"
      subtitle="Read-only · locations table · live Supabase"
      tableLabel="locations"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No locations in"
    >
      <ProductionReadWorkspace
        rows={data.rows}
        searchPlaceholder="Search locations…"
        getSearchText={(row) => [row.name, row.address, row.notes ?? ""].join(" ")}
        renderListLabel={(row) => row.name}
        renderListMeta={(row) => row.address}
        renderDetail={(row) => {
          const link = mapsLink(row.address);
          return (
            <div>
              <h2 className="text-[15px] font-extrabold tracking-[-0.02em]">{row.name}</h2>
              <dl className="mt-3">
                <ProductionReadDetailField label="Address" value={row.address} />
                <ProductionReadDetailField label="Notes" value={row.notes?.trim() || null} />
                <ProductionReadDetailField
                  label="Parking notes"
                  value={
                    <span className="text-[var(--desk-text-dim)] text-[11px]">
                      Not stored on locations row — check notes or location manager on mobile.
                    </span>
                  }
                />
                <ProductionReadDetailField
                  label="Permit notes"
                  value={
                    <span className="text-[var(--desk-text-dim)] text-[11px]">
                      Not stored on locations row — check notes or location manager on mobile.
                    </span>
                  }
                />
                <ProductionReadDetailField
                  label="Contact info"
                  value={
                    <span className="text-[var(--desk-text-dim)] text-[11px]">
                      Not stored on locations row — use notes if recorded by production.
                    </span>
                  }
                />
                <ProductionReadDetailField
                  label="Map"
                  value={
                    link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] font-extrabold text-primary underline"
                      >
                        Open in Maps
                      </a>
                    ) : null
                  }
                />
              </dl>
            </div>
          );
        }}
      />
    </ProductionReadShell>
  );
}
