/**
 * Server-side schedule parser — ported from expo/services/oneLinerScheduleParse.ts.
 * Handles CSV, XLSX, and PDF (heuristic line extraction).
 * No Expo dependencies — uses Node Buffer and crypto.
 */

import * as XLSX from "xlsx";

import type {
  OneLinerFieldConfidence,
  OneLinerParseQuality,
  OneLinerParseResult,
  OneLinerUnresolvedRow,
  ParsedOneLinerRow,
  ShootDay,
  ShootDaySetup,
  ShootDayUnit,
} from "@/types/schedule";

import { extractPdfTextLinesFromBinaryPageIsolated } from "./pdf-text-extract";
import { createHash } from "node:crypto";

// ---------------------------------------------------------------------------
// Revision colors (from expo/constants/oneLinerRevisionColors.ts)
// ---------------------------------------------------------------------------

const ONE_LINER_REVISION_COLORS = [
  "white",
  "blue",
  "pink",
  "yellow",
  "green",
  "goldenrod",
  "buff",
  "salmon",
  "cherry",
] as const;

// ---------------------------------------------------------------------------
// Revision label detection (from expo/utils/oneLinerRevisionLabels.ts)
// ---------------------------------------------------------------------------

function titleCaseColor(c: string): string {
  return c.charAt(0).toUpperCase() + c.slice(1);
}

type RevisionLabelCertainty = "certain" | "inferred" | "unknown";
type DetectedRevisionLabel = {
  display: string;
  certainty: RevisionLabelCertainty;
  source: "filename" | "sheet_header" | "sheet_column" | "none";
};

function detectRevisionLabelFromFileName(fileName: string): DetectedRevisionLabel | null {
  const n = fileName.toLowerCase();
  for (const c of ONE_LINER_REVISION_COLORS) {
    if (new RegExp(`\\b${c}\\b`, "i").test(n)) {
      return { display: titleCaseColor(c), certainty: "certain", source: "filename" };
    }
  }
  const revLetter = n.match(/\brev(?:ision)?[\s._-]*([a-d])\b/i);
  if (revLetter?.[1]) {
    return { display: `Rev ${revLetter[1]?.toUpperCase()}`, certainty: "certain", source: "filename" };
  }
  const revNum = n.match(/\brev(?:ision)?[\s._-]*(\d+(?:\.\d+)?)\b/i);
  if (revNum?.[1]) {
    return { display: `Revision ${revNum[1]}`, certainty: "certain", source: "filename" };
  }
  const dated = n.match(/(\d{4}[-_.]\d{2}[-_.]\d{2})/);
  if (dated?.[1]) {
    return { display: `Dated ${dated[1].replace(/[_.]/g, "-")}`, certainty: "inferred", source: "filename" };
  }
  return null;
}

function detectRevisionLabelFromHeaders(headers: string[]): DetectedRevisionLabel | null {
  const joined = headers.join(" ").toLowerCase();
  for (const c of ONE_LINER_REVISION_COLORS) {
    if (new RegExp(`\\b${c}\\b`, "i").test(joined)) {
      return { display: titleCaseColor(c), certainty: "certain", source: "sheet_header" };
    }
  }
  const rev = joined.match(/\brev(?:ision)?[\s.:]*([a-z0-9.]+)\b/i);
  if (rev?.[1]) {
    return { display: `Rev ${rev[1].toUpperCase()}`, certainty: "inferred", source: "sheet_header" };
  }
  return null;
}

function detectRevisionLabelFromColumnValues(values: string[]): DetectedRevisionLabel | null {
  for (const raw of values) {
    const v = raw.trim();
    if (!v) continue;
    const lower = v.toLowerCase();
    for (const c of ONE_LINER_REVISION_COLORS) {
      if (lower === c || lower.includes(c)) {
        return { display: titleCaseColor(c), certainty: "certain", source: "sheet_column" };
      }
    }
    if (/^rev\s*[a-d]$/i.test(v)) {
      return { display: v.replace(/\s+/g, " ").toUpperCase(), certainty: "certain", source: "sheet_column" };
    }
    if (/^revision\s*\d+/i.test(v) || /^rev\s*\d+/i.test(v)) {
      return { display: v, certainty: "certain", source: "sheet_column" };
    }
  }
  return null;
}

function resolveRevisionLabel(input: {
  fileName: string;
  headers?: string[];
  revisionColumnValues?: string[];
}): DetectedRevisionLabel {
  const fromFile = detectRevisionLabelFromFileName(input.fileName);
  if (fromFile?.certainty === "certain") return fromFile;
  const fromCol = input.revisionColumnValues?.length
    ? detectRevisionLabelFromColumnValues(input.revisionColumnValues)
    : null;
  if (fromCol?.certainty === "certain") return fromCol;
  const fromHeader = input.headers?.length ? detectRevisionLabelFromHeaders(input.headers) : null;
  if (fromHeader) return fromHeader;
  if (fromCol) return fromCol;
  if (fromFile) return fromFile;
  return { display: "Unknown Revision", certainty: "unknown", source: "none" };
}

// ---------------------------------------------------------------------------
// Date parsing (from expo/utils/scheduleParseDates.ts)
// ---------------------------------------------------------------------------

function parseFlexScheduleDate(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const iso = Date.parse(trimmed);
  if (!Number.isNaN(iso)) return iso;
  const m = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (m) {
    const mm = parseInt(m[1]!, 10);
    const dd = parseInt(m[2]!, 10);
    let yy = parseInt(m[3]!, 10);
    if (yy < 100) yy += 2000;
    const d = new Date(yy, mm - 1, dd);
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }
  return null;
}

// ---------------------------------------------------------------------------
// CSV parsing (from expo/utils/productionImportCsv.ts)
// ---------------------------------------------------------------------------

function parseCsvMatrix(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let i = 0;
  let inQuotes = false;

  while (i < content.length) {
    const c = content[i]!;
    if (inQuotes) {
      if (c === '"' && content[i + 1] === '"') {
        cur += '"';
        i += 2;
        continue;
      }
      if (c === '"') {
        inQuotes = false;
        i++;
        continue;
      }
      cur += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(cur);
      cur = "";
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
      i++;
      continue;
    }
    if (c === "\r") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
      if (content[i + 1] === "\n") i += 2;
      else i++;
      continue;
    }
    cur += c;
    i++;
  }
  row.push(cur);
  if (row.length > 1 || row[0] !== "") rows.push(row);
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

type CsvPreview = { headers: string[]; rows: Record<string, string>[] };

function buildCsvPreview(content: string, maxRows = 500): CsvPreview {
  const matrix = parseCsvMatrix(content.trim());
  if (matrix.length === 0) return { headers: [], rows: [] };
  const rawHeaders = matrix[0]?.map((h, idx) => {
    const t = h.trim();
    return t !== "" ? t : `Column ${idx + 1}`;
  });
  const counts: Record<string, number> = {};
  const headers = rawHeaders.map((base) => {
    counts[base] = (counts[base] ?? 0) + 1;
    const n = counts[base];
    return n === 1 ? base : `${base} (${n})`;
  });
  const dataRows = matrix.slice(1, 1 + maxRows);
  const rows: Record<string, string>[] = dataRows.map((cells) => {
    const obj: Record<string, string> = {};
    headers.forEach((key, j) => {
      obj[key] = cells[j]?.trim() ?? "";
    });
    return obj;
  });
  return { headers, rows };
}

// ---------------------------------------------------------------------------
// Header alias resolution (exact port from mobile)
// ---------------------------------------------------------------------------

const HEADER_ALIASES: Record<string, string[]> = {
  date: ["date", "shoot date", "shoot_date", "day date", "day_date", "shootday"],
  dayNumber: ["day", "day #", "day number", "daynumber", "shoot day", "shoot_day"],
  scenes: ["scenes", "scene", "scene numbers", "scene #", "scene numbers / pages"],
  intExt: ["int/ext", "intext", "int ext", "ie"],
  dayNight: ["d/n", "dn", "day/night", "day night"],
  location: ["location", "loc", "site", "working location"],
  setName: ["set", "set name", "setname", "description"],
  unit: ["unit", "unit label", "u"],
  companyMove: ["company move", "company_move", "move", "travel", "cm"],
  pages: ["pages", "page count", "page", "pgs"],
  episode: ["episode", "ep", "episode #", "ep #"],
  revision: ["revision", "rev", "revision color", "color"],
  notes: ["notes", "note", "comments", "remarks"],
  zone: ["zone", "stage", "stage/zone"],
  block: ["block", "blockid", "block id"],
};

function normHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveColumn(row: Record<string, string>, field: keyof typeof HEADER_ALIASES): string {
  const aliases = HEADER_ALIASES[field] ?? [];
  const normalized = new Map<string, string>();
  for (const [k, v] of Object.entries(row)) {
    normalized.set(normHeader(k), v);
  }
  for (const alias of aliases) {
    const v = normalized.get(normHeader(alias));
    if (v?.trim()) return v.trim();
  }
  return "";
}

// ---------------------------------------------------------------------------
// Row mapping (exact port from mobile)
// ---------------------------------------------------------------------------

function parseIntExt(raw: string): ShootDay["intExt"] | undefined {
  const u = raw.toUpperCase();
  if (u.includes("INT/EXT")) return "INT/EXT";
  if (u === "INT" || u.startsWith("INT ")) return "INT";
  if (u === "EXT" || u.startsWith("EXT ")) return "EXT";
  return undefined;
}

function parseScenes(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[;,|\n/]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseCompanyMove(raw: string): boolean | undefined {
  const t = raw.trim().toLowerCase();
  if (!t) return undefined;
  if (/^(yes|y|true|1|x|cm|move)$/i.test(t)) return true;
  if (/^(no|n|false|0|-)$/i.test(t)) return false;
  if (t.includes("company move")) return true;
  return undefined;
}

function overallConfidence(parts: OneLinerFieldConfidence[]): OneLinerFieldConfidence {
  if (parts.includes("missing") || parts.includes("uncertain")) return "uncertain";
  if (parts.includes("inferred")) return "inferred";
  return "certain";
}

function mapRecordToShootDay(
  row: Record<string, string>,
  rowIndex: number,
  defaultBlockId: string,
  docId: string | null,
): { parsed: ParsedOneLinerRow | null; unresolved: OneLinerUnresolvedRow | null } {
  const dateRaw = resolveColumn(row, "date");
  const ts = parseFlexScheduleDate(dateRaw);
  if (!ts) {
    return {
      parsed: null,
      unresolved: {
        rowIndex,
        reason: dateRaw ? `Unrecognized date: ${dateRaw}` : "Missing shoot date",
        raw: row,
      },
    };
  }

  const dayStr = resolveColumn(row, "dayNumber");
  const dayNumber = Math.max(1, parseInt(dayStr, 10) || rowIndex + 1);
  const locationRaw = resolveColumn(row, "location") || resolveColumn(row, "setName");
  const location = locationRaw.trim() || "TBD";
  const scenesRaw = resolveColumn(row, "scenes");
  const scenes = parseScenes(scenesRaw);
  const intExtRaw = resolveColumn(row, "intExt");
  const intExt = parseIntExt(intExtRaw);
  const unitLabel = resolveColumn(row, "unit") || undefined;
  const companyMove = parseCompanyMove(resolveColumn(row, "companyMove"));
  const setName = resolveColumn(row, "setName") || undefined;
  const zone = resolveColumn(row, "zone") || undefined;
  const blockId = resolveColumn(row, "block") || defaultBlockId;
  const pages = resolveColumn(row, "pages");
  const dn = resolveColumn(row, "dayNight");
  const notesParts = [resolveColumn(row, "notes"), pages ? `Pages: ${pages}` : ""].filter(Boolean);
  const notes = notesParts.join(" · ") || undefined;

  const setup: ShootDaySetup = {
    setName: setName && setName !== location ? setName : location,
    intExt: intExt ?? "INT",
    dayNight: (dn?.toUpperCase().startsWith("N")
      ? "N"
      : dn?.toUpperCase().startsWith("D")
        ? "D"
        : undefined) as ShootDaySetup["dayNight"],
    scenes,
    sortOrder: 0,
  };

  const units: ShootDayUnit[] = unitLabel ? [{ unitLabel }] : [{ unitLabel: "MAIN UNIT" }];

  const dateConf: OneLinerFieldConfidence = dateRaw ? "certain" : "missing";
  const locConf: OneLinerFieldConfidence = locationRaw ? "certain" : "uncertain";
  const sceneConf: OneLinerFieldConfidence = scenes.length > 0 ? "certain" : "missing";
  const intConf: OneLinerFieldConfidence = intExtRaw ? (intExt ? "certain" : "uncertain") : "missing";
  const unitConf: OneLinerFieldConfidence = unitLabel ? "certain" : "missing";

  const shootDay: ShootDay = {
    id: `sd-ol-${ts}-${rowIndex}`,
    blockId,
    dayNumber,
    date: ts,
    location,
    zone,
    setups: [setup],
    units,
    companyMove,
    notes,
    productionDocumentSourceId: docId ?? undefined,
    scenes,
    intExt,
    setName: setName !== location ? setName : undefined,
    unitLabel,
  };

  return {
    parsed: {
      rowIndex,
      shootDay,
      confidence: {
        date: dateConf,
        location: locConf,
        scenes: sceneConf,
        intExt: intConf,
        unit: unitConf,
        overall: overallConfidence([dateConf, locConf, sceneConf, intConf, unitConf]),
      },
      rawCells: row,
    },
    unresolved: null,
  };
}

// ---------------------------------------------------------------------------
// Tabular row parsing
// ---------------------------------------------------------------------------

function extractEpisodeFromRows(rows: Record<string, string>[]): string | null {
  for (const row of rows.slice(0, 8)) {
    const ep = resolveColumn(row, "episode");
    if (ep) return ep;
  }
  return null;
}

function parseTabularRows(
  tableRows: Record<string, string>[],
  headers: string[],
  defaultBlockId: string,
  docId: string | null,
): OneLinerParseResult {
  const parsedRows: ParsedOneLinerRow[] = [];
  const unresolvedRows: OneLinerUnresolvedRow[] = [];
  const warnings: string[] = [];

  tableRows.forEach((row, idx) => {
    const { parsed, unresolved } = mapRecordToShootDay(row, idx, defaultBlockId, docId);
    if (parsed) parsedRows.push(parsed);
    if (unresolved) unresolvedRows.push(unresolved);
  });

  if (parsedRows.length === 0 && tableRows.length > 0) {
    warnings.push("No shoot days could be parsed — check date column mapping.");
  }
  if (unresolvedRows.length > 0) {
    warnings.push(`${unresolvedRows.length} row(s) need manual review (date or required fields missing).`);
  }
  const uncertain = parsedRows.filter((r) => r.confidence.overall !== "certain").length;
  if (uncertain > 0) {
    warnings.push(`${uncertain} parsed row(s) flagged with uncertain fields — verify before commit.`);
  }

  let parseQuality: OneLinerParseQuality = "minimal";
  if (parsedRows.length > 0 && unresolvedRows.length === 0) parseQuality = "full";
  else if (parsedRows.length > 0) parseQuality = "partial";

  return {
    rows: parsedRows,
    unresolvedRows,
    warnings,
    revisionLabel: null,
    episodeIdentifier: extractEpisodeFromRows(tableRows),
    detectedColumns: headers,
    sourceFormat: "csv",
    parseQuality,
  };
}

// ---------------------------------------------------------------------------
// Format-specific parsers
// ---------------------------------------------------------------------------

function parseCsvText(text: string, defaultBlockId: string, docId: string | null): OneLinerParseResult {
  const preview = buildCsvPreview(text, 800);
  const base = parseTabularRows(preview.rows, preview.headers, defaultBlockId, docId);
  return { ...base, sourceFormat: "csv" };
}

function matrixToPreview(matrix: string[][]): { headers: string[]; rows: Record<string, string>[] } {
  if (matrix.length === 0) return { headers: [], rows: [] };
  const rawHeaders = matrix[0]?.map((h, idx) => {
    const t = h.trim();
    return t !== "" ? t : `Column ${idx + 1}`;
  });
  const rows = matrix.slice(1).map((cells) => {
    const obj: Record<string, string> = {};
    rawHeaders.forEach((key, j) => {
      obj[key] = cells[j]?.trim() ?? "";
    });
    return obj;
  });
  return { headers: rawHeaders, rows: rows.filter((r) => Object.values(r).some((v) => v.trim())) };
}

function parseXlsxBuffer(buffer: Buffer, defaultBlockId: string, docId: string | null): OneLinerParseResult {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) {
    return {
      rows: [],
      unresolvedRows: [],
      warnings: ["XLSX file has no sheets."],
      revisionLabel: null,
      episodeIdentifier: null,
      detectedColumns: [],
      sourceFormat: "xlsx",
      parseQuality: "minimal",
    };
  }
  const sheet = wb.Sheets[sheetName]!;
  const matrix: (string | number)[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const strMatrix = matrix.map((row: (string | number)[]) =>
    row.map((cell: string | number) => String(cell ?? "").trim()),
  );
  const preview = matrixToPreview(strMatrix);
  const base = parseTabularRows(preview.rows, preview.headers, defaultBlockId, docId);
  return { ...base, sourceFormat: "xlsx" };
}

function parsePdfText(text: string, defaultBlockId: string, docId: string | null): OneLinerParseResult {
  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const tableRows: Record<string, string>[] = [];
  const dateLine = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})/;

  lines.forEach((line, idx) => {
    const dm = line.match(dateLine);
    if (!dm) return;
    const dateRaw = dm[1]!;
    const rest = line.replace(dateRaw, " ").replace(/\s+/g, " ").trim();
    const sceneMatch = rest.match(/\b(\d+[A-Za-z]?(?:\s*[-,&]\s*\d+[A-Za-z]?)*)\b/);
    tableRows.push({
      date: dateRaw,
      day: String(tableRows.length + 1),
      scenes: sceneMatch?.[1] ?? "",
      location: rest.replace(sceneMatch?.[0] ?? "", "").trim() || "TBD",
      notes: rest,
      _line: String(idx),
    });
  });

  const preview = parseTabularRows(tableRows, ["date", "day", "scenes", "location", "notes"], defaultBlockId, docId);
  const warnings = [...preview.warnings];
  if (preview.rows.length === 0) {
    warnings.push("PDF text extraction yielded no dated rows — file may be scanned; OCR not available.");
  } else {
    warnings.push("PDF parsed with line heuristics — verify rows against the original document.");
  }
  return {
    ...preview,
    sourceFormat: "pdf",
    parseQuality: preview.rows.length > 0 ? "partial" : "minimal",
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function inferFileFormat(mimeType: string, fileName: string): "csv" | "xlsx" | "pdf" | null {
  const m = mimeType.toLowerCase();
  const n = fileName.toLowerCase();
  if (m.includes("pdf") || n.endsWith(".pdf")) return "pdf";
  if (m.includes("csv") || n.endsWith(".csv")) return "csv";
  if (/\.xlsx?$/.test(n) || m.includes("spreadsheet") || m.includes("sheet")) return "xlsx";
  return null;
}

/**
 * Parse a schedule file buffer into ShootDay rows.
 * Exact same logic as mobile One-Liner import.
 */
export function parseScheduleBuffer(input: {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
  defaultBlockId: string;
  productionDocumentId?: string | null;
}): OneLinerParseResult {
  const format = inferFileFormat(input.mimeType, input.fileName);
  if (!format) {
    return {
      rows: [],
      unresolvedRows: [],
      warnings: ["Unsupported file type — use PDF, CSV, or XLSX."],
      revisionLabel: resolveRevisionLabel({ fileName: input.fileName }).display,
      episodeIdentifier: null,
      detectedColumns: [],
      sourceFormat: "csv",
      parseQuality: "minimal",
    };
  }

  let result: OneLinerParseResult;
  if (format === "csv") {
    const text = input.buffer.toString("utf8");
    result = parseCsvText(text, input.defaultBlockId, input.productionDocumentId ?? null);
  } else if (format === "xlsx") {
    result = parseXlsxBuffer(input.buffer, input.defaultBlockId, input.productionDocumentId ?? null);
  } else {
    const binary = input.buffer.toString("latin1");
    const extracted = extractPdfTextLinesFromBinaryPageIsolated(binary);
    result = parsePdfText(extracted.text, input.defaultBlockId, input.productionDocumentId ?? null);
    if (extracted.pagesFailed > 0 && extracted.pagesSucceeded === 0) {
      result.warnings.push("PDF appears scanned — extracted text is minimal.");
    }
  }

  const revCol = result.rows
    .map((r) => {
      const cells = r.rawCells;
      return cells.revision ?? cells.Revision ?? cells.rev ?? "";
    })
    .filter(Boolean);
  const resolved = resolveRevisionLabel({
    fileName: input.fileName,
    headers: result.detectedColumns,
    revisionColumnValues: revCol,
  });
  result.revisionLabel = resolved.certainty === "unknown" ? null : resolved.display;
  return result;
}

export function parsedRowsToShootDays(rows: ParsedOneLinerRow[]): ShootDay[] {
  return rows.map((r) => r.shootDay);
}

export function fingerprintShootDays(days: ShootDay[]): string {
  const canonical = JSON.stringify(
    days.map((d) => ({
      dayNumber: d.dayNumber,
      date: new Date(d.date).toISOString().slice(0, 10),
      location: d.location,
      scenes: d.scenes,
      unitLabel: d.unitLabel ?? null,
      companyMove: d.companyMove ?? null,
    })),
  );
  return createHash("sha256").update(canonical).digest("hex");
}
