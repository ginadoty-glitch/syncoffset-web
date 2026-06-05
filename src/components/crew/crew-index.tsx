import { ProductionReadShell } from "@/components/production-read/production-read-shell";
import {
  ProductionReadTable,
  ProductionReadTableBody,
  ProductionReadTableHead,
  ProductionReadTd,
  ProductionReadTh,
  ProductionReadTr,
} from "@/components/production-read/production-read-table";
import type { CrewContactRow } from "@/lib/crew/types";
import type { ProductionReadResult } from "@/lib/production-read/empty-result";

export function CrewIndex({ data }: { data: ProductionReadResult<CrewContactRow> }) {
  return (
    <ProductionReadShell
      eyebrow="Production · Crew"
      title="Crew"
      subtitle="Read-only · crew_contacts · Expo-authored roster"
      tableLabel="crew_contacts"
      count={data.rows.length}
      loadError={data.loadError}
      emptyMessage="No crew contacts in"
    >
      <ProductionReadTable>
        <ProductionReadTableHead>
          <ProductionReadTh>Name</ProductionReadTh>
          <ProductionReadTh>Department</ProductionReadTh>
          <ProductionReadTh>Position</ProductionReadTh>
          <ProductionReadTh>Phone</ProductionReadTh>
          <ProductionReadTh>Email</ProductionReadTh>
          <ProductionReadTh>Company</ProductionReadTh>
        </ProductionReadTableHead>
        <ProductionReadTableBody>
          {data.rows.map((row) => (
            <ProductionReadTr key={row.id}>
              <ProductionReadTd>
                <span className="font-medium">{row.name}</span>
              </ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground">{row.department ?? "—"}</ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground">{row.position ?? "—"}</ProductionReadTd>
              <ProductionReadTd className="font-mono text-xs tabular-nums">{row.phone ?? "—"}</ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground">{row.email ?? "—"}</ProductionReadTd>
              <ProductionReadTd className="text-muted-foreground">{row.company ?? "—"}</ProductionReadTd>
            </ProductionReadTr>
          ))}
        </ProductionReadTableBody>
      </ProductionReadTable>
    </ProductionReadShell>
  );
}
