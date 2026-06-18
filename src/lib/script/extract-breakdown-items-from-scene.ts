import { BREAKDOWN_ELEMENT_TYPES } from "@/lib/script-hub/breakdown-element-types";

/** Auto-generated breakdown rows use this note so backfill can replace them safely. */
export const BREAKDOWN_EXTRACT_NOTE = "script-import-extract";

type ElementCategory = (typeof BREAKDOWN_ELEMENT_TYPES)[number]["category"];

export type ExtractedBreakdownItem = {
  label: string;
  category: ElementCategory;
  department: string;
  quantity: number;
  notes: string;
  item_slot: string;
};

type SceneInput = {
  scene_number: string | null;
  scene_heading: string;
  location_name: string | null;
  raw_text: string;
  breakdown_draft: Record<string, unknown>;
};

const ELEMENT_BY_CATEGORY = Object.fromEntries(BREAKDOWN_ELEMENT_TYPES.map((e) => [e.category, e])) as Record<
  ElementCategory,
  (typeof BREAKDOWN_ELEMENT_TYPES)[number]
>;

const SKIP_CAPS = new Set([
  "INT",
  "EXT",
  "INTERCUT",
  "CONTINUED",
  "CONT'D",
  "CUT",
  "TO",
  "FADE",
  "IN",
  "OUT",
  "BACK",
  "ON",
  "AT",
  "THE",
  "AND",
  "OR",
  "A",
  "AN",
  "DAY",
  "NIGHT",
  "LATER",
  "SAME",
  "TIME",
  "MOMENTS",
  "ESTABLISHING",
  "SUPER",
  "TITLE",
  "END",
  "SCENE",
  "OMIT",
  "INSERT",
  "CLOSE",
  "WIDE",
  "ANGLE",
  "POV",
  "VFX",
  "SFX",
  "CGI",
  "I/E",
  "INT/EXT",
]);

const VEHICLE_TERMS =
  /\b(truck|van|suv|car|cars|pickup|semi|bus|motorcycle|bike|bicycle|vehicle|vehicles|ambulance|fire\s+truck|police\s+car|picture\s+car|hero\s+car|picture\s+vehicle|nd\s+vehicle|transport)\b/gi;

const GREENS_TERMS =
  /\b(tree|trees|foliage|grass|bush|bushes|plant|plants|forest|meadow|greenery|landscaping|shrub|shrubs|fern|ferns|vine|vines|underbrush|canopy)\b/gi;

const CONSTRUCTION_TERMS =
  /\b(build|built|building|construct|construction|scaffold|scaffolding|platform|rig|rigging|facade|flat|wall\s+build|deck|structure|frame|framing|set\s+wall)\b/gi;

const SET_DRESS_TERMS =
  /\b(furniture|sofa|couch|table|desk|lamp|curtain|curtains|rug|carpet|dressing|set\s+dec|set\s+decoration|drapery|art\s+work|artwork|mirror|shelf|shelves|bed|chair|bookshelf)\b/gi;

const PROP_TERMS =
  /\b(prop|props|hand\s+prop|hero\s+prop|practical|weapon|gun|rifle|pistol|knife|sword|phone|cellphone|briefcase|bag|backpack|box|crate|bottle|cup|glass|mug|keys|key|wallet|newspaper|book|letter|envelope|photo|photograph|picture|frame|tool|hammer|flashlight|radio|walkie|walkie-talkie|clipboard|folder|file|laptop|tablet|camera|binoculars|rope|chain|mask|helmet|hat|coat|jacket|umbrella|cigarette|lighter|match|torch|lantern|medkit|syringe|pill|bottle)\b/gi;

function departmentFor(category: ElementCategory): string {
  return ELEMENT_BY_CATEGORY[category]?.department ?? "Misc";
}

function titleCase(term: string): string {
  return term
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function addItem(
  items: ExtractedBreakdownItem[],
  seen: Set<string>,
  input: { label: string; category: ElementCategory; item_slot: string },
) {
  const label = input.label.trim();
  if (!label || label.length < 2) return;
  const key = `${input.category}:${label.toLowerCase()}`;
  if (seen.has(key)) return;
  seen.add(key);
  items.push({
    label,
    category: input.category,
    department: departmentFor(input.category),
    quantity: 1,
    notes: BREAKDOWN_EXTRACT_NOTE,
    item_slot: input.item_slot,
  });
}

function extractFromRegex(
  text: string,
  re: RegExp,
  category: ElementCategory,
  prefix: string,
  items: ExtractedBreakdownItem[],
  seen: Set<string>,
) {
  for (const match of text.matchAll(re)) {
    const raw = (match[1] ?? match[0] ?? "").trim();
    if (!raw) continue;
    addItem(items, seen, {
      label: titleCase(raw),
      category,
      item_slot: `${prefix}:${raw.toLowerCase().replace(/\s+/g, "-")}`,
    });
  }
}

function extractAllCapsProps(
  body: string,
  characterNames: Set<string>,
  items: ExtractedBreakdownItem[],
  seen: Set<string>,
) {
  for (const match of body.matchAll(/\b([A-Z][A-Z0-9 '-]{2,28})\b/g)) {
    const raw = match[1]?.trim() ?? "";
    if (!raw || SKIP_CAPS.has(raw) || characterNames.has(raw)) continue;
    if (/^\d+[A-Z]?$/.test(raw)) continue;
    addItem(items, seen, {
      label: titleCase(raw),
      category: "Prop",
      item_slot: `auto:caps:${raw.toLowerCase()}`,
    });
  }
}

/** Minimum keyword extraction for script import → production_breakdown_items. */
export function extractBreakdownItemsFromScene(scene: SceneInput): ExtractedBreakdownItem[] {
  const items: ExtractedBreakdownItem[] = [];
  const seen = new Set<string>();
  const body = `${scene.scene_heading}\n${scene.raw_text}`;
  const characters = Array.isArray(scene.breakdown_draft.characters)
    ? (scene.breakdown_draft.characters as string[])
    : [];
  const characterNames = new Set(characters.map((c) => c.trim().toUpperCase()).filter(Boolean));

  if (scene.location_name?.trim()) {
    addItem(items, seen, {
      label: `${titleCase(scene.location_name.trim())} set`,
      category: "Set",
      item_slot: "auto:set:location",
    });
  }

  extractFromRegex(body, VEHICLE_TERMS, "Vehicle", "auto:vehicle", items, seen);
  extractFromRegex(body, GREENS_TERMS, "Greens", "auto:greens", items, seen);
  extractFromRegex(body, CONSTRUCTION_TERMS, "Set", "auto:construction", items, seen);
  extractFromRegex(body, SET_DRESS_TERMS, "Set", "auto:setdress", items, seen);
  extractFromRegex(body, PROP_TERMS, "Prop", "auto:prop", items, seen);
  extractAllCapsProps(scene.raw_text, characterNames, items, seen);

  return items;
}
