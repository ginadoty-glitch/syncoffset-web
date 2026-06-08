/**
 * Deterministic screenplay-style scene splitter.
 * Ported from expo/utils/scriptSceneParser.ts — zero Expo dependencies.
 *
 * Extracts scene headings, INT/EXT, set name, sub-location, and time of day
 * from screenplay plaintext. Pure string/regex ops.
 */

export type ParsedSceneDraft = {
  sceneNumber: string | null;
  heading: string;
  intExt: string | null;
  setName: string | null;
  subLocation: string | null;
  timeOfDay: string | null;
  body: string;
};

// Matches scene headings with optional leading scene number and revision markers (*, †)
const HEADING_PATTERN =
  /^\s*[*†]*\s*(?:(\d+[A-Za-z]?)\s*[.\s]+\s*)?(INT\/EXT\.|INT\.\s*\/\s*EXT\.|EXT\.|INT\.|I\/E\.)\s+(.+)$/i;

// Trailing scene number: PDF extractors often concatenate the right-margin scene number
// directly onto the time-of-day or last word, e.g. "DAY11" or "CONTINUOUS45A"
const TRAILING_SCENE_NUM = /(\d+[A-Za-z]?)$/;

function normalizeHeadingLine(line: string): string | null {
  const t = line.replace(/\u00a0/g, " ").trim();
  if (!t.length) return null;
  return t.replace(/\t/g, " ");
}

function canonicalIntExt(raw: string): string {
  const u = raw.replace(/\.\s*/g, "").replace(/\s+/g, "").toUpperCase();
  if (u === "INT") return "INT";
  if (u === "EXT") return "EXT";
  if (u === "INT/EXT" || u === "INTEXT") return "INT/EXT";
  if (u === "I/E" || u === "IE") return "E/I";
  return "INT";
}

const TOD_KEYWORDS = [
  "DAY",
  "NIGHT",
  "DAWN",
  "DUSK",
  "EVENING",
  "MORNING",
  "CONTINUOUS",
  "LATER",
  "SAME TIME",
  "MOMENTS LATER",
  "SAME",
  "BACK TO SCENE",
  "ESTABLISHING",
  "AFTERNOON",
  "SUNRISE",
  "SUNSET",
] as const;

const TOD_PATTERN = new RegExp(`^(${TOD_KEYWORDS.join("|")}|D|N|D\\/N)$`, "i");

/**
 * PDF extractors often concatenate left+right margin scene numbers onto the
 * heading text. "DAY11" is actually "DAY" + scene 1 (left margin "1" + right
 * margin "1"). Detect doubled numbers and de-duplicate.
 */
function deduplicateSceneNum(raw: string): string {
  // If the number has even length and first half equals second half, it's doubled
  if (raw.length >= 2 && raw.length % 2 === 0) {
    const half = raw.length / 2;
    if (raw.slice(0, half) === raw.slice(half)) {
      return raw.slice(0, half);
    }
  }
  // Handle letter suffixes: "45A45A" → "45A"
  const alphaMatch = raw.match(/^(.+?)(\1)$/);
  if (alphaMatch) return alphaMatch[1];
  return raw;
}

/**
 * Strip a trailing scene number that PDF extractors concatenate onto the last
 * segment, e.g. "DAY11" → { cleaned: "DAY", trailingNum: "1" }
 */
function stripTrailingSceneNumber(segment: string): { cleaned: string; trailingNum: string | null } {
  const m = segment.match(TRAILING_SCENE_NUM);
  if (!m) return { cleaned: segment, trailingNum: null };

  const candidate = segment.slice(0, -m[1].length).trim();
  // Only strip if what remains looks like a valid TOD keyword or location word
  if (candidate.length >= 1 && /[A-Za-z]/.test(candidate)) {
    return { cleaned: candidate, trailingNum: deduplicateSceneNum(m[1]) };
  }
  return { cleaned: segment, trailingNum: null };
}

/**
 * Splits "BILL'S OFFICE - FBI HQ - DAY" into:
 *   setName: "BILL'S OFFICE"
 *   subLocation: "FBI HQ"
 *   timeOfDay: "DAY"
 *
 * Also handles PDF-concatenated trailing scene numbers like "DAY22".
 */
function splitLocationTimeParts(tailRaw: string): {
  setName: string | null;
  subLocation: string | null;
  timeOfDay: string | null;
  extractedTrailingNumber: string | null;
} {
  const tail = tailRaw.trim();
  if (!tail.length) return { setName: null, subLocation: null, timeOfDay: null, extractedTrailingNumber: null };

  const SEP = /\s+[-–—]\s+/;
  const rawParts = tail
    .split(SEP)
    .map((s) => s.replace(/\.$/, "").trim())
    .filter(Boolean);

  if (rawParts.length === 0)
    return { setName: tail, subLocation: null, timeOfDay: null, extractedTrailingNumber: null };

  // Try stripping trailing scene number from last part
  const lastRaw = rawParts[rawParts.length - 1] ?? "";
  const { cleaned: lastCleaned, trailingNum } = stripTrailingSceneNumber(lastRaw);
  const parts = [...rawParts.slice(0, -1), lastCleaned];

  const first = parts[0] ?? tail;
  const lastPart = parts[parts.length - 1] ?? "";
  const hasTimeOfDay = TOD_PATTERN.test(lastPart);

  if (parts.length === 1) {
    return { setName: first, subLocation: null, timeOfDay: null, extractedTrailingNumber: trailingNum };
  }

  if (parts.length === 2) {
    if (hasTimeOfDay) {
      return { setName: first, subLocation: null, timeOfDay: lastPart, extractedTrailingNumber: trailingNum };
    }
    return { setName: first, subLocation: parts[1] ?? null, timeOfDay: null, extractedTrailingNumber: trailingNum };
  }

  if (hasTimeOfDay) {
    return {
      setName: first,
      subLocation: parts.slice(1, -1).join(" - "),
      timeOfDay: lastPart,
      extractedTrailingNumber: trailingNum,
    };
  }

  return {
    setName: first,
    subLocation: parts.slice(1).join(" - "),
    timeOfDay: null,
    extractedTrailingNumber: trailingNum,
  };
}

const CHARACTER_LINE_PATTERN = /^\s{10,}([A-Z][A-Z\s.'()-]{1,40})\s*(?:\(.*\))?\s*$/;

/** Extract uppercase character names from scene body text. */
export function extractCharacterNames(body: string): string[] {
  const names = new Set<string>();
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(CHARACTER_LINE_PATTERN);
    if (m?.[1]) {
      const name = m[1].replace(/\(.*\)/, "").trim();
      if (name.length >= 2 && name.length <= 40 && !/^(FADE|CUT|DISSOLVE|SMASH|END|THE END|CONTINUED)/i.test(name)) {
        names.add(name);
      }
    }
  }
  return Array.from(names).sort();
}

/** Parse screenplay plaintext into structured scene blocks. */
export function parseScriptScenes(scriptText: string): ParsedSceneDraft[] {
  const lines = scriptText.replace(/\u00a0/g, " ").split(/\r?\n/);

  const blocks: ParsedSceneDraft[] = [];
  let current: ParsedSceneDraft | null = null;
  let bodyLines: string[] = [];

  const flushBody = (): void => {
    if (!current) return;
    current.body = bodyLines.join("\n").trimEnd();
  };

  for (const raw of lines) {
    const normalizedHeading = normalizeHeadingLine(raw);

    if (normalizedHeading) {
      const m = normalizedHeading.match(HEADING_PATTERN);
      if (m?.[2] && m[3] != null) {
        if (current) {
          flushBody();
          blocks.push(current);
        }
        const numRaw = (m[1] ?? "").trim();
        const leadingNum = numRaw.length ? numRaw.replace(/\.$/, "") : null;
        const heading = normalizedHeading.trim();
        const stripped = m[3].trim();
        const intExt = canonicalIntExt(m[2]);
        const { setName, subLocation, timeOfDay, extractedTrailingNumber } = splitLocationTimeParts(stripped);

        // Prefer leading number; fall back to trailing number extracted from PDF concatenation
        const num = leadingNum ?? extractedTrailingNumber;

        current = {
          sceneNumber: num,
          heading,
          intExt,
          setName,
          subLocation,
          timeOfDay,
          body: "",
        };
        bodyLines = [];
        continue;
      }
    }

    if (current) {
      bodyLines.push(raw);
    }
  }

  if (current) {
    flushBody();
    blocks.push(current);
  }

  if (blocks.length === 0) {
    blocks.push({
      sceneNumber: null,
      heading: "Untitled strip (no headings found)",
      intExt: null,
      setName: null,
      subLocation: null,
      timeOfDay: null,
      body: scriptText.trim(),
    });
  }

  return blocks;
}
