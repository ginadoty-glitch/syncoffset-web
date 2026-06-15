/**
 * Location identity color — secondary calendar surface.
 *
 * Day-type still controls the card color (prep / tech-scout / shoot / move).
 * This module adds a SECOND, location-keyed color applied only to the
 * day's location chip, so a multi-day run at one place (e.g. SAWMILL ×4)
 * reads as a continuous block without scanning every cell.
 *
 * The canonical key is the primary location segment of the stored title.
 * Mirror writes title as `${location} · ${setName} · ...`, so the first
 * "·" segment is the parser's clean `location` value — NOT the set-name
 * concatenation. Coloring is a deterministic hash of that key, so the same
 * location always resolves to the same color for the production's duration.
 */

const SEGMENT_SEPARATOR = "·";

/** Original-case primary location segment, for display. */
export function locationDisplayLabel(rawTitle: string): string {
  return (rawTitle ?? "").split(SEGMENT_SEPARATOR)[0]?.trim() ?? "";
}

/** Normalized, stable key used for color hashing and run-continuity matching. */
export function canonicalLocationKey(rawTitle: string): string {
  return locationDisplayLabel(rawTitle)
    .toUpperCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fixed palette for location chips. Solid backgrounds with white text —
 * distinct from the translucent day-type card fills so the two color axes
 * never read as the same surface.
 */
const LOCATION_PALETTE = [
  "bg-emerald-600",
  "bg-red-600",
  "bg-blue-600",
  "bg-orange-500",
  "bg-violet-600",
  "bg-teal-600",
  "bg-pink-600",
  "bg-amber-600",
  "bg-cyan-600",
  "bg-lime-600",
  "bg-fuchsia-600",
  "bg-sky-600",
] as const;

const NEUTRAL_CHIP = "bg-slate-600";

/** Deterministic location-keyed chip background class. */
export function locationColorClass(rawTitle: string): string {
  const key = canonicalLocationKey(rawTitle);
  if (!key || key === "TBD") return NEUTRAL_CHIP;
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const idx = (hash >>> 0) % LOCATION_PALETTE.length;
  return LOCATION_PALETTE[idx];
}
