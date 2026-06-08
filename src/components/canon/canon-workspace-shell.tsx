import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { getActiveShow } from "@/lib/production/get-active-show";

type CanonWorkspaceShellProps = {
  showName?: string | null;
  group: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ReactNode;
};

export async function CanonWorkspaceShell({
  showName: showNameProp,
  group,
  title,
  description,
  icon: Icon,
  actions,
}: CanonWorkspaceShellProps) {
  const showName = showNameProp ?? (await getActiveShow()).name;
  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex shrink-0 items-start justify-between gap-4">
        <div>
          {showName ? <h1 className="font-extrabold text-2xl tracking-tight">{showName}</h1> : null}
          <p className="text-muted-foreground text-xs uppercase tracking-widest">{group}</p>
          {showName ? (
            <h2 className="text-xl tracking-tight">{title}</h2>
          ) : (
            <h1 className="text-2xl tracking-tight">{title}</h1>
          )}
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {(await actions) ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </header>

      <Empty className="min-h-[200px] border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <EmptyTitle>No data yet</EmptyTitle>
          <EmptyDescription>
            This workspace will display {title.toLowerCase()} when production data is available.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
