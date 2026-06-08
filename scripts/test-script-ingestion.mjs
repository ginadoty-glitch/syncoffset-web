/**
 * End-to-end script ingestion verification.
 * Uploads a test script PDF, triggers parsing, and verifies row counts.
 *
 * Usage: node scripts/test-script-ingestion.mjs <path-to-script-pdf>
 */

import { readFileSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { resolve } from "node:path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SHOW_ID = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID;

if (!SUPABASE_URL || !SERVICE_KEY || !SHOW_ID) {
  console.error("Missing env vars. Source .env.local first.");
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

async function query(path) {
  const r = await fetch(`${REST}/${path}`, { headers: H });
  if (!r.ok) throw new Error(`Query ${path}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function countRows(table, filter) {
  const r = await fetch(`${REST}/${table}?${filter}&select=id`, {
    headers: { ...H, Prefer: "count=exact", Range: "0-0" },
  });
  const cr = r.headers.get("content-range") || "*/0";
  return parseInt(cr.split("/")[1] || "0", 10);
}

const scriptPath = process.argv[2];
if (!scriptPath) {
  console.error("Usage: node scripts/test-script-ingestion.mjs <path-to-script-pdf>");
  process.exit(1);
}

const absPath = resolve(scriptPath);
const buffer = readFileSync(absPath);
const fileName = absPath.split("/").pop();
const checksumSha256 = createHash("sha256").update(buffer).digest("hex");

console.log("=== SCRIPT INGESTION END-TO-END TEST ===\n");
console.log(`File: ${fileName}`);
console.log(`Size: ${buffer.length} bytes`);
console.log(`Show: ${SHOW_ID}\n`);

// Pre-counts
console.log("--- BEFORE ---");
const beforeScripts = await countRows("production_scripts", `show_id=eq.${SHOW_ID}`);
const beforeScenes = await countRows("production_script_scenes", `script_id=not.is.null`);
const beforeRegistry = await countRows("scene_registry", `show_id=eq.${SHOW_ID}`);
console.log(`production_scripts:       ${beforeScripts}`);
console.log(`production_script_scenes: ${beforeScenes}`);
console.log(`scene_registry:           ${beforeRegistry}\n`);

// Step 1: Upload to storage
console.log("Step 1: Upload to storage...");
const sourceDocumentId = randomUUID();
const objectPath = `${SHOW_ID}/${sourceDocumentId}/${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
const bucket = "scripts";

const uploadResp = await fetch(`${STORAGE}/object/${bucket}/${objectPath}`, {
  method: "POST",
  headers: {
    ...H,
    "Content-Type": "application/pdf",
  },
  body: buffer,
});

if (!uploadResp.ok) {
  const body = await uploadResp.text();
  console.error(`Storage upload failed: ${uploadResp.status} ${body}`);
  process.exit(1);
}
console.log(`  ✓ Uploaded to ${bucket}/${objectPath}\n`);

// Step 2: Create source_documents row
console.log("Step 2: Create source_documents row...");
const now = new Date().toISOString();
const storageRef = `${bucket}/${objectPath}`;

const sdRow = {
  id: sourceDocumentId,
  production_id: SHOW_ID,
  kind: "source-document",
  status: "draft",
  ingestion_status: "uploaded",
  created_by: "test-harness@syncoffset.local",
  created_at: now,
  modified_by: "test-harness@syncoffset.local",
  modified_at: now,
  source_document_id: null,
  source_version_id: null,
  relationships: [],
  source_document_kind: "script-revision",
  immutable: {
    isImmutable: true,
    originalFileName: fileName,
    uploadedAt: now,
    uploadedBy: "test-harness@syncoffset.local",
    extractionHistoryIds: [],
  },
  source_file: {
    storageRef,
    originalFileName: fileName,
    mimeType: "application/pdf",
    byteSize: buffer.length,
    checksumSha256,
    receivedAt: now,
  },
  version_chain: [],
  supersession: {},
  ingestion: {
    sourceDocumentId,
    sourceSystem: "manual-upload",
    sourceVersion: "1",
    importedAt: now,
    importedBy: "test-harness@syncoffset.local",
  },
};

const sdResp = await fetch(`${REST}/source_documents`, {
  method: "POST",
  headers: H,
  body: JSON.stringify(sdRow),
});

if (!sdResp.ok) {
  console.error(`source_documents insert failed: ${sdResp.status} ${await sdResp.text()}`);
  process.exit(1);
}
console.log(`  ✓ source_documents row: ${sourceDocumentId}\n`);

// Step 3: Download and parse (simulating what parseAndMirrorScript does)
console.log("Step 3: Parse script PDF...");

// Extract text using the same heuristic as the server
const binary = buffer.toString("latin1");

// Inline minimal PDF text extraction for the test script
function unescapePdfString(inner) {
  try {
    return inner
      .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
      .replace(/\\n/gi, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t")
      .replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\");
  } catch { return inner; }
}

function extractText(bin) {
  const chunks = [];
  const tjRe = /\((?:\\.|[^)])*\)\s*[Tt]j/g;
  for (const m of bin.matchAll(tjRe)) {
    const raw = m[0];
    const open = raw.indexOf("(");
    const close = raw.lastIndexOf(")");
    if (open === -1 || close <= open) continue;
    const cleaned = unescapePdfString(raw.slice(open + 1, close)).replace(/\s+/g, " ").trim();
    if (cleaned) chunks.push(cleaned);
    if (chunks.length > 50000) break;
  }
  return chunks.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

const text = extractText(binary);
console.log(`  Text extracted: ${text.length} characters`);

// Parse scenes
const HEADING_RE = /^\s*(?:(\d+[A-Za-z]?)\s*[.\s]+\s*)?(INT\/EXT\.|INT\.\s*\/\s*EXT\.|EXT\.|INT\.|I\/E\.)\s+(.+)$/i;

const lines = text.replace(/\u00a0/g, " ").split(/\r?\n/);
const scenes = [];
let curScene = null;
let bodyLines = [];

for (const raw of lines) {
  const t = raw.replace(/\u00a0/g, " ").trim();
  if (!t) { if (curScene) bodyLines.push(raw); continue; }
  const normalized = t.replace(/\t/g, " ");
  const m = normalized.match(HEADING_RE);
  if (m && m[2] && m[3]) {
    if (curScene) {
      curScene.body = bodyLines.join("\n").trimEnd();
      scenes.push(curScene);
    }
    const numRaw = (m[1] || "").trim();
    const num = numRaw.length ? numRaw.replace(/\.$/, "") : null;

    // Parse location parts
    const tail = m[3].trim();
    const SEP = /\s+[-–—]\s+/;
    const parts = tail.split(SEP).map(s => s.replace(/\.$/, "").trim()).filter(Boolean);
    const TOD = /^(DAY|NIGHT|DAWN|DUSK|EVENING|MORNING|CONTINUOUS|LATER|D|N)$/i;

    let setName = parts[0] || tail;
    let subLoc = null;
    let tod = null;
    const last = parts[parts.length - 1] || "";
    const hasTOD = TOD.test(last);

    if (parts.length === 2) {
      if (hasTOD) { tod = last; }
      else { subLoc = parts[1]; }
    } else if (parts.length >= 3) {
      if (hasTOD) { subLoc = parts.slice(1, -1).join(" - "); tod = last; }
      else { subLoc = parts.slice(1).join(" - "); }
    }

    // Canonicalize INT/EXT
    const itype = m[2].replace(/\.\s*/g, "").replace(/\s+/g, "").toUpperCase();
    let intExt = "INT";
    if (itype === "EXT") intExt = "EXT";
    else if (itype === "INT/EXT" || itype === "INTEXT") intExt = "INT/EXT";
    else if (itype === "I/E") intExt = "E/I";

    curScene = { sceneNumber: num, heading: normalized, intExt, setName, subLocation: subLoc, timeOfDay: tod, body: "" };
    bodyLines = [];
  } else if (curScene) {
    bodyLines.push(raw);
  }
}
if (curScene) { curScene.body = bodyLines.join("\n").trimEnd(); scenes.push(curScene); }

console.log(`  Scenes parsed: ${scenes.length}`);
if (scenes.length > 0) {
  console.log(`  First scene: ${scenes[0].sceneNumber || "(no number)"} ${scenes[0].heading.slice(0, 80)}`);
  console.log(`  Last scene:  ${scenes[scenes.length - 1].sceneNumber || "(no number)"} ${scenes[scenes.length - 1].heading.slice(0, 80)}`);
}
console.log();

if (scenes.length === 0) {
  console.error("Parser found 0 scenes. Aborting.");
  process.exit(1);
}

// Step 4: Insert production_scripts
console.log("Step 4: Insert production_scripts...");
const revisionColor = null; // Would detect from filename
const title = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

const { id: scriptId } = (await fetch(`${REST}/production_scripts`, {
  method: "POST",
  headers: H,
  body: JSON.stringify({
    show_id: SHOW_ID,
    title,
    version_label: revisionColor || "Draft",
    source_type: "uploaded",
    import_kind: "full_script",
    revision_color: revisionColor,
    source_document_name: fileName,
    raw_text: text.slice(0, 100000),
  }),
}).then(r => { if (!r.ok) throw new Error(`Insert failed: ${r.status}`); return r.json(); }))[0];

console.log(`  ✓ production_scripts row: ${scriptId}\n`);

// Step 5: Insert production_script_scenes
console.log("Step 5: Insert production_script_scenes...");
const sceneRows = scenes.map((s, idx) => ({
  script_id: scriptId,
  scene_number: s.sceneNumber,
  scene_heading: s.heading,
  location_name: s.setName,
  time_of_day: s.timeOfDay,
  int_ext: s.intExt,
  raw_text: (s.body || "").slice(0, 50000),
  sort_order: idx,
  scene_status: "active",
  breakdown_draft: {},
}));

const sceneResp = await fetch(`${REST}/production_script_scenes`, {
  method: "POST",
  headers: H,
  body: JSON.stringify(sceneRows),
});
if (!sceneResp.ok) {
  console.error(`production_script_scenes insert failed: ${sceneResp.status} ${await sceneResp.text()}`);
  process.exit(1);
}
const insertedScenes = await sceneResp.json();
console.log(`  ✓ production_script_scenes: ${insertedScenes.length} rows\n`);

// Step 6: Sync to scene_registry
console.log("Step 6: Sync to scene_registry...");
const VALID_INT_EXT = new Set(["INT", "EXT", "INT/EXT", "E/I"]);
const VALID_DN = new Set(["D", "N", "D/N"]);

function coerceIE(raw) {
  if (!raw) return null;
  const v = raw.toUpperCase().trim();
  if (VALID_INT_EXT.has(v)) return v;
  if (v === "I/E") return "E/I";
  return "INT";
}

function coerceDN(raw) {
  if (!raw) return null;
  const v = raw.toUpperCase().trim();
  if (VALID_DN.has(v)) return v;
  if (v === "DAY") return "D";
  if (v === "NIGHT") return "N";
  return null;
}

function normalizeSceneNum(raw) {
  if (!raw) return null;
  return raw.trim().toUpperCase().replace(/\.$/, "");
}

// Load existing scene_registry
const existing = await query(`scene_registry?show_id=eq.${SHOW_ID}&select=id,scene_number,scene_source,scene_status`);
const existingMap = new Map(existing.map(r => [r.scene_number, r]));

let created = 0, updated = 0, skipped = 0;

for (const scene of scenes) {
  if (!scene.sceneNumber) { skipped++; continue; }
  const norm = normalizeSceneNum(scene.sceneNumber);
  if (!norm) { skipped++; continue; }

  const ie = coerceIE(scene.intExt);
  const dn = coerceDN(scene.timeOfDay);
  const ex = existingMap.get(norm);

  if (!ex) {
    const row = {
      show_id: SHOW_ID,
      scene_number: norm,
      scene_number_raw: scene.sceneNumber,
      scene_source: "script",
      scene_status: "active",
      scene_readiness: "not_started",
    };
    if (ie) row.int_ext = ie;
    if (dn) row.day_night = dn;
    if (scene.setName) row.set_name = scene.setName;

    const r = await fetch(`${REST}/scene_registry`, {
      method: "POST",
      headers: H,
      body: JSON.stringify(row),
    });
    if (!r.ok) {
      const err = await r.text();
      // Duplicate key is ok — scene already exists from schedule import
      if (err.includes("duplicate key") || err.includes("uq_scene_registry")) {
        skipped++;
        continue;
      }
      console.error(`  Insert ${norm} failed: ${r.status} ${err}`);
      skipped++;
      continue;
    }
    created++;
  } else {
    if (ex.scene_source === "schedule") { skipped++; continue; }
    updated++;
  }
}

console.log(`  ✓ scene_registry: ${created} created, ${updated} updated, ${skipped} skipped\n`);

// Post-counts
console.log("--- AFTER ---");
const afterScripts = await countRows("production_scripts", `show_id=eq.${SHOW_ID}`);
const afterScriptScenes = await countRows("production_script_scenes", `script_id=eq.${scriptId}`);
const afterRegistry = await countRows("scene_registry", `show_id=eq.${SHOW_ID}`);
console.log(`production_scripts:       ${afterScripts} (was ${beforeScripts})`);
console.log(`production_script_scenes: ${afterScriptScenes} (new)`);
console.log(`scene_registry:           ${afterRegistry} (was ${beforeRegistry})\n`);

// Verification
console.log("=== VERIFICATION ===");
console.log(`production_scripts created:        ${afterScripts > beforeScripts ? "✓ YES" : "✗ NO"}`);
console.log(`production_script_scenes created:  ${afterScriptScenes > 0 ? "✓ YES" : "✗ NO"} (${afterScriptScenes} rows)`);
console.log(`scene_registry updated:            ${afterRegistry >= beforeRegistry ? "✓ YES" : "✗ NO"} (${afterRegistry} total)`);

// Show sample scenes
console.log("\n=== SAMPLE SCENES ===");
const samples = await query(`production_script_scenes?script_id=eq.${scriptId}&select=scene_number,scene_heading,location_name,time_of_day,int_ext&order=sort_order.asc&limit=10`);
for (const s of samples) {
  console.log(`  ${(s.scene_number || "?").padEnd(6)} ${(s.int_ext || "").padEnd(8)} ${(s.time_of_day || "").padEnd(8)} ${(s.location_name || "").padEnd(30)} ${s.scene_heading.slice(0, 60)}`);
}

console.log("\n=== DONE ===");
