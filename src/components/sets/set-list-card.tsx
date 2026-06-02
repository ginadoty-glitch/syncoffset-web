import Link from "next/link";

import { ArrowRight, Box, Clapperboard } from "lucide-react";

import { SetHeroImage } from "@/components/sets/set-hero-image";
import { Badge } from "@/components/ui/badge";
import type { ProductionSetListItem } from "@/lib/sets/list-production-sets";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  active: "Active",
  struck: "Wrapped",
  archived: "Archived",
};

export function SetListCard({ set }: { set: ProductionSetListItem }) {
  return (
    <Link
      href={`/dashboard/sets/${set.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card/50 transition-colors",
        "hover:border-border hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="relative">
        <SetHeroImage
          imageUrl={set.heroImageDisplayUrl}
          alt={set.set_name}
          aspectClass="aspect-[2/1] rounded-none border-0"
          className="rounded-none border-0"
          emptyLabel="No photo"
        />
        <Badge variant="outline" className="absolute top-3 left-3 z-10 font-mono text-[10px] tabular-nums">
          {set.set_number}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-medium text-base leading-snug tracking-tight group-hover:text-foreground">
            {set.set_name}
          </h2>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-[10px] capitalize">
            {STATUS_LABELS[set.status] ?? set.status}
          </Badge>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Box className="size-3" />
            {set.assetCount} assets
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clapperboard className="size-3" />
            {set.sceneCount} scenes
          </span>
        </div>
      </div>
    </Link>
  );
}
