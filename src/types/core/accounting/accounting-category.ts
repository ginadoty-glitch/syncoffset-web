/**
 * SyncOffset Production Accounting Authority v1.1.1 — film budget line categories (registry only)
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md
 */

/** Above/below-the-line and production-specific budget classifications. */
export type ProductionCostCategory =
  | "above-the-line"
  | "below-the-line"
  | "cast"
  | "crew"
  | "locations"
  | "art-construction"
  /** Standing set / construction spend (stress Test 02 — build-cost). */
  | "build-cost"
  /** Set dressing spend on stage (stress Test 02 — set-cost). */
  | "set-cost"
  | "set-decoration"
  | "expendable"
  | "rental"
  | "props"
  | "wardrobe"
  | "camera"
  | "lighting-grip"
  | "sound"
  | "transportation"
  | "visual-effects"
  | "post-production"
  | "insurance"
  | "contingency"
  | "fringes"
  | "general-expense"
  | "custom";

export type ProductionCostCategoryDefinition = {
  readonly categoryId: ProductionCostCategory;
  readonly label: string;
  readonly isAboveTheLine: boolean;
};

export const PRODUCTION_COST_CATEGORY_REGISTRY: Record<ProductionCostCategory, ProductionCostCategoryDefinition> = {
  "above-the-line": { categoryId: "above-the-line", label: "Above the Line", isAboveTheLine: true },
  "below-the-line": { categoryId: "below-the-line", label: "Below the Line", isAboveTheLine: false },
  cast: { categoryId: "cast", label: "Cast", isAboveTheLine: true },
  crew: { categoryId: "crew", label: "Crew", isAboveTheLine: false },
  locations: { categoryId: "locations", label: "Locations", isAboveTheLine: false },
  "art-construction": { categoryId: "art-construction", label: "Art & Construction", isAboveTheLine: false },
  "build-cost": { categoryId: "build-cost", label: "Build Cost", isAboveTheLine: false },
  "set-cost": { categoryId: "set-cost", label: "Set Cost", isAboveTheLine: false },
  "set-decoration": { categoryId: "set-decoration", label: "Set Decoration", isAboveTheLine: false },
  expendable: { categoryId: "expendable", label: "Expendable", isAboveTheLine: false },
  rental: { categoryId: "rental", label: "Rental", isAboveTheLine: false },
  props: { categoryId: "props", label: "Props", isAboveTheLine: false },
  wardrobe: { categoryId: "wardrobe", label: "Wardrobe", isAboveTheLine: false },
  camera: { categoryId: "camera", label: "Camera", isAboveTheLine: false },
  "lighting-grip": { categoryId: "lighting-grip", label: "Lighting & Grip", isAboveTheLine: false },
  sound: { categoryId: "sound", label: "Sound", isAboveTheLine: false },
  transportation: { categoryId: "transportation", label: "Transportation", isAboveTheLine: false },
  "visual-effects": { categoryId: "visual-effects", label: "Visual Effects", isAboveTheLine: false },
  "post-production": { categoryId: "post-production", label: "Post Production", isAboveTheLine: false },
  insurance: { categoryId: "insurance", label: "Insurance", isAboveTheLine: false },
  contingency: { categoryId: "contingency", label: "Contingency", isAboveTheLine: false },
  fringes: { categoryId: "fringes", label: "Fringes & Benefits", isAboveTheLine: false },
  "general-expense": { categoryId: "general-expense", label: "General Expense", isAboveTheLine: false },
  custom: { categoryId: "custom", label: "Custom", isAboveTheLine: false },
};
