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
            <h2 className="text-[15px] font-extrabold tracking-[-0.02em]">{tripLabel(row)}</h2>
            <p className="mt-1 text-[10px] font-bold text-[var(--desk-text-dim)] uppercase tracking-[0.06em]">
              {row.status}
            </p>
            <dl className="mt-3">
              <ProductionReadDetailField label="Driver" value={row.driver_sub} mono />
              <ProductionReadDetailField label="Designation" value={row.designation} />
              <ProductionReadDetailField label="PO number" value={row.po_number} mono />
              <ProductionReadDetailField label="ROS" value={row.ros} mono />
              <ProductionReadDetailField label="Updated" value={formatWhen(row.updated_at)} />
            </dl>

            {row.stops.length > 0 ? (
              <div className="mt-5">
                <h3 className="mb-2 text-[10px] font-bold text-[var(--desk-text-dim)] uppercase tracking-[0.06em]">
                  Stops ({row.stops.length})
                </h3>
                <ol className="space-y-1.5">
                  {row.stops.map((stop, index) => (
                    <li
                      key={stop.id}
                      className="rounded-lg border border-[var(--desk-border-subtle)] bg-[var(--desk-surface-elevated)] px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[var(--desk-text-dim)]">{index + 1}</span>
                        <span
                          className={cn(
                            "rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em]",
                            stop.kind === "pickup"
                              ? "border-[var(--desk-marigold)]/40 bg-[var(--desk-marigold)]/10 text-[var(--desk-marigold)]"
                              : "border-[var(--desk-border-subtle)] text-muted-foreground",
                          )}
                        >
                          {stop.kind}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--desk-text-dim)] uppercase tracking-[0.04em]">
                          {stop.status}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-[18px]">{stop.address}</p>
                      {stop.vendor_name ? (
                        <p className="mt-0.5 text-[11px] leading-[15px] text-muted-foreground">{stop.vendor_name}</p>
                      ) : null}
                      {stop.notes?.trim() ? (
                        <p className="mt-1 text-[11px] leading-[15px] text-muted-foreground">{stop.notes.trim()}</p>
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
