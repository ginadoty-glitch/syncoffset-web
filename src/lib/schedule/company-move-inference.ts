/**
 * Company move destination inference — preserves AM/PM operational context on shoot days.
 */

import type { ShootDay } from "@/types/schedule";

export type CompanyMoveType = "before lunch" | "after lunch" | "unknown";
export type CompanyMoveDestinationSource = "same_strip" | "scene_continuation" | "next_strip" | "set_registry";

function normLocation(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*·\s*.*$/, "");
}

export function locationsDiffer(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normLocation(a);
  const right = normLocation(b);
  return left.length > 0 && right.length > 0 && left !== right;
}

export function parseCompanyMoveTypeFromLine(line: string): CompanyMoveType {
  const l = line.toLowerCase();
  if (/after\s+lunch/.test(l)) return "after lunch";
  if (/before\s+lunch/.test(l)) return "before lunch";
  return "unknown";
}

/** Detect split-scene continuation (e.g. 98 PT1 → 98 PT2). */
export function scenesContinueAcrossDays(prevScenes: string[], nextScenes: string[]): boolean {
  if (prevScenes.length === 0 || nextScenes.length === 0) return false;

  const normalize = (s: string) => s.replace(/\s+/g, "").toUpperCase();
  const last = normalize(prevScenes[prevScenes.length - 1] ?? "");
  const first = normalize(nextScenes[0] ?? "");
  if (!last || !first) return false;
  if (last === first) return true;

  const lastBase = last.match(/^(\d+[A-Z]{0,2})/)?.[1];
  const firstBase = first.match(/^(\d+[A-Z]{0,2})/)?.[1];
  if (lastBase && firstBase && lastBase === firstBase) return true;

  const lastPt = last.match(/^(\d+[A-Z]{0,2})PT(\d+)$/);
  const firstPt = first.match(/^(\d+[A-Z]{0,2})PT(\d+)$/);
  if (lastPt && firstPt && lastPt[1] === firstPt[1]) {
    const lastPart = Number.parseInt(lastPt[2], 10);
    const firstPart = Number.parseInt(firstPt[2], 10);
    return Number.isFinite(lastPart) && Number.isFinite(firstPart) && firstPart === lastPart + 1;
  }

  return false;
}

function primarySetName(day: ShootDay): string {
  return day.setups[0]?.setName?.trim() || day.location.trim();
}

function applyPmDestination(
  day: ShootDay,
  destination: string,
  source: CompanyMoveDestinationSource,
  confidence: number,
  moveType?: CompanyMoveType,
): void {
  day.companyMoveDestination = destination;
  day.companyMoveDestinationSource = source;
  day.companyMoveDestinationConfidence = confidence;
  if (!day.companyMoveType || day.companyMoveType === "unknown") {
    day.companyMoveType = moveType ?? "after lunch";
  }
  if (!day.workPeriods || day.workPeriods.length === 0) {
    day.workPeriods = [
      { label: "DAY WORK", setupIndexes: day.setups.map((_, i) => i) },
      { label: day.companyMoveType === "before lunch" ? "BEFORE LUNCH MOVE" : "AFTER LUNCH", setupIndexes: [] },
    ];
  }
}

/** Infer PM destination from the next strip when scenes continue across a company move. */
export function linkCompanyMoveDestinations(days: ShootDay[]): void {
  for (let i = 0; i < days.length - 1; i++) {
    const cur = days[i];
    if (!cur?.companyMove || cur.companyMoveDestination?.trim()) continue;

    const next = days[i + 1];
    if (!next) continue;

    const curLoc = primarySetName(cur);
    const nextLoc = primarySetName(next);
    if (!locationsDiffer(curLoc, nextLoc)) continue;

    const curScenes = cur.setups.flatMap((s) => s.scenes);
    const nextScenes = next.setups.flatMap((s) => s.scenes);
    if (!scenesContinueAcrossDays(curScenes, nextScenes)) continue;

    applyPmDestination(cur, nextLoc, "scene_continuation", 0.95, "after lunch");
  }
}

export function appendCompanyMoveIntegrityWarnings(days: ShootDay[], warnings: string[]): void {
  for (const day of days) {
    if (!day.companyMove || day.companyMoveDestination?.trim()) continue;
    const dateIso = Number.isFinite(day.date) ? new Date(day.date).toISOString().slice(0, 10) : "unknown date";
    warnings.push(
      `Day ${day.dayNumber} (${dateIso}): Company Move detected but destination location could not be determined.`,
    );
  }
}

const V2_PREFIX = "SYNCO_SHADOW_JSON:v2:";

type ShadowPatch = {
  companyMoveDestination?: string | null;
  companyMoveType?: string | null;
  companyMoveDestinationSource?: string | null;
  companyMoveDestinationConfidence?: number | null;
  workPeriods?: ShootDay["workPeriods"];
};

/** Patch v2 shadow JSON embedded in production_schedule_days.notes. */
export function patchShadowInNotes(notes: string | null, patch: ShadowPatch): string {
  const raw = notes ?? "";
  const idx = raw.indexOf(V2_PREFIX);
  if (idx < 0) return raw;

  const prefix = raw.slice(0, idx).trimEnd();
  const meta = JSON.parse(raw.slice(idx + V2_PREFIX.length).trim()) as Record<string, unknown>;
  const next = { ...meta, ...patch };
  const body = `${prefix ? `${prefix}\n\n` : ""}${V2_PREFIX}${JSON.stringify(next)}`;
  return body.slice(0, 49_000);
}
