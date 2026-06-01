/**
 * SyncOffset Crew Authority — production department registry
 *
 * Real production department names only — no generic workforce taxonomy.
 * Distinct from creative `DepartmentPackage` (look books, tech packs, scout packages).
 */

export type ProductionDepartmentId =
  | "production"
  | "directing"
  | "casting"
  | "background-casting"
  | "art"
  | "set-decoration"
  | "props"
  | "construction"
  | "graphics"
  | "greens"
  | "locations"
  | "transportation"
  | "camera"
  | "grip"
  | "electric"
  | "costume"
  | "hair"
  | "makeup"
  | "spfx"
  | "vfx"
  | "sound"
  | "editorial"
  | "post"
  | "accounting"
  | "office"
  | "catering"
  | "craft-service"
  | "custom";

export type ProductionDepartmentDefinition = {
  readonly id: ProductionDepartmentId;
  readonly label: string;
  readonly shortLabel: string;
  readonly allowsCustomLabel: boolean;
};

export const PRODUCTION_DEPARTMENT_REGISTRY: Record<ProductionDepartmentId, ProductionDepartmentDefinition> = {
  production: { id: "production", label: "Production", shortLabel: "PROD", allowsCustomLabel: false },
  directing: { id: "directing", label: "Directing", shortLabel: "DIR", allowsCustomLabel: false },
  casting: { id: "casting", label: "Casting", shortLabel: "CAST", allowsCustomLabel: false },
  "background-casting": {
    id: "background-casting",
    label: "Background Casting",
    shortLabel: "BG CAST",
    allowsCustomLabel: false,
  },
  art: { id: "art", label: "Art Department", shortLabel: "ART", allowsCustomLabel: false },
  "set-decoration": {
    id: "set-decoration",
    label: "Set Decoration",
    shortLabel: "SET DEC",
    allowsCustomLabel: false,
  },
  props: { id: "props", label: "Props", shortLabel: "PROPS", allowsCustomLabel: false },
  construction: {
    id: "construction",
    label: "Construction",
    shortLabel: "CONST",
    allowsCustomLabel: false,
  },
  graphics: { id: "graphics", label: "Graphics", shortLabel: "GFX", allowsCustomLabel: false },
  greens: { id: "greens", label: "Greens", shortLabel: "GRN", allowsCustomLabel: false },
  locations: { id: "locations", label: "Locations", shortLabel: "LOC", allowsCustomLabel: false },
  transportation: {
    id: "transportation",
    label: "Transportation",
    shortLabel: "TRANS",
    allowsCustomLabel: false,
  },
  camera: { id: "camera", label: "Camera", shortLabel: "CAM", allowsCustomLabel: false },
  grip: { id: "grip", label: "Grip", shortLabel: "GRIP", allowsCustomLabel: false },
  electric: { id: "electric", label: "Electric", shortLabel: "ELEC", allowsCustomLabel: false },
  costume: { id: "costume", label: "Costume", shortLabel: "COST", allowsCustomLabel: false },
  hair: { id: "hair", label: "Hair", shortLabel: "HAIR", allowsCustomLabel: false },
  makeup: { id: "makeup", label: "Makeup", shortLabel: "MU", allowsCustomLabel: false },
  spfx: { id: "spfx", label: "Special Effects", shortLabel: "SPFX", allowsCustomLabel: false },
  vfx: { id: "vfx", label: "Visual Effects", shortLabel: "VFX", allowsCustomLabel: false },
  sound: { id: "sound", label: "Sound", shortLabel: "SND", allowsCustomLabel: false },
  editorial: { id: "editorial", label: "Editorial", shortLabel: "EDIT", allowsCustomLabel: false },
  post: { id: "post", label: "Post Production", shortLabel: "POST", allowsCustomLabel: false },
  accounting: { id: "accounting", label: "Accounting", shortLabel: "ACCT", allowsCustomLabel: false },
  office: { id: "office", label: "Production Office", shortLabel: "PO", allowsCustomLabel: false },
  catering: { id: "catering", label: "Catering", shortLabel: "CAT", allowsCustomLabel: false },
  "craft-service": {
    id: "craft-service",
    label: "Craft Service",
    shortLabel: "CRAFT",
    allowsCustomLabel: false,
  },
  custom: { id: "custom", label: "Custom Department", shortLabel: "CUSTOM", allowsCustomLabel: true },
};

export function isProductionDepartmentId(value: string): value is ProductionDepartmentId {
  return value in PRODUCTION_DEPARTMENT_REGISTRY;
}
