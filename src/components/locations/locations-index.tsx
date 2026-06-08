"use client";

import Link from "next/link";

import { Camera, FileText, Upload } from "lucide-react";

import { ProductionReadDetailField } from "@/components/production-read/production-read-detail-field";
import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import { ProductionReadWorkspace } from "@/components/production-read/production-read-workspace";
import { Button } from "@/components/ui/button";
import type { LocationRow } from "@/lib/locations/types";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";

function mapsLink(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

export function LocationsIndex({
  data,
  showName,
}: {
  data: ProductionReadResult<LocationRow>;
  showName?: string | null;
}) {
  return (
    <ProductionReadShell
      showName={showName}
      eyebrow="Production · Locations"
      title="Locations"
      subtitle="Read-only · locations table · live Supabase"
      tableLabel="locations"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No locations in"
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/ingestion/upload?kind=reference-media&label=Location+Photos">
              <Camera className="mr-2 size-4" />
              Upload Photos
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/ingestion/upload?kind=location-package&label=Location+Documents">
              <FileText className="mr-2 size-4" />
              Upload Documents
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/ingestion/upload?kind=location-package&label=Site+Plan">
              <Upload className="mr-2 size-4" />
              Upload Site Plan
            </Link>
          </Button>
        </>
      }
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
              <h2 className="font-extrabold text-[15px] tracking-[-0.02em]">{row.name}</h2>
              <dl className="mt-3">
                <ProductionReadDetailField label="Address" value={row.address} />
                <ProductionReadDetailField label="Notes" value={row.notes?.trim() || null} />
                <ProductionReadDetailField
                  label="Parking notes"
                  value={
                    <span className="text-[11px] text-[var(--desk-text-dim)]">
                      Not stored on locations row — check notes or location manager on mobile.
                    </span>
                  }
                />
                <ProductionReadDetailField
                  label="Permit notes"
                  value={
                    <span className="text-[11px] text-[var(--desk-text-dim)]">
                      Not stored on locations row — check notes or location manager on mobile.
                    </span>
                  }
                />
                <ProductionReadDetailField
                  label="Contact info"
                  value={
                    <span className="text-[11px] text-[var(--desk-text-dim)]">
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
                        className="font-extrabold text-[13px] text-primary underline"
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
