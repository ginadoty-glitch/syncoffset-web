import { getDefaultProductionId } from "@/lib/ingestion/production";
import { isMissingRelation } from "@/lib/operations/is-missing-relation";
import { createClient } from "@/lib/supabase/server";

import type {
  ScriptHubBreakdownItemRow,
  ScriptHubBudgetLink,
  ScriptHubData,
  ScriptHubSceneRow,
  ScriptHubScriptSummary,
} from "./types";

const SCRIPT_SELECT =
  "id, title, version_label, revision_color, show_id, updated_at, source_type, import_kind, previous_script_id, source_document_name" as const;

const SCENE_SELECT =
  "id, script_id, scene_number, scene_heading, location_name, time_of_day, sort_order, raw_text, scene_status, change_summary, int_ext, episode, page_count, eighths" as const;

const ITEM_SELECT =
  "id, script_id, scene_id, label, department, category, element_type, status, quantity, unit, estimated_unit_cost, notes, item_slot, source_column" as const;

const BUDGET_SELECT = "id, source_id, status, estimated_cost" as const;

function emptyHub(loadError: string | null): ScriptHubData {
  return {
    showId: null,
    scripts: [],
    selectedScript: null,
    previousScriptTitle: null,
    scenes: [],
    breakdownItems: [],
    selectedSceneId: null,
    sceneCount: 0,
    breakdownItemCount: 0,
    budgetByItemId: {},
    loadError,
  };
}

function resolvePreviousScriptTitle(scripts: ScriptHubScriptSummary[], previousScriptId: string | null): string | null {
  if (!previousScriptId) return null;
  return scripts.find((s) => s.id === previousScriptId)?.title ?? null;
}

async function loadBudgetLinksForItems(
  supabase: Awaited<ReturnType<typeof createClient>>,
  showId: string,
  itemIds: string[],
): Promise<Record<string, ScriptHubBudgetLink>> {
  const budgetByItemId: Record<string, ScriptHubBudgetLink> = {};
  if (itemIds.length === 0) return budgetByItemId;

  const { data: budgetRows, error: budgetError } = await supabase
    .from("production_budget_lines")
    .select(BUDGET_SELECT)
    .eq("show_id", showId)
    .eq("source_type", "script_breakdown")
    .in("source_id", itemIds);

  if (budgetError) {
    if (isMissingRelation(budgetError)) return budgetByItemId;
    return budgetByItemId;
  }

  for (const row of budgetRows ?? []) {
    const sourceId = (row as { source_id: string | null }).source_id;
    if (!sourceId) continue;
    budgetByItemId[sourceId] = {
      budgetLineId: (row as { id: string }).id,
      status: (row as { status: string }).status,
      estimated_cost: Number((row as { estimated_cost: number }).estimated_cost ?? 0),
    };
  }

  return budgetByItemId;
}

export async function loadScriptHub(
  scriptIdParam?: string | null,
  sceneIdParam?: string | null,
): Promise<ScriptHubData> {
  let showId: string;

  try {
    showId = getDefaultProductionId();
  } catch (error) {
    return emptyHub(error instanceof Error ? error.message : "Missing NEXT_PUBLIC_DEFAULT_PRODUCTION_ID.");
  }

  let supabase: Awaited<ReturnType<typeof createClient>>;

  try {
    supabase = await createClient();
  } catch (error) {
    return emptyHub(
      error instanceof Error ? error.message : "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const { data: scriptRows, error: scriptsError } = await supabase
    .from("production_scripts")
    .select(SCRIPT_SELECT)
    .eq("show_id", showId)
    .order("updated_at", { ascending: false });

  if (isMissingRelation(scriptsError)) {
    return emptyHub(scriptsError?.message ?? 'relation "production_scripts" does not exist');
  }

  if (scriptsError) {
    return emptyHub(scriptsError.message);
  }

  const scripts = (scriptRows ?? []) as ScriptHubScriptSummary[];

  if (scripts.length === 0) {
    return {
      showId,
      scripts: [],
      selectedScript: null,
      previousScriptTitle: null,
      scenes: [],
      breakdownItems: [],
      selectedSceneId: null,
      sceneCount: 0,
      breakdownItemCount: 0,
      budgetByItemId: {},
      loadError: null,
    };
  }

  const selectedScript =
    (scriptIdParam ? scripts.find((s) => s.id === scriptIdParam) : undefined) ?? scripts[0] ?? null;

  if (!selectedScript) {
    return {
      showId,
      scripts,
      selectedScript: null,
      previousScriptTitle: null,
      scenes: [],
      breakdownItems: [],
      selectedSceneId: null,
      sceneCount: 0,
      breakdownItemCount: 0,
      budgetByItemId: {},
      loadError: null,
    };
  }

  const previousScriptTitle = resolvePreviousScriptTitle(scripts, selectedScript.previous_script_id);

  const [scenesResult, itemsResult] = await Promise.all([
    supabase
      .from("production_script_scenes")
      .select(SCENE_SELECT)
      .eq("script_id", selectedScript.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("production_breakdown_items")
      .select(ITEM_SELECT)
      .eq("script_id", selectedScript.id)
      .order("label", { ascending: true }),
  ]);

  if (isMissingRelation(scenesResult.error)) {
    const message = scenesResult.error?.message ?? 'relation "production_script_scenes" does not exist';
    return {
      showId,
      scripts,
      selectedScript,
      previousScriptTitle,
      scenes: [],
      breakdownItems: [],
      selectedSceneId: null,
      sceneCount: 0,
      breakdownItemCount: 0,
      budgetByItemId: {},
      loadError: message,
    };
  }

  if (scenesResult.error) {
    return {
      showId,
      scripts,
      selectedScript,
      previousScriptTitle,
      scenes: [],
      breakdownItems: [],
      selectedSceneId: null,
      sceneCount: 0,
      breakdownItemCount: 0,
      budgetByItemId: {},
      loadError: scenesResult.error.message,
    };
  }

  if (isMissingRelation(itemsResult.error)) {
    const message = itemsResult.error?.message ?? 'relation "production_breakdown_items" does not exist';
    return {
      showId,
      scripts,
      selectedScript,
      previousScriptTitle,
      scenes: (scenesResult.data ?? []) as ScriptHubSceneRow[],
      breakdownItems: [],
      selectedSceneId: null,
      sceneCount: (scenesResult.data ?? []).length,
      breakdownItemCount: 0,
      budgetByItemId: {},
      loadError: message,
    };
  }

  if (itemsResult.error) {
    return {
      showId,
      scripts,
      selectedScript,
      previousScriptTitle,
      scenes: (scenesResult.data ?? []) as ScriptHubSceneRow[],
      breakdownItems: [],
      selectedSceneId: null,
      sceneCount: (scenesResult.data ?? []).length,
      breakdownItemCount: 0,
      budgetByItemId: {},
      loadError: itemsResult.error.message,
    };
  }

  const scenes = (scenesResult.data ?? []) as ScriptHubSceneRow[];
  const allItems = (itemsResult.data ?? []) as ScriptHubBreakdownItemRow[];

  const selectedSceneId =
    sceneIdParam && scenes.some((s) => s.id === sceneIdParam) ? sceneIdParam : (scenes[0]?.id ?? null);

  const breakdownItems = selectedSceneId ? allItems.filter((item) => item.scene_id === selectedSceneId) : [];

  const budgetByItemId = await loadBudgetLinksForItems(
    supabase,
    showId,
    allItems.map((item) => item.id),
  );

  return {
    showId,
    scripts,
    selectedScript,
    previousScriptTitle,
    scenes,
    breakdownItems,
    selectedSceneId,
    sceneCount: scenes.length,
    breakdownItemCount: allItems.length,
    budgetByItemId,
    loadError: null,
  };
}
