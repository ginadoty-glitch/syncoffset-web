import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import {
  ProductionReadTable,
  ProductionReadTableBody,
  ProductionReadTableHead,
  ProductionReadTd,
  ProductionReadTh,
  ProductionReadTr,
} from "@/components/production-read/production-read-table";
import type { LocationRow } from "@/lib/locations/types";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";

function formatUpdatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function LocationsIndex({ data }: { data: ProductionReadResult<LocationRow> }) {
  return (
    <ProductionReadShell
      eyebrow="Production · Locations"
      title="Locations"
      subtitle="Read-only · live Supabase · Expo-authored data"
      tableLabel="locations"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No locations in"
    >
      <ProductionReadTable>
        <ProductionReadTableHead>
          <ProductionReadTh>Name</ProductionReadTh>
          <ProductionReadTh>Address</ProductionReadTh>
          <ProductionReadTh>Notes</ProductionReadTh>
          <ProductionReadTh className="text-right">Updated</ProductionReadTh>
        </ProductionReadTableHead>
        <ProductionReadTableBody>
          {data.rows.map((row) => (
            <ProductionReadTr key={row.id}>
              <ProductionReadTd>
                <span className="font-medium">{row.name}</span>
              </ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground">{row.address}</ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground">{row.notes?.trim() || "—"}</ProductionReadTd>
              <ProductionReadTd className="text-right tabular-nums text-muted-foreground text-xs">
                {formatUpdatedAt(row.updated_at)}
              </ProductionReadTd>
            </ProductionReadTr>
          ))}
        </ProductionReadTableBody>
      </ProductionReadTable>
    </ProductionReadShell>
  );
}
