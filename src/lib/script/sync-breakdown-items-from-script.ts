import type { SupabaseClient } from "@supabase/supabase-js";

import {
  BREAKDOWN_EXTRACT_NOTE,
  extractBreakdownItemsFromScene,
} from "@/lib/script/extract-breakdown-items-from-scene";

type SceneRow = {
  id: string;
  script_id: string;
  scene_number: string | null;
  scene_heading: string;
  location_name: string | null;
  raw_text: string;
  breakdown_draft: Record<string, unknown>;
};

export type SyncBreakdownItemsResult = {
  sceneCount: number;
  itemCount: number;
  inserted: number;
};

/**
 * Generate and persist breakdown items for every scene on a script.
 * Replaces prior auto-extracted rows (notes = script-import-extract) only.
 */
export async function syncBreakdownItemsFromScript(
  supabase: SupabaseClient,
  scriptId: string,
): Promise<SyncBreakdownItemsResult> {
  const { data: scenes, error: scenesErr } = await supabase
    .from("production_script_scenes")
    .select("id, script_id, scene_number, scene_heading, location_name, raw_text, breakdown_draft")
    .eq("script_id", scriptId)
    .order("sort_order", { ascending: true });

  if (scenesErr) {
    throw new Error(`production_script_scenes load failed: ${scenesErr.message}`);
  }

  const rows = (scenes ?? []) as SceneRow[];

  await supabase
    .from("production_breakdown_items")
    .delete()
    .eq("script_id", scriptId)
    .eq("notes", BREAKDOWN_EXTRACT_NOTE);

  const insertRows = rows.flatMap((scene) =>
    extractBreakdownItemsFromScene(scene).map((item) => ({
      script_id: scriptId,
      scene_id: scene.id,
      label: item.label,
      category: item.category,
      department: item.department,
      status: "draft" as const,
      quantity: item.quantity,
      notes: item.notes,
      item_slot: item.item_slot,
    })),
  );

  if (insertRows.length === 0) {
    return { sceneCount: rows.length, itemCount: 0, inserted: 0 };
  }

  const { error: insertErr } = await supabase.from("production_breakdown_items").insert(insertRows);
  if (insertErr) {
    throw new Error(`production_breakdown_items insert failed: ${insertErr.message}`);
  }

  return { sceneCount: rows.length, itemCount: insertRows.length, inserted: insertRows.length };
}
