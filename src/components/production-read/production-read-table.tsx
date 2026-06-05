import type { ReactNode } from "react";

export function ProductionReadTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function ProductionReadTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-border border-b bg-muted/40 text-left text-muted-foreground text-xs uppercase tracking-wide">
        {children}
      </tr>
    </thead>
  );
}

export function ProductionReadTh({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-2.5 font-medium ${className ?? ""}`}>{children}</th>;
}

export function ProductionReadTableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function ProductionReadTr({ children }: { children: ReactNode }) {
  return <tr className="align-top hover:bg-muted/30">{children}</tr>;
}

export function ProductionReadTd({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ""}`}>{children}</td>;
}
