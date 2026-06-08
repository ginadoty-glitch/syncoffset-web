/**
 * End-to-end script ingestion: upload PDF → parse → production_scripts
 * → production_script_scenes → scene_registry → verify counts.
 *
 * Uses direct REST calls with service role (same as test-scene-registry.mjs).
 *
 * Usage: source .env.local && node scripts/test-script-e2e.mjs <path-to-script-pdf>
 */

import { readFileSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { resolve } from "node:path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SHOW_ID = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID;

if (!SUPABASE_URL || !SERVICE_KEY || !SHOW_ID) {
  console.error("Missing env vars. Run: source .env.local");
  process.exit(1);
}

const REST = `${SUPABASE_URL}/rest/v1`;
const STORAGE = `${SUPABASE_URL}/storage/v1`;
const H = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function count(table, filter) {
  const r = await fetch(`${REST}/${table}?${filter}&select=id`, {
    headers: { ...H, Prefer: "count=exact", Range: "0-0" },
  });
  return parseInt((r.headers.get("content-range") || "*/0").split("/")[1] || "0", 10);
}

async function query(path) {
  const r = await fetch(`${REST}/${path}`, { headers: H });
  if (!r.ok) { console.error(`Query ${path}: ${r.status}`); return []; }
  return r.json();
}

const scriptPath = process.argv[2];
if (!scriptPath) { console.error("Usage: node scripts/test-script-e2e.mjs <path-to-pdf>"); process.exit(1); }
const absPath = resolve(scriptPath);
const buffer = readFileSync(absPath);
const fileName = absPath.split("/").pop();

console.log("═══ SCRIPT INGESTION E2E ═══\n");
console.log(`File:  ${fileName}`);
console.log(`Size:  ${buffer.length} bytes`);
console.log(`Show:  ${SHOW_ID}\n`);

// ─── BEFORE ─────────────────────────────────────────────────────────────────
const b_scripts = await count("production_scripts", `show_id=eq.${SHOW_ID}`);
const b_registry = await count("scene_registry", `show_id=eq.${SHOW_ID}`);
console.log(`BEFORE: production_scripts=${b_scripts}  scene_registry=${b_registry}\n`);

// ─── Step 1: Extract text with pdf-parse ────────────────────────────────────
console.log("1. Extract text from PDF...");
const pdfParse = (await import("pdf-parse")).default;
const pdfResult = await pdfParse(buffer);
console.log(`   Pages: ${pdfResult.numpages}  Text: ${pdfResult.text.length} chars`);

if (pdfResult.text.length < 50) {
  console.error("   ✗ Extraction failed. PDF may be scanned/image-only.");
  process.exit(1);
}
console.log("   ✓ Text extracted\n");

// ─── Step 2: Parse scenes ────────────────────────────────────────────────────
console.log("2. Parse scenes...");

const HEADING_RE = /^\s*[*†]*\s*(?:(\d+[A-Za-z]?)\s*[.\s]+\s*)?(INT\/EXT\.|INT\.\s*\/\s*EXT\.|EXT\.|INT\.|I\/E\.)\s+(.+)$/i;
const TRAILING_NUM = /(\d+[A-Za-z]?)$/;
const TOD_RE = /^(DAY|NIGHT|DAWN|DUSK|EVENING|MORNING|CONTINUOUS|LATER|SAME TIME|MOMENTS LATER|SAME|BACK TO SCENE|ESTABLISHING|AFTERNOON|SUNRISE|SUNSET|D|N|D\/N)$/i;

function dedup(raw) {
  if (raw.length >= 2 && raw.length % 2 === 0) {
    const half = raw.length / 2;
    if (raw.slice(0, half) === raw.slice(half)) return raw.slice(0, half);
  }
  const m = raw.match(/^(.+?)\1$/);
  if (m) return m[1];
  return raw;
}

function stripTrailing(seg) {
  const m = seg.match(TRAILING_NUM);
  if (!m) return { cleaned: seg, num: null };
  const cand = seg.slice(0, -m[1].length).trim();
  if (cand.length >= 1 && /[A-Za-z]/.test(cand)) return { cleaned: cand, num: dedup(m[1]) };
  return { cleaned: seg, num: null };
}

function canonIE(raw) {
  const u = raw.replace(/\.\s*/g, "").replace(/\s+/g, "").toUpperCase();
  if (u === "INT") return "INT";
  if (u === "EXT") return "EXT";
  if (u === "INT/EXT" || u === "INTEXT") return "INT/EXT";
  if (u === "I/E" || u === "IE") return "E/I";
  return "INT";
}

const lines = pdfResult.text.replace(/\u00a0/g, " ").split(/\r?\n/);
const scenes = [];
let curScene = null;
let bodyLines = [];

for (const raw of lines) {
  const t = raw.replace(/\u00a0/g, " ").replace(/\t/g, " ").trim();
  if (!t) { if (curScene) bodyLines.push(raw); continue; }
  const m = t.match(HEADING_RE);
  if (m && m[2] && m[3]) {
    if (curScene) { curScene.body = bodyLines.join("\n").trimEnd(); scenes.push(curScene); }
    const leadNum = (m[1] || "").trim();
    const tail = m[3].trim();
    const parts = tail.split(/\s+[-–—]\s+/).map(s => s.replace(/\.$/, "").trim()).filter(Boolean);

    const lastRaw = parts[parts.length - 1] || "";
    const { cleaned: lastCleaned, num: trailingNum } = stripTrailing(lastRaw);
    const fixedParts = [...parts.slice(0, -1), lastCleaned];

    const first = fixedParts[0] || tail;
    const last = fixedParts[fixedParts.length - 1] || "";
    const hasTOD = TOD_RE.test(last);
    let setName = first, subLoc = null, tod = null;
    if (fixedParts.length === 2) { if (hasTOD) tod = last; else subLoc = fixedParts[1]; }
    else if (fixedParts.length >= 3) { if (hasTOD) { subLoc = fixedParts.slice(1, -1).join(" - "); tod = last; } else subLoc = fixedParts.slice(1).join(" - "); }

    const sceneNum = leadNum.length ? leadNum.replace(/\.$/, "") : trailingNum;
    const intExt = canonIE(m[2]);

    curScene = { sceneNumber: sceneNum, heading: t, intExt, setName, subLocation: subLoc, timeOfDay: tod, body: "" };
    bodyLines = [];
  } else if (curScene) { bodyLines.push(raw); }
}
if (curScene) { curScene.body = bodyLines.join("\n").trimEnd(); scenes.push(curScene); }

const numbered = scenes.filter(s => s.sceneNumber).length;
console.log(`   Total: ${scenes.length}  Numbered: ${numbered}  Unnumbered: ${scenes.length - numbered}`);
console.log("   ✓ Scenes parsed\n");

// ─── Step 3: Upload to storage ──────────────────────────────────────────────
console.log("3. Upload to storage...");
const sourceDocId = randomUUID();
const objPath = `${SHOW_ID}/${sourceDocId}/${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
const bucket = "scripts";

const upResp = await fetch(`${STORAGE}/object/${bucket}/${objPath}`, {
  method: "POST",
  headers: { ...H, "Content-Type": "application/pdf" },
  body: buffer,
});
if (!upResp.ok) { console.error(`   ✗ Upload failed: ${upResp.status}`); process.exit(1); }
console.log(`   ✓ ${bucket}/${objPath}\n`);

// ─── Step 4: Create source_documents ─────────────────────────────────────────
console.log("4. Create source_documents...");
const now = new Date().toISOString();
const sdRow = {
  id: sourceDocId, production_id: SHOW_ID, kind: "source-document", status: "draft",
  ingestion_status: "review", created_by: "e2e-test", created_at: now,
  modified_by: "e2e-test", modified_at: now, source_document_id: null, source_version_id: null,
  relationships: [], source_document_kind: "script-revision",
  immutable: { isImmutable: true, originalFileName: fileName, uploadedAt: now, uploadedBy: "e2e-test", extractionHistoryIds: [] },
  source_file: { storageRef: `${bucket}/${objPath}`, originalFileName: fileName, mimeType: "application/pdf", byteSize: buffer.length, checksumSha256: createHash("sha256").update(buffer).digest("hex"), receivedAt: now },
  version_chain: [], supersession: {},
  ingestion: { sourceDocumentId: sourceDocId, sourceSystem: "manual-upload", sourceVersion: "1", importedAt: now, importedBy: "e2e-test" },
};
const sdResp = await fetch(`${REST}/source_documents`, { method: "POST", headers: H, body: JSON.stringify(sdRow) });
if (!sdResp.ok) { console.error(`   ✗ ${sdResp.status} ${await sdResp.text()}`); process.exit(1); }
console.log(`   ✓ ${sourceDocId}\n`);

// ─── Step 5: Insert production_scripts ───────────────────────────────────────
console.log("5. Insert production_scripts...");
const title = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
const psResp = await fetch(`${REST}/production_scripts`, {
  method: "POST", headers: H,
  body: JSON.stringify({
    show_id: SHOW_ID, title, version_label: "Draft", source_type: "uploaded",
    import_kind: "full_script", source_document_name: fileName,
    raw_text: pdfResult.text.slice(0, 100000),
  }),
});
if (!psResp.ok) { console.error(`   ✗ ${psResp.status} ${await psResp.text()}`); process.exit(1); }
const [scriptRow] = await psResp.json();
const scriptId = scriptRow.id;
console.log(`   ✓ ${scriptId}\n`);

// ─── Step 6: Insert production_script_scenes ─────────────────────────────────
console.log("6. Insert production_script_scenes...");
const sceneRows = scenes.map((s, i) => {
  const draft = {};
  if (s.intExt) draft.int_ext = s.intExt;
  if (s.subLocation) draft.sub_location = s.subLocation;
  return {
    script_id: scriptId, scene_number: s.sceneNumber, scene_heading: s.heading,
    location_name: s.setName, time_of_day: s.timeOfDay,
    raw_text: (s.body || "").slice(0, 50000), sort_order: i, scene_status: "active",
    breakdown_draft: draft,
  };
});
const ssResp = await fetch(`${REST}/production_script_scenes`, {
  method: "POST", headers: H, body: JSON.stringify(sceneRows),
});
if (!ssResp.ok) { console.error(`   ✗ ${ssResp.status} ${await ssResp.text()}`); process.exit(1); }
const insertedScenes = await ssResp.json();
console.log(`   ✓ ${insertedScenes.length} rows\n`);

// ─── Step 7: Sync to scene_registry ──────────────────────────────────────────
console.log("7. Sync to scene_registry...");
const VALID_IE = new Set(["INT", "EXT", "INT/EXT", "E/I"]);
const VALID_DN = new Set(["D", "N", "D/N"]);
function coerceIE(r) { if (!r) return null; const v = r.toUpperCase().trim(); if (VALID_IE.has(v)) return v; if (v === "I/E") return "E/I"; return "INT"; }
function coerceDN(r) { if (!r) return null; const v = r.toUpperCase().trim(); if (VALID_DN.has(v)) return v; if (v === "DAY") return "D"; if (v === "NIGHT") return "N"; return null; }
function norm(r) { if (!r) return null; return r.trim().toUpperCase().replace(/\.$/, ""); }

const existing = await query(`scene_registry?show_id=eq.${SHOW_ID}&select=id,scene_number,scene_source`);
const exMap = new Map(existing.map(r => [r.scene_number, r]));
let created = 0, updated = 0, skipped = 0;

for (const s of scenes) {
  if (!s.sceneNumber) { skipped++; continue; }
  const n = norm(s.sceneNumber);
  if (!n) { skipped++; continue; }
  const ie = coerceIE(s.intExt);
  const dn = coerceDN(s.timeOfDay);
  const ex = exMap.get(n);

  if (!ex) {
    const row = { show_id: SHOW_ID, scene_number: n, scene_number_raw: s.sceneNumber, scene_source: "script", scene_status: "active", scene_readiness: "not_started" };
    if (ie) row.int_ext = ie;
    if (dn) row.day_night = dn;
    if (s.setName) row.set_name = s.setName;
    const r = await fetch(`${REST}/scene_registry`, { method: "POST", headers: H, body: JSON.stringify(row) });
    if (!r.ok) {
      const err = await r.text();
      if (err.includes("duplicate key") || err.includes("uq_scene_registry")) { skipped++; continue; }
      console.error(`   Insert ${n} failed: ${r.status}`);
      skipped++; continue;
    }
    created++;
  } else if (ex.scene_source === "schedule") {
    skipped++;
  } else {
    updated++;
  }
}
console.log(`   ✓ Created: ${created}  Updated: ${updated}  Skipped: ${skipped}\n`);

// ─── AFTER ───────────────────────────────────────────────────────────────────
const a_scripts = await count("production_scripts", `show_id=eq.${SHOW_ID}`);
const a_scenes = await count("production_script_scenes", `script_id=eq.${scriptId}`);
const a_registry = await count("scene_registry", `show_id=eq.${SHOW_ID}`);

console.log("═══ RESULTS ═══\n");
console.log(`production_scripts:        ${a_scripts} (was ${b_scripts})`);
console.log(`production_script_scenes:  ${a_scenes}`);
console.log(`scene_registry:            ${a_registry} (was ${b_registry})\n`);

console.log("═══ VERIFICATION ═══\n");
console.log(`✓ production_scripts created:       ${a_scripts > b_scripts ? "YES" : "NO"} (${a_scripts})`);
console.log(`✓ production_script_scenes created:  ${a_scenes > 0 ? "YES" : "NO"} (${a_scenes})`);
console.log(`✓ scene_registry updated:            ${a_registry >= b_registry ? "YES" : "NO"} (${a_registry})`);
console.log(`✓ Parsed scenes = stored scenes:     ${a_scenes === scenes.length ? "YES" : "NO"} (${scenes.length} parsed, ${a_scenes} stored)`);

// ─── SAMPLE SCENES ──────────────────────────────────────────────────────────
console.log("\n═══ SAMPLE SCENES (first 15) ═══\n");
const samples = await query(`production_script_scenes?script_id=eq.${scriptId}&select=scene_number,scene_heading,location_name,time_of_day,int_ext&order=sort_order.asc&limit=15`);
console.log("  Sc#    INT/EXT  TOD          SET NAME                            SUB-LOCATION");
console.log("  ─────  ───────  ───────────  ──────────────────────────────────  ─────────────────");
for (const s of samples) {
  console.log(
    " ",
    (s.scene_number || "?").padEnd(5),
    (s.int_ext || "").padEnd(7),
    (s.time_of_day || "").padEnd(11),
    (s.location_name || "").padEnd(34).slice(0, 34),
    ""
  );
}

console.log("\n═══ DONE ═══");
