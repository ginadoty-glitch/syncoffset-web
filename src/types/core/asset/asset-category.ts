/**
 * SyncOffset Asset Authority — category registry (no behavior)
 */

export type AssetCategoryId =
  | "props"
  | "set-decoration"
  | "construction"
  | "graphics"
  | "greens"
  | "picture-vehicles"
  | "special-effects"
  | "weapons"
  | "furniture"
  | "electronics"
  | "wardrobe-support"
  | "makeup-support"
  | "camera-support"
  | "lighting-support"
  | "grip-support"
  | "custom";

export type AssetCategoryDefinition = {
  readonly id: AssetCategoryId;
  readonly label: string;
};

export const ASSET_CATEGORY_REGISTRY: Record<AssetCategoryId, AssetCategoryDefinition> = {
  props: { id: "props", label: "Props" },
  "set-decoration": { id: "set-decoration", label: "Set Decoration" },
  construction: { id: "construction", label: "Construction" },
  graphics: { id: "graphics", label: "Graphics" },
  greens: { id: "greens", label: "Greens" },
  "picture-vehicles": { id: "picture-vehicles", label: "Picture Vehicles" },
  "special-effects": { id: "special-effects", label: "Special Effects" },
  weapons: { id: "weapons", label: "Weapons" },
  furniture: { id: "furniture", label: "Furniture" },
  electronics: { id: "electronics", label: "Electronics" },
  "wardrobe-support": { id: "wardrobe-support", label: "Wardrobe Support" },
  "makeup-support": { id: "makeup-support", label: "Makeup Support" },
  "camera-support": { id: "camera-support", label: "Camera Support" },
  "lighting-support": { id: "lighting-support", label: "Lighting Support" },
  "grip-support": { id: "grip-support", label: "Grip Support" },
  custom: { id: "custom", label: "Custom" },
};
