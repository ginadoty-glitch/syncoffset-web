import { getDefaultProductionId } from "@/lib/ingestion/production";
import { resolveHeroImageDisplayUrl } from "@/lib/sets/hero-photo";
import type { ProductionSetRow } from "@/lib/sets/workspace-types";
import { createServiceClient } from "@/lib/supabase/server";

function isMissingRelation(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === "42P01" || error.code === "PGRST205" || (error.message?.includes("does not exist") ?? false);
}

export type ProductionSetListItem = ProductionSetRow & {
  assetCount: number;
  sceneCount: number;
  heroImageDisplayUrl: string | null;
};

export type ProductionSetListResult = {
  sets: ProductionSetListItem[];
  persistenceAvailable: boolean;
  loadError: string | null;
};

export async function listProductionSets(): Promise<ProductionSetListResult> {
  const empty: ProductionSetListResult = {
    sets: [],
    persistenceAvailable: false,
    loadError: null,
  };

  let supabase: ReturnType<typeof createServiceClient>;
  let productionId: string;

  try {
    supabase = createServiceClient();
    productionId = getDefaultProductionId();
  } catch (error) {
    return {
      ...empty,
      loadError: error instanceof Error ? error.message : "Supabase is not configured.",
    };
  }

  const { data: setRows, error: setError } = await supabase
    .from("production_sets")
    .select("*")
    .eq("production_id", productionId)
    .order("set_number");

  if (isMissingRelation(setError)) {
    return {
      ...empty,
      loadError: "Set persistence is not deployed. Apply migration 20260531000300_set_workspace_tables.sql.",
    };
  }

  if (setError) {
    return { ...empty, loadError: setError.message };
  }

  const rows = (setRows ?? []) as ProductionSetRow[];
  if (rows.length === 0) {
    return { sets: [], persistenceAvailable: true, loadError: null };
  }

  const ids = rows.map((r) => r.id);
  const [assetsResult, scenesResult] = await Promise.all([
    supabase.from("assets").select("set_id").in("set_id", ids),
    supabase.from("scenes").select("set_id").in("set_id", ids),
  ]);

  const assetCounts = countBySetId(assetsResult.data ?? [], "set_id");
  const sceneCounts = countBySetId(scenesResult.data ?? [], "set_id");

  const heroUrls = await Promise.all(
    rows.map((row) => resolveHeroImageDisplayUrl((row as ProductionSetRow).hero_image_url ?? null)),
  );

  const sets: ProductionSetListItem[] = rows.map((row, index) => ({
    ...row,
    hero_image_url: (row as ProductionSetRow).hero_image_url ?? null,
    assetCount: assetCounts.get(row.id) ?? 0,
    sceneCount: sceneCounts.get(row.id) ?? 0,
    heroImageDisplayUrl: heroUrls[index] ?? null,
  }));

  return { sets, persistenceAvailable: true, loadError: null };
}

function countBySetId(rows: ReadonlyArray<{ set_id: string }>, key: "set_id"): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row[key], (map.get(row[key]) ?? 0) + 1);
  }
  return map;
}
