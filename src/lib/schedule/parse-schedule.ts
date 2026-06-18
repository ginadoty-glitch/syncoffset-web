/**
 * Server-side schedule parser — ported from expo/services/oneLinerScheduleParse.ts.
 * Handles CSV, XLSX, and PDF (heuristic line extraction).
 * No Expo dependencies — uses Node Buffer and crypto.
 */

import * as XLSX from "xlsx";

import {
  appendCompanyMoveIntegrityWarnings,
  linkCompanyMoveDestinations,
  locationsDiffer,
  parseCompanyMoveTypeFromLine,
} from "@/lib/schedule/company-move-inference";
import { extractScriptPdfText } from "@/lib/script/pdf-extract";
import type {
  OneLinerFieldConfidence,
  OneLinerParseQuality,
  OneLinerParseResult,
  OneLinerUnresolvedRow,
  ParsedOneLinerRow,
  ShootDay,
  ShootDayEvent,
  ShootDayEventType,
  ShootDaySetup,
  ShootDayUnit,
} from "@/types/schedule";

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

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function parseFlexScheduleDate(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // MM/DD/YYYY or MM-DD-YYYY
  const numeric = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (numeric) {
    const mm = parseInt(numeric[1]!, 10);
    const dd = parseInt(numeric[2]!, 10);
    let yy = parseInt(numeric[3]!, 10);
    if (yy < 100) yy += 2000;
    const d = new Date(yy, mm - 1, dd);
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }

  // YYYY-MM-DD (ISO)
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const d = new Date(parseInt(isoMatch[1]!, 10), parseInt(isoMatch[2]!, 10) - 1, parseInt(isoMatch[3]!, 10));
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }

  // Spelled-out: "Mon May 11, 2026" / "May 11 2026" / "May 11, 2026" / "11 May 2026"
  const spelled = trimmed.match(/(?:\w+\s+)?(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?\s*,?\s*(\d{4})/i);
  if (spelled) {
    const monthIdx = MONTH_MAP[spelled[1]?.toLowerCase()];
    if (monthIdx !== undefined) {
      const d = new Date(parseInt(spelled[3]!, 10), monthIdx, parseInt(spelled[2]!, 10));
      if (!Number.isNaN(d.getTime())) return d.getTime();
    }
  }

  // "11 May 2026" (day-first)
  const dayFirst = trimmed.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})/i);
  if (dayFirst) {
    const monthIdx = MONTH_MAP[dayFirst[2]?.toLowerCase()];
    if (monthIdx !== undefined) {
      const d = new Date(parseInt(dayFirst[3]!, 10), monthIdx, parseInt(dayFirst[1]!, 10));
      if (!Number.isNaN(d.getTime())) return d.getTime();
    }
  }

  // Last resort: native Date.parse
  const iso = Date.parse(trimmed);
  if (!Number.isNaN(iso)) return iso;

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
  pmLocation: [
    "pm location",
    "company move destination",
    "company_move_destination",
    "after lunch location",
    "secondary location",
  ],
  companyMoveType: ["company move type", "company_move_type", "move type", "move timing"],
  destinationSource: ["destination source", "destination_source", "pm source"],
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
  const pmLocationRaw = resolveColumn(row, "pmLocation");
  const companyMoveTypeRaw = resolveColumn(row, "companyMoveType");
  const destinationSourceRaw = resolveColumn(row, "destinationSource");
  const companyMoveDestination = pmLocationRaw.trim() || undefined;
  const companyMoveType = companyMoveTypeRaw.trim() || undefined;
  const companyMoveDestinationSource = destinationSourceRaw.trim() || undefined;
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
    companyMoveDestination,
    companyMoveType: companyMoveType || (companyMove ? "unknown" : undefined),
    companyMoveDestinationSource: companyMoveDestinationSource || (companyMoveDestination ? "same_strip" : undefined),
    companyMoveDestinationConfidence:
      companyMoveDestination && (companyMoveDestinationSource || "same_strip") === "same_strip" ? 1 : undefined,
    workPeriods:
      companyMove && companyMoveDestination
        ? [
            { label: "DAY WORK", setupIndexes: [0] },
            {
              label: (companyMoveType || "after lunch") === "before lunch" ? "BEFORE LUNCH" : "AFTER LUNCH",
              setupIndexes: [],
            },
          ]
        : undefined,
    notes,
    totalPages: pages.trim() || undefined,
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

  const shootDays = parsedRows.map((r) => r.shootDay);
  linkCompanyMoveDestinations(shootDays);
  appendCompanyMoveIntegrityWarnings(shootDays, warnings);

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

const DATE_LINE_RE = new RegExp(
  [
    /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.source, // MM/DD/YYYY
    /\d{4}-\d{2}-\d{2}/.source, // YYYY-MM-DD
    /(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*\s+\w+\s+\d{1,2},?\s+\d{4}/.source, // Mon May 11, 2026
    /\w+\s+\d{1,2},?\s+\d{4}/.source, // May 11, 2026
    /\d{1,2}\s+\w+\s+\d{4}/.source, // 11 May 2026
  ].join("|"),
  "i",
);

// "End of Shooting Day 1 -- Monday, June 22, 2026 -- 4 1/8 Pages"
// "End Day # 3 -- Wednesday, May 13, 2026 -- Total Pages: 2 5/8"
const DAY_BANNER_RE = /end\s+(?:of\s+)?(?:shooting\s+)?day\s*#?\s*(\d+)?/i;
const PDF_INT_EXT_RE = /^(INT\/EXT|EXT\/INT|INT|EXT)\.?$/i;
const PDF_DAY_NIGHT_RE = /^([DN])\d*$/i;
const PDF_DAY_HEADER_RE = /^DAY\s+\d+\s*[(\b]/i;

function isNoiseDateLine(line: string): boolean {
  return line.includes("***") || /\bCREATED\b/i.test(line) || /script\s+date/i.test(line);
}

/**
 * Extract one shoot-day record from the strip lines preceding an
 * "End of Shooting Day" banner (Movie Magic one-liner PDF layout).
 * Strips render as: SET NAME / scene numbers / INT|EXT / pages+cast /
 * "Scenes:" / description / D-number.
 */
function extractDayFromBannerBlock(
  block: string[],
  bannerLine: string,
  dateRaw: string,
  fallbackDayNumber: number,
): Record<string, string> {
  const dayMatch = bannerLine.match(DAY_BANNER_RE);
  const pagesMatch = bannerLine.match(/(\d+\s+\d+\/\d+|\d+\/\d+|\d+)\s*pages/i);

  let location = "";
  const amSetCounts = new Map<string, number>();
  const pmSetCounts = new Map<string, number>();
  const scenes: string[] = [];
  const intExtVotes: string[] = [];
  const dayNightVotes: string[] = [];
  let companyMove = false;
  let companyMoveType = "unknown";
  let pastCompanyMove = false;

  const recordSetLine = (setLine: string) => {
    if (
      !setLine ||
      !/[A-Za-z]{3,}/.test(setLine) ||
      /scenes:|calltime/i.test(setLine) ||
      PDF_DAY_NIGHT_RE.test(setLine) ||
      PDF_DAY_HEADER_RE.test(setLine) ||
      /company\s+move/i.test(setLine)
    ) {
      return;
    }
    const bucket = pastCompanyMove ? pmSetCounts : amSetCounts;
    bucket.set(setLine, (bucket.get(setLine) ?? 0) + 1);
  };

  for (let i = 0; i < block.length; i++) {
    const l = block[i] ?? "";

    if (PDF_DAY_HEADER_RE.test(l)) {
      const next = block[i + 1]?.trim() ?? "";
      if (next && !PDF_INT_EXT_RE.test(next) && !/CALLTIME/i.test(next)) location = next;
      continue;
    }

    if (/company\s+move/i.test(l)) {
      companyMove = true;
      companyMoveType = parseCompanyMoveTypeFromLine(l);
      pastCompanyMove = true;
      continue;
    }

    if (PDF_INT_EXT_RE.test(l)) {
      intExtVotes.push(l.toUpperCase().replace(/\.$/, ""));
      const sceneLine = block[i - 1]?.trim() ?? "";
      const setLine = block[i - 2]?.trim() ?? "";
      const sceneTokens = sceneLine.match(/\d+[A-Z]{0,2}(?:\s*PT\s*\.?\s*\d+)?/gi) ?? [];
      const sceneLineIsScenes = sceneTokens.length > 0 && !/CALLTIME|[a-z]{4,}/.test(sceneLine);
      if (sceneLineIsScenes) {
        for (const t of sceneTokens) {
          const cleaned = t.replace(/\s+/g, " ").trim();
          if (!scenes.includes(cleaned)) scenes.push(cleaned);
        }
      }
      recordSetLine(setLine);
      continue;
    }

    const dn = l.match(PDF_DAY_NIGHT_RE);
    if (dn?.[1]) dayNightVotes.push(dn[1].toUpperCase());
  }

  const majority = (votes: string[]): string => {
    if (votes.length === 0) return "";
    const counts = new Map<string, number>();
    for (const v of votes) counts.set(v, (counts.get(v) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
  };

  const topFrom = (counts: Map<string, number>): string =>
    [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";

  const amTopSet = topFrom(amSetCounts);
  const pmTopSet = topFrom(pmSetCounts);
  const amLocation = location || amTopSet || "TBD";
  const pmDestination = companyMove && pmTopSet && locationsDiffer(amLocation, pmTopSet) ? pmTopSet : "";

  return {
    date: dateRaw,
    day: dayMatch?.[1] ?? String(fallbackDayNumber),
    scenes: scenes.join(", "),
    location: amLocation,
    set: amTopSet || topFrom(amSetCounts) || topFrom(pmSetCounts),
    "int/ext": majority(intExtVotes),
    "d/n": majority(dayNightVotes),
    pages: pagesMatch?.[1]?.trim() ?? "",
    "company move": companyMove ? "yes" : "",
    "pm location": pmDestination,
    "company move type": companyMoveType,
    "destination source": pmDestination ? "same_strip" : "",
    notes: "",
  };
}

const PDF_HEADERS = [
  "date",
  "day",
  "scenes",
  "location",
  "set",
  "int/ext",
  "d/n",
  "pages",
  "company move",
  "pm location",
  "company move type",
  "destination source",
  "notes",
];

// ---------------------------------------------------------------------------
// Prep memo parsing (prep-schedule PDFs: dated meeting/scout blocks, no strips)
// ---------------------------------------------------------------------------

// "THURSDAY, JUNE 11     Prep Day 9 of 15     Tech Survey — Day 1"
const PREP_DAY_HEADER_RE =
  /^(?:MON|TUE|WED|THU|FRI|SAT|SUN)[A-Z]*,?\s+([A-Za-z]+)\s+(\d{1,2})\b.*?\bPREP\s+DAY\s+(\d+)\s+OF\s+(\d+)/i;
const PREP_YEAR_RE = /\b(20\d{2})\b/;
// "0900 - 1000 HAIR & MAKEUP MEETING (Zoom)" · "All day TECH SURVEY — … (On location)" · "TBD VFX MEETING (Zoom)"
const PREP_EVENT_RE = /^(All\s+day|TBD|\d{3,4}\s*-{1,2}\s*\d{3,4}(?:\s+TBD)?|\d{3,4})\s+(.*\S)\s+\(([^)]+)\)\s*$/i;
const PREP_SECTION_RE =
  /^(WEEK\s+(?:ONE|TWO|THREE|FOUR|FIVE|SIX)\b|END\s+OF\s+PREP|PRINCIPAL\s+PHOTOGRAPHY|POSITION\s+ABBREVIATIONS|CONFIDENTIAL)/i;
const PREP_HEADERS = ["date", "prepDay", "events"];

function classifyPrepEvent(title: string): ShootDayEventType {
  const t = title.toLowerCase();
  if (/tech\s*survey|tech\s*scout|\bscout\b/.test(t)) return "tech_scout";
  if (/location/.test(t) && /scout|review/.test(t)) return "location_scout";
  if (/production\s+meeting/.test(t)) return "production_meeting";
  if (/logistics/.test(t)) return "logistics_meeting";
  if (/fitting/.test(t)) return "costume_fitting";
  if (/show\s*&?\s*tell|show\s+and\s+tell/.test(t)) return "props_show_and_tell";
  if (/health|safety/.test(t)) return "safety_meeting";
  if (/camera\s+(?:load|test)/.test(t)) return "camera_test";
  if (/read-?through|rehears/.test(t)) return "rehearsal";
  if (/load-?in|pre-?light/.test(t)) return "pre_light";
  if (/meeting|review|discussion|recap|walkthrough/.test(t)) return "production_meeting";
  return "other";
}

function extractPrepLocation(title: string): string | undefined {
  const parts = title.split(/\s[—–-]\s/);
  if (parts.length > 1) {
    const tail = parts.slice(1).join(" — ").trim();
    if (tail && /[A-Za-z]/.test(tail)) return tail;
  }
  return undefined;
}

function parsePrepMemo(lines: string[], defaultBlockId: string, docId: string | null): OneLinerParseResult | null {
  const headerIdxs: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (PREP_DAY_HEADER_RE.test(lines[i] ?? "")) headerIdxs.push(i);
  }
  if (headerIdxs.length < 2) return null;

  let year = new Date().getFullYear();
  for (const l of lines.slice(0, 30)) {
    const m = l.match(PREP_YEAR_RE);
    if (m?.[1]) {
      year = Number.parseInt(m[1], 10);
      break;
    }
  }

  const parsedRows: ParsedOneLinerRow[] = [];

  headerIdxs.forEach((startIdx, h) => {
    const header = lines[startIdx] ?? "";
    const hm = header.match(PREP_DAY_HEADER_RE);
    if (!hm) return;
    const ts = parseFlexScheduleDate(`${hm[1]} ${hm[2]}, ${year}`);
    if (!ts) return;
    const prepDayNum = Number.parseInt(hm[3] ?? "0", 10);
    const prepTotal = hm[4] ?? "";

    const endIdx = h + 1 < headerIdxs.length ? (headerIdxs[h + 1] ?? lines.length) : lines.length;
    const block = lines.slice(startIdx + 1, endIdx);

    const events: ShootDayEvent[] = [];
    let cur: ShootDayEvent | null = null;
    let attendeeBuf: string[] = [];
    let attendeeMode = false;

    const flushAttendees = () => {
      if (cur && attendeeBuf.length > 0) {
        cur.attendees = attendeeBuf
          .join(" ")
          .replace(/\s+/g, " ")
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
      }
      attendeeBuf = [];
      attendeeMode = false;
    };

    for (const raw of block) {
      const line = raw.trim();
      if (!line) continue;
      if (PREP_SECTION_RE.test(line)) {
        flushAttendees();
        break;
      }

      const em = line.match(PREP_EVENT_RE);
      if (em) {
        flushAttendees();
        const title = (em[2] ?? "").replace(/\s+/g, " ").trim();
        const modality = (em[3] ?? "").trim();
        cur = {
          eventType: classifyPrepEvent(title),
          title,
          startTime: (em[1] ?? "").replace(/\s+/g, " ").trim(),
          location: extractPrepLocation(title),
          notes: modality ? `(${modality})` : undefined,
        };
        events.push(cur);
        continue;
      }

      if (/^agenda:/i.test(line)) {
        flushAttendees();
        if (cur) {
          const agenda = line.replace(/^agenda:\s*/i, "").trim();
          cur.notes = [cur.notes, agenda].filter(Boolean).join(" ");
        }
        continue;
      }

      if (/^to\s+attend:/i.test(line)) {
        attendeeMode = true;
        attendeeBuf = [line.replace(/^to\s+attend:\s*/i, "").trim()];
        continue;
      }

      if (attendeeMode) attendeeBuf.push(line);
    }
    flushAttendees();

    const isTechScout = events.some((e) => e.eventType === "tech_scout") || /tech\s*survey/i.test(header);

    const shootDay: ShootDay = {
      id: `sd-prep-${ts}-${h}`,
      blockId: defaultBlockId,
      dayNumber: prepDayNum,
      date: ts,
      location: `Prep Day ${prepDayNum} of ${prepTotal}`,
      calendarDayType: isTechScout ? "tech-scout" : "prep",
      setups: [],
      units: [{ unitLabel: "PREP" }],
      markers: [],
      events,
      scenes: [],
      productionDocumentSourceId: docId ?? undefined,
    };

    parsedRows.push({
      rowIndex: parsedRows.length,
      shootDay,
      confidence: {
        date: "certain",
        location: "inferred",
        scenes: "missing",
        intExt: "missing",
        unit: "inferred",
        overall: "inferred",
      },
      rawCells: {},
    });
  });

  if (parsedRows.length === 0) return null;

  const techScoutCount = parsedRows.filter((r) => r.shootDay.calendarDayType === "tech-scout").length;

  return {
    rows: parsedRows,
    unresolvedRows: [],
    warnings: [`Prep schedule parsed — ${parsedRows.length} prep day(s), ${techScoutCount} tech-scout day(s).`],
    revisionLabel: null,
    episodeIdentifier: null,
    detectedColumns: PREP_HEADERS,
    sourceFormat: "pdf",
    parseQuality: "partial",
  };
}

function parsePdfText(text: string, defaultBlockId: string, docId: string | null): OneLinerParseResult {
  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Pass 0 — prep memo (dated meeting/scout blocks). Distinct from shoot strips.
  const prep = parsePrepMemo(lines, defaultBlockId, docId);
  if (prep) return prep;

  const tableRows: Record<string, string>[] = [];

  // Pass 1 — Movie Magic one-liner layout: day blocks closed by
  // "End of (Shooting) Day N -- <date> -- X X/X Pages" banners. All strip
  // content (sets, scenes, INT/EXT, D/N) lives on the lines ABOVE the banner.
  let blockStart = 0;
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx] ?? "";
    const dm = line.match(DATE_LINE_RE);
    if (!dm || isNoiseDateLine(line)) continue;
    if (!DAY_BANNER_RE.test(line)) continue;
    tableRows.push(extractDayFromBannerBlock(lines.slice(blockStart, idx), line, dm[0], tableRows.length + 1));
    blockStart = idx + 1;
  }

  // Pass 2 — fallback for PDF layouts without day banners: one row per date line.
  if (tableRows.length === 0) {
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx] ?? "";
      const dm = line.match(DATE_LINE_RE);
      if (!dm || isNoiseDateLine(line)) continue;
      const dateRaw = dm[0];
      const rest = line.replace(dateRaw, " ").replace(/\s+/g, " ").trim();
      // A date with no surrounding content is a document header date, not a row.
      if (!rest) continue;
      const sceneMatch = rest.match(
        /\b(\d+[A-Za-z]?(?:(?:pt|PT)(?:\.\d+)?)?(?:\s*[-,&]\s*\d+[A-Za-z]?(?:(?:pt|PT)(?:\.\d+)?)?)*)\b/,
      );
      tableRows.push({
        date: dateRaw,
        day: String(tableRows.length + 1),
        scenes: sceneMatch?.[1] ?? "",
        location: rest.replace(sceneMatch?.[0] ?? "", "").trim() || "TBD",
        notes: rest,
        _line: String(idx),
      });
    }
  }

  const preview = parseTabularRows(tableRows, PDF_HEADERS, defaultBlockId, docId);
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
 * Async because PDF extraction uses pdf-parse (decompresses FlateDecode streams).
 */
export async function parseScheduleBuffer(input: {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
  defaultBlockId: string;
  productionDocumentId?: string | null;
}): Promise<OneLinerParseResult> {
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
    const extracted = await extractScriptPdfText(input.buffer);
    result = parsePdfText(extracted.text, input.defaultBlockId, input.productionDocumentId ?? null);
    if (extracted.text.length < 100) {
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
  const days = rows.map((r) => r.shootDay);
  linkCompanyMoveDestinations(days);
  return days;
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
