import type { ReactNode } from "react";

export function ProductionReadDetailField({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="grid gap-1 border-[var(--desk-border-subtle)] border-b py-2.5 last:border-b-0">
      <dt className="font-bold text-[10px] text-[var(--desk-text-dim)] uppercase tracking-[0.06em]">{label}</dt>
      <dd className={`text-[13px] leading-[18px] ${mono ? "font-mono text-xs" : ""}`}>{value ?? "—"}</dd>
    </div>
  );
}
