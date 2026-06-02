import { LayoutGrid } from "lucide-react";

import { ASSET_BOARD_GROUPS, groupAssetsForBoard } from "@/lib/sets/asset-board-groups";
import type { AssetRow } from "@/lib/sets/workspace-types";

import { SetAssetCard } from "./set-asset-card";
import { SetSectionEmpty } from "./set-section-empty";

export function SetAssetBoard({ assets, hasSet }: { assets: AssetRow[]; hasSet: boolean }) {
  if (!hasSet || assets.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg tracking-tight">Visual asset board</h2>
        <SetSectionEmpty
          icon={LayoutGrid}
          title="No assets assigned"
          description="Assets on this set appear here in Programa-style groups when persistence is populated."
        />
      </section>
    );
  }

  const grouped = groupAssetsForBoard(assets);

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="font-medium text-lg tracking-tight">Visual asset board</h2>
        <p className="text-muted-foreground text-sm">Photo-first cards grouped for art department workflows.</p>
      </div>
      {ASSET_BOARD_GROUPS.map((group) => {
        const items = grouped[group.id];
        return (
          <div key={group.id} className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-muted-foreground text-xs uppercase tracking-widest">{group.label}</h3>
              <span className="font-mono text-muted-foreground text-xs tabular-nums">{items.length}</span>
            </div>
            {items.length === 0 ? (
              <p className="text-muted-foreground text-xs">No {group.label.toLowerCase()} on this set.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {items.map((asset) => (
                  <SetAssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
