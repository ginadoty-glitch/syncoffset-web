/**
 * SyncOffset Script Authority — breakdown element categories
 */

export type BreakdownCategory =
  | "cast"
  | "background"
  | "stunt"
  | "prop"
  | "set-decoration"
  | "construction"
  | "vehicle"
  | "animal"
  | "wardrobe"
  | "makeup"
  | "hair"
  | "sfx"
  | "vfx"
  | "greens"
  | "location"
  | "special-equipment"
  | "graphic"
  | "custom";

export type BreakdownCategoryDefinition = {
  readonly category: BreakdownCategory;
  readonly label: string;
};

export const BREAKDOWN_CATEGORY_REGISTRY: Record<BreakdownCategory, BreakdownCategoryDefinition> = {
  cast: { category: "cast", label: "Cast" },
  background: { category: "background", label: "Background" },
  stunt: { category: "stunt", label: "Stunt" },
  prop: { category: "prop", label: "Prop" },
  "set-decoration": { category: "set-decoration", label: "Set Decoration" },
  construction: { category: "construction", label: "Construction" },
  vehicle: { category: "vehicle", label: "Vehicle" },
  animal: { category: "animal", label: "Animal" },
  wardrobe: { category: "wardrobe", label: "Wardrobe" },
  makeup: { category: "makeup", label: "Makeup" },
  hair: { category: "hair", label: "Hair" },
  sfx: { category: "sfx", label: "SFX" },
  vfx: { category: "vfx", label: "VFX" },
  greens: { category: "greens", label: "Greens" },
  location: { category: "location", label: "Location" },
  "special-equipment": { category: "special-equipment", label: "Special Equipment" },
  graphic: { category: "graphic", label: "Graphic" },
  custom: { category: "custom", label: "Custom" },
};

export function isBreakdownCategory(value: string): value is BreakdownCategory {
  return value in BREAKDOWN_CATEGORY_REGISTRY;
}
