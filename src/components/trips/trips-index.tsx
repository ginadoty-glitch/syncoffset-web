"use client";

import { ProductionReadDetailField } from "@/components/production-read/production-read-detail-field";
import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import { ProductionReadWorkspace } from "@/components/production-read/production-read-workspace";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";
import type { TripRow } from "@/lib/trips/types";
import { cn } from "@/lib/utils";

function tripLabel(row: TripRow): string {
  return row.po_number?.trim() || row.ros?.trim() || row.id.slice(0, 8);
}

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function TripsIndex({ data }: { data: ProductionReadResult<TripRow> }) {
  return (
    <ProductionReadShell
      eyebrow="Logistics · Trips"
      title="Trips"
      subtitle="Read-only · trips + trip_stops · live Supabase"
      tableLabel="trips"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No trips in"
    >
      <ProductionReadWorkspace
        rows={data.rows}
        searchPlaceholder="Search trips…"
        getSearchText={(row) =>
          [
            tripLabel(row),
            row.driver_sub ?? "",
            row.status,
            row.designation,
            ...row.stops.map((s) => [s.address, s.vendor_name ?? "", s.kind].join(" ")),
          ].join(" ")
        }
        renderListLabel={(row) => tripLabel(row)}
        renderListMeta={(row) =>
          [row.status, row.driver_sub, `${row.stops.length} stop${row.stops.length === 1 ? "" : "s"}`]
            .filter(Boolean)
            .join(" · ")
        }
        renderDetail={(row) => (
          <div>
            <h2 className="font-semibold text-lg tracking-tight">{tripLabel(row)}</h2>
            <p className="mt-1 text-muted-foreground text-xs uppercase tracking-wide">{row.status}</p>
            <dl className="mt-4">
              <ProductionReadDetailField label="Driver" value={row.driver_sub} mono />
              <ProductionReadDetailField label="Designation" value={row.designation} />
              <ProductionReadDetailField label="PO number" value={row.po_number} mono />
              <ProductionReadDetailField label="ROS" value={row.ros} mono />
              <ProductionReadDetailField label="Updated" value={formatWhen(row.updated_at)} />
            </dl>

            {row.stops.length > 0 ? (
              <div className="mt-6">
                <h3 className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-widest">
                  Stops ({row.stops.length})
                </h3>
                <ol className="space-y-2">
                  {row.stops.map((stop, index) => (
                    <li key={stop.id} className="rounded border border-border/60 bg-muted/10 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{index + 1}</span>
                        <span
                          className={cn(
                            "rounded border px-1 py-0.5 text-[10px] uppercase tracking-wide",
                            stop.kind === "pickup"
                              ? "border-[var(--desk-marigold)]/40 text-[var(--desk-marigold)]"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          {stop.kind}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{stop.status}</span>
                      </div>
                      <p className="mt-1 text-sm">{stop.address}</p>
                      {stop.vendor_name ? (
                        <p className="mt-0.5 text-muted-foreground text-xs">{stop.vendor_name}</p>
                      ) : null}
                      {stop.notes?.trim() ? (
                        <p className="mt-1 text-muted-foreground text-xs">{stop.notes.trim()}</p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        )}
      />
    </ProductionReadShell>
  );
}
