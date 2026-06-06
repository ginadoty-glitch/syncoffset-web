import type { ReactNode } from "react";

type ProductionReadShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  tableLabel: string;
  count: number;
  loadError: string | null;
  emptyMessage: string;
  children: ReactNode;
};

export function ProductionReadShell({
  eyebrow,
  title,
  subtitle,
  tableLabel,
  count,
  loadError,
  emptyMessage,
  children,
}: ProductionReadShellProps) {
  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
      <header className="shrink-0">
        <p className="text-muted-foreground text-xs uppercase tracking-widest">{eyebrow}</p>
        <h1 className="text-2xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">
          {subtitle} · <span className="font-mono tabular-nums">{count}</span> records
        </p>
      </header>

      {loadError ? (
        <div
          className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-destructive text-sm"
          role="alert"
        >
          {loadError}
        </div>
      ) : null}

      {!loadError && count === 0 ? (
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-8 text-center text-muted-foreground text-sm">
          {emptyMessage} <code className="rounded bg-muted px-1 text-xs">{tableLabel}</code> for this production.
        </div>
      ) : null}

      {!loadError && count > 0 ? children : null}
    </div>
  );
}
