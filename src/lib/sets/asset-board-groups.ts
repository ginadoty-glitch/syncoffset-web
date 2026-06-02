import type { AssetRow } from "@/lib/sets/workspace-types";
import type { AssetCategoryId } from "@/types/core/asset/asset-category";

export type AssetBoardGroupId = "set-dressing" | "props" | "graphics" | "construction";

export const ASSET_BOARD_GROUPS: ReadonlyArray<{
  id: AssetBoardGroupId;
  label: string;
  categories: readonly AssetCategoryId[];
}> = [
  { id: "set-dressing", label: "Set Dressing", categories: ["set-decoration", "furniture", "greens"] },
  { id: "props", label: "Props", categories: ["props", "weapons", "electronics"] },
  { id: "graphics", label: "Graphics", categories: ["graphics"] },
  { id: "construction", label: "Construction", categories: ["construction"] },
];

export function groupAssetsForBoard(assets: AssetRow[]): Record<AssetBoardGroupId, AssetRow[]> {
  const groups: Record<AssetBoardGroupId, AssetRow[]> = {
    "set-dressing": [],
    props: [],
    graphics: [],
    construction: [],
  };

  for (const asset of assets) {
    const match = ASSET_BOARD_GROUPS.find((g) => g.categories.includes(asset.category_id));
    if (match) {
      groups[match.id].push(asset);
    }
  }

  return groups;
}
