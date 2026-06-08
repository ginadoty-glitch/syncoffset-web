/**
 * Quick test: extract text from a PDF using the same heuristic as the server,
 * then run the scene parser. Shows what the actual server code would produce.
 *
 * Usage: node scripts/test-script-parse-only.mjs <path-to-pdf>
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const scriptPath = process.argv[2];
if (!scriptPath) {
  console.error("Usage: node scripts/test-script-parse-only.mjs <path-to-pdf>");
  process.exit(1);
}

const absPath = resolve(scriptPath);
const buffer = readFileSync(absPath);
const binary = buffer.toString("latin1");

console.log(`File: ${absPath}`);
console.log(`Size: ${buffer.length} bytes\n`);

// Full PDF extraction (same logic as src/lib/schedule/pdf-text-extract.ts)
const MAX_BINARY_SCAN_BYTES = 12 * 1024 * 1024;
const MAX_OPERATOR_MATCHES = 50000;

function unescapePdfString(inner) {
  try {
    return inner
      .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
      .replace(/\\n/gi, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t")
      .replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\");
  } catch { return inner; }
}

function decodePdfHexString(hexRaw) {
  const hex = hexRaw.replace(/\s+/g, "");
  if (hex.length < 2) return "";
  let out = "";
  for (let i = 0; i + 1 < hex.length && out.length < 8000; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    if (Number.isNaN(byte)) continue;
    if (byte >= 32 && byte <= 126) out += String.fromCharCode(byte);
    else if (byte === 10 || byte === 13 || byte === 9) out += " ";
  }
  return out.trim();
}

function extractPdfTextChunksSafe(bin) {
  const chunks = [];
  let parseIssues = 0;
  let truncated = false;
  const scanBinary = bin.length > MAX_BINARY_SCAN_BYTES ? bin.slice(0, MAX_BINARY_SCAN_BYTES) : bin;
  if (scanBinary.length < bin.length) truncated = true;

  const pushChunk = (raw) => {
    if (!raw || chunks.length >= MAX_OPERATOR_MATCHES) { if (chunks.length >= MAX_OPERATOR_MATCHES) truncated = true; return; }
    const cleaned = raw.replace(/\s+/g, " ").trim();
    if (cleaned) chunks.push(cleaned);
  };

  const tjRe = /\((?:\\.|[^)])*\)\s*[Tt]j/g;
  let tjCount = 0;
  for (const m of scanBinary.matchAll(tjRe)) {
    tjCount++;
    if (tjCount > MAX_OPERATOR_MATCHES) { truncated = true; break; }
    try {
      const raw = m[0];
      const open = raw.indexOf("(");
      const close = raw.lastIndexOf(")");
      if (open === -1 || close <= open) { parseIssues++; continue; }
      pushChunk(unescapePdfString(raw.slice(open + 1, close)));
    } catch { parseIssues++; }
  }

  const hexRe = /<([0-9A-Fa-f\s]+)>\s*[Tt]j/g;
  let hexCount = 0;
  for (const m of scanBinary.matchAll(hexRe)) {
    hexCount++;
    if (tjCount + hexCount > MAX_OPERATOR_MATCHES) { truncated = true; break; }
    try { pushChunk(decodePdfHexString(m[1] || "")); } catch { parseIssues++; }
  }

  const tjArrayRe = /\[(.*?)\]\s*TJ/g;
  let arrayCount = 0;
  for (const m of scanBinary.matchAll(tjArrayRe)) {
    arrayCount++;
    if (tjCount + hexCount + arrayCount > MAX_OPERATOR_MATCHES) { truncated = true; break; }
    try {
      const inner = m[1] || "";
      const parts = inner.match(/\((?:\\.|[^)])*\)/g) || [];
      for (const part of parts) pushChunk(unescapePdfString(part.slice(1, -1)));
      const hexParts = inner.match(/<([0-9A-Fa-f\s]+)>/g) || [];
      for (const hp of hexParts) pushChunk(decodePdfHexString(hp.slice(1, -1)));
    } catch { parseIssues++; }
  }

  return { chunks, truncated, parseIssues };
}

function extractPdfTextPageIsolated(bin) {
  const indices = [0];
  const pageMarker = /\/Type\s*\/Page\b/g;
  for (const pm of bin.matchAll(pageMarker)) indices.push(pm.index);

  if (indices.length <= 1) {
    const { chunks, truncated, parseIssues } = extractPdfTextChunksSafe(bin);
    const text = chunks.map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n").replace(/\n{3,}/g, "\n\n").trim();
    return { text, pagesSucceeded: text ? 1 : 0, pagesFailed: text ? 0 : 1, parseIssues, truncated };
  }

  const parts = [];
  let pagesSucceeded = 0, pagesFailed = 0, parseIssues = 0, truncated = false;

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i] || 0;
    const end = i + 1 < indices.length ? (indices[i + 1] || bin.length) : bin.length;
    try {
      const seg = extractPdfTextChunksSafe(bin.slice(start, end));
      parseIssues += seg.parseIssues;
      if (seg.truncated) truncated = true;
      const pageText = seg.chunks.map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
      if (pageText) { parts.push(pageText); pagesSucceeded++; } else { pagesFailed++; }
    } catch { pagesFailed++; parseIssues++; }
  }

  const text = parts.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
  return { text, pagesSucceeded, pagesFailed, parseIssues, truncated };
}

const extraction = extractPdfTextPageIsolated(binary);
console.log(`Pages succeeded: ${extraction.pagesSucceeded}`);
console.log(`Pages failed:    ${extraction.pagesFailed}`);
console.log(`Parse issues:    ${extraction.parseIssues}`);
console.log(`Text length:     ${extraction.text.length} characters`);
console.log(`Truncated:       ${extraction.truncated}\n`);

if (extraction.text.length > 0) {
  console.log("=== FIRST 2000 CHARS ===");
  console.log(extraction.text.slice(0, 2000));
  console.log("\n...\n");
}

// Scene parsing
const HEADING_RE = /^\s*(?:(\d+[A-Za-z]?)\s*[.\s]+\s*)?(INT\/EXT\.|INT\.\s*\/\s*EXT\.|EXT\.|INT\.|I\/E\.)\s+(.+)$/i;
const lines = extraction.text.replace(/\u00a0/g, " ").split(/\r?\n/);
const scenes = [];
let cur = null;
let body = [];

for (const raw of lines) {
  const t = raw.replace(/\u00a0/g, " ").replace(/\t/g, " ").trim();
  if (!t) { if (cur) body.push(raw); continue; }
  const m = t.match(HEADING_RE);
  if (m && m[2] && m[3]) {
    if (cur) { cur.body = body.join("\n").trimEnd(); scenes.push(cur); }
    const numRaw = (m[1] || "").trim();

    const tail = m[3].trim();
    const parts = tail.split(/\s+[-–—]\s+/).map(s => s.replace(/\.$/, "").trim()).filter(Boolean);
    const TOD = /^(DAY|NIGHT|DAWN|DUSK|EVENING|MORNING|D|N)$/i;
    const last = parts[parts.length - 1] || "";
    const hasTOD = TOD.test(last);
    let setName = parts[0] || tail, subLoc = null, tod = null;
    if (parts.length === 2) { if (hasTOD) tod = last; else subLoc = parts[1]; }
    else if (parts.length >= 3) { if (hasTOD) { subLoc = parts.slice(1, -1).join(" - "); tod = last; } else subLoc = parts.slice(1).join(" - "); }

    const itype = m[2].replace(/\.\s*/g, "").replace(/\s+/g, "").toUpperCase();
    let intExt = "INT";
    if (itype === "EXT") intExt = "EXT";
    else if (itype === "INT/EXT" || itype === "INTEXT") intExt = "INT/EXT";
    else if (itype === "I/E") intExt = "E/I";

    cur = { sceneNumber: numRaw.length ? numRaw.replace(/\.$/, "") : null, heading: t, intExt, setName, subLocation: subLoc, timeOfDay: tod };
    body = [];
  } else if (cur) { body.push(raw); }
}
if (cur) { cur.body = body.join("\n").trimEnd(); scenes.push(cur); }

console.log(`\n=== SCENES FOUND: ${scenes.length} ===\n`);
for (const s of scenes) {
  console.log(`  ${(s.sceneNumber || "?").toString().padEnd(6)} ${(s.intExt || "").padEnd(8)} ${(s.timeOfDay || "").padEnd(8)} ${(s.setName || "").padEnd(35).slice(0, 35)} ${(s.subLocation || "").slice(0, 30)}`);
}
