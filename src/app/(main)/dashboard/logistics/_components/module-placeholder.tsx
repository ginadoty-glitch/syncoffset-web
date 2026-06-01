import type { LucideIcon } from "lucide-react";

interface ModulePlaceholderProps {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

export function ModulePlaceholder({ title, description, icon: Icon }: ModulePlaceholderProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-xl border bg-muted/30 text-muted-foreground">
        <Icon className="size-7" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
          <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground text-xs">Coming soon</span>
        </div>
        <p className="mx-auto max-w-md text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
