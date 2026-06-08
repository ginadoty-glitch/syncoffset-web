/**
 * Scene number normalization for deduplication.
 *
 * Rules:
 * 1. Trim whitespace
 * 2. Uppercase
 * 3. Strip trailing periods: "38pt." → "38PT"
 * 4. Preserve alpha prefixes: "A46" → "A46"
 * 5. Preserve alpha suffixes: "C42pt" → "C42PT"
 * 6. Preserve partial markers: "47pt" → "47PT"
 */
export function normalizeSceneNumber(raw: string): string {
  return raw.trim().toUpperCase().replace(/\.$/, "");
}

/**
 * Deduplicate scene numbers, returning (normalized, raw) pairs.
 * First occurrence's raw form is preserved.
 */
export function deduplicateSceneNumbers(rawNumbers: string[]): Array<{ normalized: string; raw: string }> {
  const seen = new Map<string, string>();
  for (const raw of rawNumbers) {
    const norm = normalizeSceneNumber(raw);
    if (norm && !seen.has(norm)) {
      seen.set(norm, raw);
    }
  }
  return Array.from(seen.entries()).map(([normalized, raw]) => ({ normalized, raw }));
}
