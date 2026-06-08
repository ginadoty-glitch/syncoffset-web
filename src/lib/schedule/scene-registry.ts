/**
 * Scene Registry — extraction pipeline.
 * Reads published schedule days, extracts scenes from v2 shadow,
 * and upserts into scene_registry table.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { extractShadow } from "./extract-shadow";
import { normalizeSceneNumber } from "./scene-normalize";

type ScheduleDayRow = {
  id: string;
  strip_position: number;
  shoot_day: string;
  day_type: string | null;
  title: string;
  notes: string | null;
};

type ExtractedScene = {
  sceneNumber: string;
  sceneNumberRaw: string;
  setName: string;
  subLocation: string | null;
  intExt: string;
  dayNight: string;
  dNumber: string | null;
  unitLabel: string | null;
  shootDayNumber: number;
  locationName: string;
};

const VALID_INT_EXT = ["INT", "EXT", "INT/EXT", "E/I"] as const;
const VALID_DAY_NIGHT = ["D", "N", "D/N"] as const;

function coerceIntExt(raw: string | undefined): string {
  const v = (raw ?? "INT").toUpperCase();
  if ((VALID_INT_EXT as readonly string[]).includes(v)) return v;
  if (v === "I/E") return "E/I";
  return "INT";
}

function coerceDayNight(raw: string | undefined): string {
  const v = (raw ?? "D").toUpperCase();
  if ((VALID_DAY_NIGHT as readonly string[]).includes(v)) return v;
  return "D";
}

function extractScenesFromDays(days: ScheduleDayRow[]): ExtractedScene[] {
  const sceneMap = new Map<string, ExtractedScene>();

  for (const day of days) {
    if (day.strip_position >= 100) continue;

    const shadow = extractShadow(day.notes);
    const dayNumber = day.strip_position + 1;
    const locationName = day.title?.trim() || "TBD";
    const primaryUnit = shadow.units[0]?.unitLabel ?? null;

    for (const setup of shadow.setups) {
      for (const rawScene of setup.scenes) {
        const norm = normalizeSceneNumber(rawScene);
        if (!norm || norm === "TBD") continue;

        if (!sceneMap.has(norm)) {
          sceneMap.set(norm, {
            sceneNumber: norm,
            sceneNumberRaw: rawScene,
            setName: setup.setName ?? "",
            subLocation: setup.subSets?.[0] ?? null,
            intExt: coerceIntExt(setup.intExt),
            dayNight: coerceDayNight(setup.dayNight),
            dNumber: setup.dNumber ?? null,
            unitLabel: primaryUnit,
            shootDayNumber: dayNumber,
            locationName,
          });
        }
      }
    }
  }

  return Array.from(sceneMap.values());
}

export type SyncScenesResult = {
  created: number;
  updated: number;
  omitted: number;
  total: number;
  scenes: Array<{ sceneNumber: string; action: "created" | "updated" | "omitted" | "unchanged" }>;
};

export async function syncScenesFromRevision(
  supabase: SupabaseClient,
  showId: string,
  revisionId: string,
): Promise<SyncScenesResult> {
  // 1. Load all days for this revision
  const { data: days, error: daysErr } = await supabase
    .from("production_schedule_days")
    .select("id, strip_position, shoot_day, day_type, title, notes")
    .eq("revision_id", revisionId)
    .order("strip_position", { ascending: true });

  if (daysErr) throw new Error(`Failed to load schedule days: ${daysErr.message}`);
  if (!days || days.length === 0) return { created: 0, updated: 0, omitted: 0, total: 0, scenes: [] };

  // 2. Extract scenes from shadow
  const extracted = extractScenesFromDays(days as ScheduleDayRow[]);

  // 3. Load existing scene_registry for this show
  const { data: existing, error: existErr } = await supabase
    .from("scene_registry")
    .select("id, scene_number, scene_status")
    .eq("show_id", showId);

  if (existErr) throw new Error(`Failed to load scene_registry: ${existErr.message}`);
  const existingMap = new Map((existing ?? []).map((r) => [r.scene_number, r]));

  const result: SyncScenesResult = { created: 0, updated: 0, omitted: 0, total: extracted.length, scenes: [] };
  const activeSceneNumbers = new Set(extracted.map((s) => s.sceneNumber));

  // 4. Upsert extracted scenes
  for (const scene of extracted) {
    const ex = existingMap.get(scene.sceneNumber);

    if (!ex) {
      // New scene
      const { error } = await supabase.from("scene_registry").insert({
        show_id: showId,
        scene_number: scene.sceneNumber,
        scene_number_raw: scene.sceneNumberRaw,
        set_name: scene.setName,
        sub_location: scene.subLocation,
        int_ext: scene.intExt,
        day_night: scene.dayNight,
        d_number: scene.dNumber,
        unit_label: scene.unitLabel,
        shoot_day_number: scene.shootDayNumber,
        location_name: scene.locationName,
        source_revision_id: revisionId,
        scene_source: "schedule",
        scene_status: "active",
        scene_readiness: "not_started",
      });
      if (error) throw new Error(`Insert scene ${scene.sceneNumber}: ${error.message}`);
      result.created++;
      result.scenes.push({ sceneNumber: scene.sceneNumber, action: "created" });
    } else {
      // Existing scene — update schedule-owned fields only
      const { error } = await supabase
        .from("scene_registry")
        .update({
          set_name: scene.setName,
          sub_location: scene.subLocation,
          int_ext: scene.intExt,
          day_night: scene.dayNight,
          d_number: scene.dNumber,
          unit_label: scene.unitLabel,
          shoot_day_number: scene.shootDayNumber,
          location_name: scene.locationName,
          source_revision_id: revisionId,
          scene_status: "active",
        })
        .eq("id", ex.id);
      if (error) throw new Error(`Update scene ${scene.sceneNumber}: ${error.message}`);

      if (ex.scene_status === "omitted") {
        result.scenes.push({ sceneNumber: scene.sceneNumber, action: "updated" });
        result.updated++;
      } else {
        result.scenes.push({ sceneNumber: scene.sceneNumber, action: "updated" });
        result.updated++;
      }
    }
  }

  // 5. Mark scenes not in this revision as omitted
  for (const [sceneNum, ex] of existingMap) {
    if (!activeSceneNumbers.has(sceneNum) && ex.scene_status === "active") {
      const { error } = await supabase.from("scene_registry").update({ scene_status: "omitted" }).eq("id", ex.id);
      if (error) throw new Error(`Omit scene ${sceneNum}: ${error.message}`);
      result.omitted++;
      result.scenes.push({ sceneNumber: sceneNum, action: "omitted" });
    }
  }

  return result;
}
