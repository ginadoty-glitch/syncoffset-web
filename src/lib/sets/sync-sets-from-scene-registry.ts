/**
 * Production Sets derivation — self-populating from scene_registry.
 *
 * scene_registry is the source of truth for scenes. Every active scene carries
 * a set_name. This groups active scenes by normalized set_name and upserts one
 * production_sets row per distinct set, keeping related_scene_ids in lockstep
 * with the live scene data.
 *
 * Auto-sync updates scene LINKAGE only. It never overwrites user-entered
 * metadata (status, notes, hero_image_url, relationships, asset/location/
 * budget links). Existing sets are matched by normalized set_name and keep
 * their set_number; new sets get the next sequential number.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

const SYNC_ACTOR = "scene-registry-sync@syncoffset.local";

/** Stable matching key for a set name (uppercase, whitespace-collapsed). */
export function normalizeSetName(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, " ");
}

export type SyncSetsResult = { created: number; updated: number; total: number };

type SceneRow = { id: string; set_name: string | null };
type ExistingSetRow = { id: string; set_name: string | null; set_number: string | null };

export async function syncSetsFromSceneRegistry(supabase: SupabaseClient, showId: string): Promise<SyncSetsResult> {
  // 1. Active scenes for this production
  const { data: scenes, error: sceneErr } = await supabase
    .from("scene_registry")
    .select("id, set_name")
    .eq("show_id", showId)
    .eq("scene_status", "active");
  if (sceneErr) throw new Error(`scene_registry read failed: ${sceneErr.message}`);

  // 2. Group scene ids by normalized set_name
  const groups = new Map<string, { displayName: string; sceneIds: string[] }>();
  for (const r of (scenes ?? []) as SceneRow[]) {
    const raw = r.set_name?.trim();
    if (!raw) continue;
    const key = normalizeSetName(raw);
    const group = groups.get(key) ?? { displayName: raw, sceneIds: [] };
    group.sceneIds.push(r.id);
    groups.set(key, group);
  }

  // 3. Existing sets for this production (match by normalized set_name)
  const { data: existing, error: existErr } = await supabase
    .from("production_sets")
    .select("id, set_name, set_number")
    .eq("production_id", showId);
  if (existErr) throw new Error(`production_sets read failed: ${existErr.message}`);

  const existingByKey = new Map<string, ExistingSetRow>();
  let maxSetNumber = 0;
  for (const s of (existing ?? []) as ExistingSetRow[]) {
    existingByKey.set(normalizeSetName(s.set_name ?? ""), s);
    const n = Number.parseInt(s.set_number ?? "", 10);
    if (Number.isFinite(n)) maxSetNumber = Math.max(maxSetNumber, n);
  }

  const now = new Date().toISOString();
  const result: SyncSetsResult = { created: 0, updated: 0, total: groups.size };

  // 4. Upsert — deterministic order so new set_numbers are stable
  for (const [key, group] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const existingSet = existingByKey.get(key);

    if (existingSet) {
      // Update scene linkage ONLY — preserve all user-entered metadata.
      const { error } = await supabase
        .from("production_sets")
        .update({ related_scene_ids: group.sceneIds, modified_by: SYNC_ACTOR, modified_at: now })
        .eq("id", existingSet.id);
      if (error) throw new Error(`Update set ${key}: ${error.message}`);
      result.updated++;
    } else {
      maxSetNumber += 1;
      const { error } = await supabase.from("production_sets").insert({
        production_id: showId,
        kind: "set",
        status: "planned",
        set_number: String(maxSetNumber),
        set_name: group.displayName,
        related_scene_ids: group.sceneIds,
        created_by: SYNC_ACTOR,
        modified_by: SYNC_ACTOR,
      });
      if (error) throw new Error(`Insert set ${key}: ${error.message}`);
      result.created++;
    }
  }

  return result;
}
