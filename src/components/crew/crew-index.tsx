"use client";

import { ProductionReadDetailField } from "@/components/production-read/production-read-detail-field";
import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import { ProductionReadWorkspace } from "@/components/production-read/production-read-workspace";
import type { CrewDirectoryRow } from "@/lib/crew/types";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";

const SOURCE_LABEL: Record<CrewDirectoryRow["source"], string> = {
  contact: "Crew contact",
  driver: "Driver",
  member: "Show member",
};

export function CrewIndex({ data }: { data: ProductionReadResult<CrewDirectoryRow> }) {
  return (
    <ProductionReadShell
      eyebrow="System · Crew"
      title="Crew"
      subtitle="Read-only · crew_contacts + drivers + show_members"
      tableLabel="crew directory"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No crew records in"
    >
      <ProductionReadWorkspace
        rows={data.rows}
        searchPlaceholder="Search crew…"
        getSearchText={(row) =>
          [row.name, row.department ?? "", row.role ?? "", row.position ?? "", row.phone ?? "", row.email ?? ""].join(
            " ",
          )
        }
        renderListLabel={(row) => row.name}
        renderListMeta={(row) =>
          [SOURCE_LABEL[row.source], row.department, row.role ?? row.position].filter(Boolean).join(" · ")
        }
        renderDetail={(row) => (
          <div>
            <h2 className="font-semibold text-lg tracking-tight">{row.name}</h2>
            <p className="mt-1 text-muted-foreground text-xs uppercase tracking-wide">{SOURCE_LABEL[row.source]}</p>
            <dl className="mt-4">
              <ProductionReadDetailField label="Department" value={row.department} />
              <ProductionReadDetailField label="Role" value={row.role} />
              <ProductionReadDetailField label="Position" value={row.position} />
              <ProductionReadDetailField label="Phone" value={row.phone} mono />
              <ProductionReadDetailField label="Email" value={row.email} />
              <ProductionReadDetailField label="Company" value={row.company} />
              <ProductionReadDetailField label="Status" value={row.status} />
              <ProductionReadDetailField label="Notes" value={row.notes} />
            </dl>
          </div>
        )}
      />
    </ProductionReadShell>
  );
}
