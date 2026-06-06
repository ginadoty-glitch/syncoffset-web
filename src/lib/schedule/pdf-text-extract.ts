/**
 * PDF text extraction — ported from expo/utils/pdfTextExtract.ts.
 * Pure string operations on PDF binary (latin-1 byte string).
 * No Expo dependencies. No OCR. Best-effort heuristic extraction.
 */

const MAX_BINARY_SCAN_BYTES = 12 * 1024 * 1024;
const MAX_OPERATOR_MATCHES = 50_000;

function unescapePdfString(inner: string): string {
  try {
    return inner
      .replace(/\\(\d{3})/g, (_, oct: string) => String.fromCharCode(parseInt(oct, 8)))
      .replace(/\\n/gi, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\\\/g, "\\");
  } catch {
    return inner;
  }
}

function decodePdfHexString(hexRaw: string): string {
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

type ChunkScanResult = {
  chunks: string[];
  truncated: boolean;
  parseIssues: number;
};

function extractPdfTextChunksSafe(binary: string): ChunkScanResult {
  const chunks: string[] = [];
  let parseIssues = 0;
  let truncated = false;

  const scanBinary = binary.length > MAX_BINARY_SCAN_BYTES ? binary.slice(0, MAX_BINARY_SCAN_BYTES) : binary;
  if (scanBinary.length < binary.length) truncated = true;

  const pushChunk = (raw: string) => {
    if (!raw || chunks.length >= MAX_OPERATOR_MATCHES) {
      if (chunks.length >= MAX_OPERATOR_MATCHES) truncated = true;
      return;
    }
    const cleaned = raw.replace(/\s+/g, " ").trim();
    if (cleaned) chunks.push(cleaned);
  };

  const tjRe = /\((?:\\.|[^)])*\)\s*[Tt]j/g;
  let tjCount = 0;
  for (const m of scanBinary.matchAll(tjRe)) {
    tjCount += 1;
    if (tjCount > MAX_OPERATOR_MATCHES) {
      truncated = true;
      break;
    }
    try {
      const raw = m[0];
      const open = raw.indexOf("(");
      const close = raw.lastIndexOf(")");
      if (open === -1 || close <= open) {
        parseIssues += 1;
        continue;
      }
      pushChunk(unescapePdfString(raw.slice(open + 1, close)));
    } catch {
      parseIssues += 1;
    }
  }

  const hexRe = /<([0-9A-Fa-f\s]+)>\s*[Tt]j/g;
  let hexCount = 0;
  for (const m of scanBinary.matchAll(hexRe)) {
    hexCount += 1;
    if (tjCount + hexCount > MAX_OPERATOR_MATCHES) {
      truncated = true;
      break;
    }
    try {
      pushChunk(decodePdfHexString(m[1] ?? ""));
    } catch {
      parseIssues += 1;
    }
  }

  const tjArrayRe = /\[(.*?)\]\s*TJ/g;
  let arrayCount = 0;
  for (const m of scanBinary.matchAll(tjArrayRe)) {
    arrayCount += 1;
    if (tjCount + hexCount + arrayCount > MAX_OPERATOR_MATCHES) {
      truncated = true;
      break;
    }
    try {
      const inner = m[1] ?? "";
      const parts = inner.match(/\((?:\\.|[^)])*\)/g) ?? [];
      for (const part of parts) {
        pushChunk(unescapePdfString(part.slice(1, -1)));
      }
      const hexParts = inner.match(/<([0-9A-Fa-f\s]+)>/g) ?? [];
      for (const hp of hexParts) {
        pushChunk(decodePdfHexString(hp.slice(1, -1)));
      }
    } catch {
      parseIssues += 1;
    }
  }

  return { chunks, truncated, parseIssues };
}

export function extractPdfTextLinesFromBinaryPageIsolated(binary: string): {
  text: string;
  pagesSucceeded: number;
  pagesFailed: number;
  parseIssues: number;
  truncated: boolean;
} {
  const indices: number[] = [0];
  const pageMarker = /\/Type\s*\/Page\b/g;
  for (const pm of binary.matchAll(pageMarker)) {
    indices.push(pm.index);
  }

  if (indices.length <= 1) {
    const { chunks, truncated, parseIssues } = extractPdfTextChunksSafe(binary);
    const text = chunks
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return {
      text,
      pagesSucceeded: text ? 1 : 0,
      pagesFailed: text ? 0 : 1,
      parseIssues,
      truncated,
    };
  }

  const parts: string[] = [];
  let pagesSucceeded = 0;
  let pagesFailed = 0;
  let parseIssues = 0;
  let truncated = false;

  for (let i = 0; i < indices.length; i += 1) {
    const start = indices[i] ?? 0;
    const end = i + 1 < indices.length ? (indices[i + 1] ?? binary.length) : binary.length;
    try {
      const segment = binary.slice(start, end);
      const seg = extractPdfTextChunksSafe(segment);
      parseIssues += seg.parseIssues;
      if (seg.truncated) truncated = true;
      const pageText = seg.chunks
        .map((s) => s.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join("\n");
      if (pageText) {
        parts.push(pageText);
        pagesSucceeded += 1;
      } else {
        pagesFailed += 1;
      }
    } catch {
      pagesFailed += 1;
      parseIssues += 1;
    }
  }

  const text = parts
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text, pagesSucceeded, pagesFailed, parseIssues, truncated };
}
