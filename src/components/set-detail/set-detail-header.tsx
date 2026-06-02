import { SetHeroImage } from "@/components/sets/set-hero-image";
import { Badge } from "@/components/ui/badge";
import type { ProductionSetRow } from "@/lib/sets/workspace-types";
import { cn } from "@/lib/utils";

const SET_STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  active: "Active",
  struck: "Wrapped",
  archived: "Archived",
};

export function SetDetailHeader({
  set,
  episode,
  heroImageDisplayUrl,
}: {
  set: ProductionSetRow | null;
  episode: string | null;
  heroImageDisplayUrl: string | null;
}) {
  if (!set) {
    return (
      <header className="flex flex-col gap-4 rounded-xl border bg-card/40 p-6 md:flex-row md:items-end">
        <SetHeroImage imageUrl={null} alt="Set" aspectClass="aspect-video max-w-md md:w-72" emptyLabel="No set photo" />
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-muted-foreground text-xs uppercase tracking-widest">Set workspace</span>
          <h1 className="text-2xl tracking-tight">Set not found</h1>
          <p className="text-muted-foreground text-sm">
            No production set record for this ID. Apply set workspace migrations and seed a set, or check the URL.
          </p>
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-col gap-4 rounded-xl border bg-card/40 p-6 md:flex-row md:items-stretch">
      <SetHeroImage
        imageUrl={heroImageDisplayUrl}
        alt={`${set.set_name} hero`}
        aspectClass={cn("aspect-[16/9] shrink-0 md:w-80")}
        emptyLabel="No set photo"
      />
      <div className="flex flex-1 flex-col justify-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs tabular-nums">
            {set.set_number}
          </Badge>
          {episode ? (
            <Badge variant="secondary" className="text-xs">
              Episode {episode}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-xs">Episode unavailable</span>
          )}
          <Badge className="text-xs capitalize">{SET_STATUS_LABELS[set.status] ?? set.status}</Badge>
        </div>
        <h1 className="font-medium text-2xl tracking-tight md:text-3xl">{set.set_name}</h1>
        {set.notes && <p className="max-w-2xl text-muted-foreground text-sm">{set.notes}</p>}
      </div>
    </header>
  );
}
