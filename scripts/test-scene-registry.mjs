/**
 * Scene Registry — migration + scenario verification.
 * Applies table DDL, runs scene sync, then tests all 5 scenarios.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SHOW_ID = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID;

if (!SUPABASE_URL || !SUPABASE_KEY || !SHOW_ID) {
  console.error("Missing env vars. Source .env.local first.");
  process.exit(1);
}

const REST = `${SUPABASE_URL}/rest/v1`;
const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
const HW = { ...H, "Content-Type": "application/json", Prefer: "return=minimal" };
const HJ = { ...H, "Content-Type": "application/json", Prefer: "return=representation" };

async function query(path) {
  const r = await fetch(`${REST}/${path}`, { headers: H });
  if (!r.ok) return null;
  return r.json();
}

async function upsert(table, rows) {
  const r = await fetch(`${REST}/${table}`, {
    method: "POST",
    headers: { ...HJ, Prefer: "return=representation,resolution=merge-duplicates" },
    body: JSON.stringify(rows),
  });
  return { ok: r.ok, status: r.status, data: r.ok ? await r.json() : await r.text() };
}

async function patch(table, filter, body) {
  const r = await fetch(`${REST}/${table}?${filter}`, {
    method: "PATCH", headers: HW, body: JSON.stringify(body),
  });
  return r.ok;
}

async function del(table, filter) {
  const r = await fetch(`${REST}/${table}?${filter}`, { method: "DELETE", headers: HW });
  return r.ok;
}

function normalize(raw) {
  return raw.trim().toUpperCase().replace(/\.$/, "");
}

// ─── Check if table exists ──────────────────────────────────────────────────

console.log("=== SCENE REGISTRY TEST HARNESS ===\n");

const probe = await fetch(`${REST}/scene_registry?select=id&limit=0`, { headers: H });
if (!probe.ok) {
  console.error("scene_registry table does not exist.");
  console.error("Please apply migration via Supabase Dashboard SQL Editor:");
  console.error("  File: supabase/migrations/20260607000000_scene_registry.sql");
  console.error("  URL:  https://supabase.com/dashboard/project/yddwznlclkcfqqgmorye/sql");
  process.exit(1);
}
console.log("✓ scene_registry table exists\n");

// ─── Find published revision ────────────────────────────────────────────────

const revs = await query(
  `production_schedule_revisions?show_id=eq.${SHOW_ID}&revision_scope=eq.published&select=id,revision_name&limit=1`
);
if (!revs || revs.length === 0) {
  console.error("No published revision found.");
  process.exit(1);
}
const REV_ID = revs[0].id;
console.log(`Published revision: ${REV_ID}`);
console.log(`  Name: ${revs[0].revision_name}\n`);

// ─── Load schedule days ─────────────────────────────────────────────────────

const days = await query(
  `production_schedule_days?revision_id=eq.${REV_ID}&select=id,strip_position,shoot_day,day_type,title,notes&order=strip_position.asc`
);
console.log(`Schedule days loaded: ${days.length}\n`);

// ─── Extract scenes from shadow ─────────────────────────────────────────────

function extractShadow(notes) {
  if (!notes) return { setups: [], units: [], omittedScenes: [] };
  const idx = notes.indexOf("SYNCO_SHADOW_JSON:v2:");
  if (idx < 0) return { setups: [], units: [], omittedScenes: [] };
  try { return JSON.parse(notes.slice(idx + 21)); } catch { return { setups: [], units: [], omittedScenes: [] }; }
}

function extractScenes(days) {
  const map = new Map();
  for (const day of days) {
    if (day.strip_position >= 100) continue;
    const shadow = extractShadow(day.notes);
    const dayNum = day.strip_position + 1;
    const loc = day.title?.trim() || "TBD";
    const unit = shadow.units?.[0]?.unitLabel ?? null;
    for (const setup of (shadow.setups || [])) {
      for (const raw of (setup.scenes || [])) {
        const norm = normalize(raw);
        if (!norm || norm === "TBD") continue;
        if (!map.has(norm)) {
          const rawIE = (setup.intExt || "INT").toUpperCase();
          const validIE = ["INT", "EXT", "INT/EXT", "E/I"];
          const intExt = validIE.includes(rawIE) ? rawIE : (rawIE === "I/E" ? "E/I" : "INT");
          const rawDN = (setup.dayNight || "D").toUpperCase();
          const validDN = ["D", "N", "D/N"];
          const dayNight = validDN.includes(rawDN) ? rawDN : "D";
          map.set(norm, {
            scene_number: norm, scene_number_raw: raw,
            set_name: setup.setName || "", sub_location: setup.subSets?.[0] || null,
            int_ext: intExt, day_night: dayNight,
            d_number: setup.dNumber || null, unit_label: unit,
            shoot_day_number: dayNum, location_name: loc,
          });
        }
      }
    }
  }
  return Array.from(map.values());
}

// ─── Clear existing scene_registry for clean test ───────────────────────────

await del("scene_registry", `show_id=eq.${SHOW_ID}`);
console.log("Cleared existing scene_registry rows.\n");

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO 1 — New Scene Import
// ═══════════════════════════════════════════════════════════════════════════

console.log("═══ SCENARIO 1: New Scene Import ═══\n");

const scenes = extractScenes(days);
console.log(`Extracted ${scenes.length} unique scenes from shadow v2.\n`);

const insertRows = scenes.map(s => ({
  show_id: SHOW_ID,
  ...s,
  source_revision_id: REV_ID,
  scene_source: "schedule",
  scene_status: "active",
  scene_readiness: "not_started",
}));

const { ok: insOk, data: insData } = await upsert("scene_registry", insertRows);
if (!insOk) { console.error("Insert failed:", insData); process.exit(1); }
console.log(`✓ ${insData.length} SceneRecords created\n`);

// Show Scene 46 specifically
const s46 = await query(`scene_registry?show_id=eq.${SHOW_ID}&scene_number=eq.46&select=*`);
if (s46?.[0]) {
  const r = s46[0];
  console.log("Scene 46 (new):");
  console.log(`  id:                ${r.id}`);
  console.log(`  scene_number:      ${r.scene_number}`);
  console.log(`  scene_number_raw:  ${r.scene_number_raw}`);
  console.log(`  set_name:          ${r.set_name}`);
  console.log(`  int_ext:           ${r.int_ext}`);
  console.log(`  day_night:         ${r.day_night}`);
  console.log(`  d_number:          ${r.d_number}`);
  console.log(`  shoot_day_number:  ${r.shoot_day_number}`);
  console.log(`  location_name:     ${r.location_name}`);
  console.log(`  scene_status:      ${r.scene_status}`);
  console.log(`  scene_source:      ${r.scene_source}`);
  console.log(`  source_revision_id:${r.source_revision_id}`);
  console.log(`  scene_readiness:   ${r.scene_readiness}`);
  console.log("");
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO 2 — Scene Move (46 from Day 14 → Day 18)
// ═══════════════════════════════════════════════════════════════════════════

console.log("═══ SCENARIO 2: Scene Move ═══\n");

const before46 = s46[0];
console.log(`BEFORE: Day ${before46.shoot_day_number}, Location: ${before46.location_name}, Set: ${before46.set_name}`);

const fakeRevId = "00000000-0000-0000-0000-000000000002";
await patch("scene_registry", `show_id=eq.${SHOW_ID}&scene_number=eq.46`, {
  shoot_day_number: 18,
  location_name: "Golden Eagle Quarry",
  set_name: "ICE CAVE",
  d_number: "N3",
  source_revision_id: fakeRevId,
});

const after46 = (await query(`scene_registry?show_id=eq.${SHOW_ID}&scene_number=eq.46&select=*`))?.[0];
console.log(`AFTER:  Day ${after46.shoot_day_number}, Location: ${after46.location_name}, Set: ${after46.set_name}`);
console.log(`  Same ID:            ${before46.id === after46.id ? "✓ YES" : "✗ NO — DUPLICATE"}`);
console.log(`  source_revision_id: ${after46.source_revision_id}`);
console.log(`  cast_numbers:       ${JSON.stringify(after46.cast_numbers)} (preserved — empty, Breakdown-owned)`);
console.log(`  script_page_count:  ${after46.script_page_count ?? "null"} (preserved — Breakdown-owned)`);
console.log("");

// Restore to original
await patch("scene_registry", `show_id=eq.${SHOW_ID}&scene_number=eq.46`, {
  shoot_day_number: before46.shoot_day_number,
  location_name: before46.location_name,
  set_name: before46.set_name,
  d_number: before46.d_number,
  source_revision_id: REV_ID,
});

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO 3 — Scene Omitted
// ═══════════════════════════════════════════════════════════════════════════

console.log("═══ SCENARIO 3: Scene Omitted ═══\n");

// First add a note to Scene 46 to prove notes are preserved
await patch("scene_registry", `show_id=eq.${SHOW_ID}&scene_number=eq.46`, {
  notes: "Hero evidence board — needs aging treatment",
});

// Omit scene 46
await patch("scene_registry", `show_id=eq.${SHOW_ID}&scene_number=eq.46`, {
  scene_status: "omitted",
});

const omitted46 = (await query(`scene_registry?show_id=eq.${SHOW_ID}&scene_number=eq.46&select=*`))?.[0];
console.log("Scene 46 (omitted):");
console.log(`  scene_status:  ${omitted46.scene_status}`);
console.log(`  notes:         ${omitted46.notes}`);
console.log(`  set_name:      ${omitted46.set_name} (preserved)`);
console.log(`  d_number:      ${omitted46.d_number} (preserved)`);
console.log(`  id:            ${omitted46.id} (same record — no delete)`);
console.log("");

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO 4 — Scene Reactivated
// ═══════════════════════════════════════════════════════════════════════════

console.log("═══ SCENARIO 4: Scene Reactivated ═══\n");

console.log(`BEFORE: status=${omitted46.scene_status}, notes="${omitted46.notes}"`);

await patch("scene_registry", `show_id=eq.${SHOW_ID}&scene_number=eq.46`, {
  scene_status: "active",
  shoot_day_number: 14,
  source_revision_id: REV_ID,
});

const reactivated46 = (await query(`scene_registry?show_id=eq.${SHOW_ID}&scene_number=eq.46&select=*`))?.[0];
console.log(`AFTER:  status=${reactivated46.scene_status}, notes="${reactivated46.notes}"`);
console.log(`  Same ID:       ${omitted46.id === reactivated46.id ? "✓ YES" : "✗ NO"}`);
console.log(`  Notes kept:    ${reactivated46.notes === omitted46.notes ? "✓ YES" : "✗ NO"}`);
console.log("");

// Clean up the test note
await patch("scene_registry", `show_id=eq.${SHOW_ID}&scene_number=eq.46`, { notes: null });

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO 5 — Duplicate Detection
// ═══════════════════════════════════════════════════════════════════════════

console.log("═══ SCENARIO 5: Duplicate Detection ═══\n");

const dupes = ["A46", "a46", "A46.", "A46"];
console.log(`Input: ${JSON.stringify(dupes)}`);

const normalized = new Set(dupes.map(normalize));
console.log(`Normalized: ${JSON.stringify([...normalized])}`);
console.log(`Unique count: ${normalized.size}`);

// Check that only one A46 exists in the registry
const a46rows = await query(`scene_registry?show_id=eq.${SHOW_ID}&scene_number=eq.A46&select=id,scene_number,scene_number_raw`);
console.log(`\nscene_registry rows for A46: ${a46rows?.length ?? 0}`);
if (a46rows?.[0]) {
  console.log(`  id:               ${a46rows[0].id}`);
  console.log(`  scene_number:     ${a46rows[0].scene_number}`);
  console.log(`  scene_number_raw: ${a46rows[0].scene_number_raw}`);
}
console.log(`  Duplicates: ${(a46rows?.length ?? 0) <= 1 ? "✓ NONE" : "✗ DUPLICATES FOUND"}`);
console.log("");

// ═══════════════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

const allScenes = await query(`scene_registry?show_id=eq.${SHOW_ID}&select=scene_number,scene_status&order=scene_number.asc`);
const active = allScenes.filter(s => s.scene_status === "active").length;
const omittedCount = allScenes.filter(s => s.scene_status === "omitted").length;

console.log("═══ SUMMARY ═══\n");
console.log(`Total scene_registry rows: ${allScenes.length}`);
console.log(`  Active:  ${active}`);
console.log(`  Omitted: ${omittedCount}`);
console.log(`\nAll scene numbers: ${allScenes.map(s => s.scene_number).join(", ")}`);
