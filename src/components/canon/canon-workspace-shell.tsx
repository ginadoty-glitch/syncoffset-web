import type { LucideIcon } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

type CanonWorkspaceShellProps = {
  group: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export function CanonWorkspaceShell({ group, title, description, icon: Icon }: CanonWorkspaceShellProps) {
  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header className="shrink-0">
        <p className="text-muted-foreground text-xs uppercase tracking-widest">{group}</p>
        <h1 className="text-2xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
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
