import type { ReactNode } from "react";

export function ProductionReadDetailField({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="grid gap-1 border-border/60 border-b py-2.5 last:border-b-0">
      <dt className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</dt>
      <dd className={`text-sm ${mono ? "font-mono text-xs" : ""}`}>{value ?? "—"}</dd>
    </div>
  );
}
