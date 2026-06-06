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
    <div
      data-content-padding="false"
      className="mx-auto flex h-full max-w-[1600px] flex-col gap-3 px-4 py-5 md:px-5 md:py-6"
    >
      <header className="shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--desk-primary)]">{eyebrow}</p>
        <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-0.5 text-muted-foreground text-xs">
          {subtitle} · <span className="font-mono tabular-nums">{count}</span> records
        </p>
      </header>

      {loadError ? (
        <div
          className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2.5 font-mono text-destructive text-xs"
          role="alert"
        >
          {loadError}
        </div>
      ) : null}

      {!loadError && count === 0 ? (
        <div className="rounded-lg border border-[var(--desk-border-subtle)] bg-[var(--desk-surface-elevated)]/30 px-4 py-8 text-center text-muted-foreground text-sm">
          {emptyMessage} <code className="rounded bg-muted px-1 text-xs">{tableLabel}</code> for this production.
        </div>
      ) : null}

      {!loadError && count > 0 ? children : null}
    </div>
  );
}
