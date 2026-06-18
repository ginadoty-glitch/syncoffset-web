/**
 * One-time repair: populate companyMoveDestination on Runaway published revision.
 * Revision: 5dcdd8d7-01e4-4e8a-8a8a-cc2d8793115a
 *
 * Usage: node scripts/backfill-runaway-company-move-destinations.mjs [--apply]
 */

import fs from "node:fs";
import path from "node:path";

const REVISION_ID = "5dcdd8d7-01e4-4e8a-8a8a-cc2d8793115a";
const V2_PREFIX = "SYNCO_SHADOW_JSON:v2:";
const APPLY = process.argv.includes("--apply");

const env = {};
for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

function normLocation(value) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*·\s*.*$/, "");
}

function locationsDiffer(a, b) {
  const left = normLocation(a);
  const right = normLocation(b);
  return left.length > 0 && right.length > 0 && left !== right;
}

function scenesContinue(prevScenes, nextScenes) {
  if (prevScenes.length === 0 || nextScenes.length === 0) return false;
  const normalize = (s) => s.replace(/\s+/g, "").toUpperCase();
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
    return Number(firstPt[2]) === Number(lastPt[2]) + 1;
  }
  return false;
}

function parseShadow(notes) {
  const idx = (notes ?? "").indexOf(V2_PREFIX);
  if (idx < 0) return null;
  return JSON.parse(notes.slice(idx + V2_PREFIX.length).trim());
}

function patchNotes(notes, patch) {
  const idx = notes.indexOf(V2_PREFIX);
  const prefix = notes.slice(0, idx).trimEnd();
  const meta = JSON.parse(notes.slice(idx + V2_PREFIX.length).trim());
  const next = { ...meta, ...patch };
  return `${prefix ? `${prefix}\n\n` : ""}${V2_PREFIX}${JSON.stringify(next)}`.slice(0, 49000);
}

function primarySet(dayRow, shadow) {
  return shadow.setups?.[0]?.setName?.trim() || dayRow.title.split("·")[0]?.trim() || dayRow.title;
}

function summarize(dayRow, shadow) {
  return {
    id: dayRow.id,
    date: dayRow.shoot_day.slice(0, 10),
    day_number: dayRow.strip_position + 1,
    am_location: primarySet(dayRow, shadow),
    company_move: shadow.companyMove,
    company_move_destination: shadow.companyMoveDestination,
    company_move_type: shadow.companyMoveType ?? null,
    destination_source: shadow.companyMoveDestinationSource ?? null,
    confidence: shadow.companyMoveDestinationConfidence ?? null,
    scenes: shadow.setups?.flatMap((s) => s.scenes) ?? [],
  };
}

const res = await fetch(
  `${URL}/rest/v1/production_schedule_days?revision_id=eq.${REVISION_ID}&select=id,strip_position,shoot_day,title,notes&order=strip_position.asc`,
  { headers: H },
);
const days = await res.json();
if (!Array.isArray(days)) {
  console.error("Failed to load days:", days);
  process.exit(1);
}

console.log(`Loaded ${days.length} strips for revision ${REVISION_ID}`);
console.log(APPLY ? "MODE: apply\n" : "MODE: dry-run (pass --apply to write)\n");

const updates = [];

for (let i = 0; i < days.length; i++) {
  const cur = days[i];
  const shadow = parseShadow(cur.notes);
  if (!shadow?.companyMove || shadow.companyMoveDestination?.trim()) continue;

  const next = days[i + 1];
  if (!next) continue;
  const nextShadow = parseShadow(next.notes);
  if (!nextShadow) continue;

  const curLoc = primarySet(cur, shadow);
  const nextLoc = primarySet(next, nextShadow);
  if (!locationsDiffer(curLoc, nextLoc)) continue;

  const curScenes = shadow.setups?.flatMap((s) => s.scenes) ?? [];
  const nextScenes = nextShadow.setups?.flatMap((s) => s.scenes) ?? [];

  let source = null;
  let confidence = null;
  if (scenesContinue(curScenes, nextScenes)) {
    source = "scene_continuation";
    confidence = 0.95;
  } else {
    // Runaway repair fallback — next strip carries PM location when scene split spans calendar days.
    source = "next_strip";
    confidence = 0.75;
  }

  const before = summarize(cur, shadow);
  const patch = {
    companyMoveDestination: nextLoc,
    companyMoveType:
      shadow.companyMoveType && shadow.companyMoveType !== "unknown" ? shadow.companyMoveType : "after lunch",
    companyMoveDestinationSource: source,
    companyMoveDestinationConfidence: confidence,
    workPeriods: shadow.workPeriods?.length
      ? shadow.workPeriods
      : [
          { label: "DAY WORK", setupIndexes: [0] },
          { label: "AFTER LUNCH", setupIndexes: [] },
        ],
  };
  const afterShadow = { ...shadow, ...patch };
  const after = summarize(cur, afterShadow);

  updates.push({ id: cur.id, notes: patchNotes(cur.notes, patch), before, after });
}

if (updates.length === 0) {
  console.log("No company-move days eligible for backfill.");
  process.exit(0);
}

for (const u of updates) {
  console.log("---");
  console.log("BEFORE:", JSON.stringify(u.before, null, 2));
  console.log("AFTER:", JSON.stringify(u.after, null, 2));
}

if (APPLY) {
  for (const u of updates) {
    const patchRes = await fetch(`${URL}/rest/v1/production_schedule_days?id=eq.${u.id}`, {
      method: "PATCH",
      headers: { ...H, Prefer: "return=minimal" },
      body: JSON.stringify({ notes: u.notes }),
    });
    if (!patchRes.ok) {
      console.error(`PATCH failed for ${u.id}:`, await patchRes.text());
      process.exit(1);
    }
  }
  console.log(`\nApplied ${updates.length} update(s).`);
} else {
  console.log(`\nDry-run complete — ${updates.length} row(s) ready. Re-run with --apply to write.`);
}
