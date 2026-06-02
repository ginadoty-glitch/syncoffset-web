import Link from "next/link";

import { ImageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { AssetRow } from "@/lib/sets/workspace-types";
import { cn } from "@/lib/utils";
import { ASSET_CATEGORY_REGISTRY } from "@/types/core/asset/asset-category";
import { ASSET_STATUS_REGISTRY } from "@/types/core/asset/asset-status";

export function SetAssetCard({ asset }: { asset: AssetRow }) {
  const statusLabel = ASSET_STATUS_REGISTRY[asset.status]?.label ?? asset.status;
  const categoryLabel = ASSET_CATEGORY_REGISTRY[asset.category_id]?.label ?? asset.category_id;

  return (
    <Link
      href={`/dashboard/assets/${asset.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-colors",
        "hover:border-border hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-muted/40">
        <ImageIcon className="size-8 text-muted-foreground/35" />
        <span className="absolute top-2 left-2 rounded bg-background/90 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
          {asset.asset_number}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <h3 className="line-clamp-2 font-medium text-sm leading-snug">{asset.asset_name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-[10px]">
            {statusLabel}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {categoryLabel}
          </Badge>
        </div>
        <div className="flex justify-between gap-2 text-muted-foreground text-[11px]">
          <span className="truncate">{asset.vendor_display_name ?? "—"}</span>
          <span className="shrink-0 font-mono tabular-nums">
            {asset.cost_display_amount != null ? `$${asset.cost_display_amount.toLocaleString()}` : "—"}
          </span>
        </div>
      </div>
    </Link>
  );
}
