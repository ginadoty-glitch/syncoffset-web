import type { ReactNode } from "react";

type ProductionReadShellProps = {
  showName?: string | null;
  eyebrow: string;
  title: string;
  subtitle: string;
  tableLabel: string;
  count: number;
  loadError: string | null;
  emptyMessage: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function ProductionReadShell({
  showName,
  eyebrow,
  title,
  subtitle,
  tableLabel,
  count,
  loadError,
  emptyMessage,
  actions,
  children,
}: ProductionReadShellProps) {
  return (
    <div
      data-content-padding="false"
      className="mx-auto flex h-full max-w-[1600px] flex-col gap-3 px-4 py-5 md:px-5 md:py-6"
    >
      <header className="flex shrink-0 items-start justify-between gap-4">
        <div>
          {showName ? <h1 className="font-extrabold text-2xl tracking-tight">{showName}</h1> : null}
          <p className="font-bold text-[10px] text-[var(--desk-primary)] uppercase tracking-[0.06em]">{eyebrow}</p>
          {showName ? (
            <h2 className="font-extrabold text-lg tracking-tight">{title}</h2>
          ) : (
            <h1 className="font-extrabold text-xl tracking-tight">{title}</h1>
          )}
          <p className="mt-0.5 text-muted-foreground text-xs">
            {subtitle} · <span className="font-mono tabular-nums">{count}</span> records
          </p>
        </div>
        {actions != null ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
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
