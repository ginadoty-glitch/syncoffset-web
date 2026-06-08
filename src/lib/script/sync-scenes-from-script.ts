/**
 * Scene Registry — script-based extraction pipeline.
 * Reads production_script_scenes for a given script, upserts into scene_registry
 * with scene_source = "script". Preserves schedule-owned fields if they already exist.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { normalizeSceneNumber } from "@/lib/schedule/scene-normalize";

type ScriptSceneRow = {
  id: string;
  scene_number: string | null;
  scene_heading: string;
  location_name: string | null;
  time_of_day: string | null;
  int_ext: string | null;
  breakdown_draft: Record<string, unknown> | null;
};

const VALID_INT_EXT = new Set(["INT", "EXT", "INT/EXT", "E/I"]);
const VALID_DAY_NIGHT = new Set(["D", "N", "D/N"]);

function coerceIntExt(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.toUpperCase().trim();
  if (VALID_INT_EXT.has(v)) return v;
  if (v === "I/E") return "E/I";
  return "INT";
}

function coerceDayNight(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.toUpperCase().trim();
  if (VALID_DAY_NIGHT.has(v)) return v;
  if (v === "DAY") return "D";
  if (v === "NIGHT") return "N";
  if (v === "DAWN" || v === "DUSK" || v === "MORNING" || v === "EVENING") return "D";
  return null;
}

export type SyncScenesFromScriptResult = {
  created: number;
  updated: number;
  skipped: number;
  total: number;
};

export async function syncScenesFromScript(
  supabase: SupabaseClient,
  showId: string,
  scriptId: string,
): Promise<SyncScenesFromScriptResult> {
  const { data: scenes, error: scenesErr } = await supabase
    .from("production_script_scenes")
    .select("id, scene_number, scene_heading, location_name, time_of_day, int_ext, breakdown_draft")
    .eq("script_id", scriptId)
    .order("sort_order", { ascending: true });

  if (scenesErr) throw new Error(`Failed to load script scenes: ${scenesErr.message}`);
  if (!scenes || scenes.length === 0) return { created: 0, updated: 0, skipped: 0, total: 0 };

  const { data: existing, error: existErr } = await supabase
    .from("scene_registry")
    .select("id, scene_number, scene_source, scene_status")
    .eq("show_id", showId);

  if (existErr) throw new Error(`Failed to load scene_registry: ${existErr.message}`);
  const existingMap = new Map((existing ?? []).map((r) => [r.scene_number, r]));

  const result: SyncScenesFromScriptResult = { created: 0, updated: 0, skipped: 0, total: scenes.length };

  for (const scene of scenes as ScriptSceneRow[]) {
    if (!scene.scene_number) {
      result.skipped++;
      continue;
    }

    const norm = normalizeSceneNumber(scene.scene_number);
    if (!norm) {
      result.skipped++;
      continue;
    }

    // int_ext may be in the column or stored in breakdown_draft JSON
    const rawIntExt = scene.int_ext ?? (scene.breakdown_draft?.int_ext as string | null);
    const intExt = coerceIntExt(rawIntExt);
    const dayNight = coerceDayNight(scene.time_of_day);
    const ex = existingMap.get(norm);

    if (!ex) {
      const row: Record<string, unknown> = {
        show_id: showId,
        scene_number: norm,
        scene_number_raw: scene.scene_number,
        scene_source: "script",
        scene_status: "active",
        scene_readiness: "not_started",
      };
      if (intExt) row.int_ext = intExt;
      if (dayNight) row.day_night = dayNight;
      if (scene.location_name) row.set_name = scene.location_name;

      const { error } = await supabase.from("scene_registry").insert(row);
      if (error) throw new Error(`Insert scene ${norm}: ${error.message}`);
      result.created++;
    } else {
      // Script is authoritative for int_ext, set_name when schedule hasn't set them.
      // If schedule already owns these fields, preserve schedule values.
      if (ex.scene_source === "schedule") {
        result.skipped++;
        continue;
      }

      const updates: Record<string, unknown> = { scene_status: "active" };
      if (intExt) updates.int_ext = intExt;
      if (dayNight) updates.day_night = dayNight;
      if (scene.location_name) updates.set_name = scene.location_name;

      const { error } = await supabase.from("scene_registry").update(updates).eq("id", ex.id);
      if (error) throw new Error(`Update scene ${norm}: ${error.message}`);
      result.updated++;
    }
  }

  return result;
}
