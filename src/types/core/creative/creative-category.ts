/**
 * SyncOffset Creative Authority — category and format registries
 */

/** Director note classification. */
export type DirectorNoteType =
  | "general"
  | "scene-specific"
  | "character"
  | "visual-tone"
  | "blocking"
  | "performance"
  | "safety"
  | "revision";

/** Creative reference media / artifact type. */
export type CreativeReferenceType = "image" | "video" | "pdf" | "document" | "sketch" | "storyboard" | "concept-art";

/**
 * Department package specializations (production intent by department).
 * `location-department` avoids collision with source `location-package` ingestion kind.
 */
export type DepartmentPackageKind =
  | "production-design"
  | "art"
  | "set-decoration"
  | "props"
  | "construction"
  | "graphics"
  | "costume"
  | "hair"
  | "makeup"
  | "sfx"
  | "vfx"
  | "location-department"
  | "camera"
  | "stunt";

export type DepartmentPackageKindDefinition = {
  readonly kind: DepartmentPackageKind;
  readonly label: string;
  readonly departmentName: string;
};

export const DEPARTMENT_PACKAGE_KIND_REGISTRY: Record<DepartmentPackageKind, DepartmentPackageKindDefinition> = {
  "production-design": {
    kind: "production-design",
    label: "Production Design Package",
    departmentName: "Production Design",
  },
  art: { kind: "art", label: "Art Department Package", departmentName: "Art" },
  "set-decoration": {
    kind: "set-decoration",
    label: "Set Decoration Package",
    departmentName: "Set Decoration",
  },
  props: { kind: "props", label: "Prop Package", departmentName: "Props" },
  construction: {
    kind: "construction",
    label: "Construction Package",
    departmentName: "Construction",
  },
  graphics: { kind: "graphics", label: "Graphics Package", departmentName: "Graphics" },
  costume: { kind: "costume", label: "Costume Package", departmentName: "Costume" },
  hair: { kind: "hair", label: "Hair Package", departmentName: "Hair" },
  makeup: { kind: "makeup", label: "Makeup Package", departmentName: "Makeup" },
  sfx: { kind: "sfx", label: "SFX Package", departmentName: "SFX" },
  vfx: { kind: "vfx", label: "VFX Package", departmentName: "VFX" },
  "location-department": {
    kind: "location-department",
    label: "Location Package",
    departmentName: "Locations",
  },
  camera: { kind: "camera", label: "Camera Package", departmentName: "Camera" },
  stunt: { kind: "stunt", label: "Stunt Package", departmentName: "Stunts" },
};

/** Supported tech pack file formats (immutable source files may use these MIME families). */
export type TechPackFormat =
  | "pdf"
  | "docx"
  | "xlsx"
  | "pptx"
  | "jpg"
  | "png"
  | "psd"
  | "ai"
  | "dwg"
  | "skp"
  | "mov"
  | "mp4";

export const TECH_PACK_FORMAT_REGISTRY: ReadonlyArray<{
  readonly format: TechPackFormat;
  readonly label: string;
}> = [
  { format: "pdf", label: "PDF" },
  { format: "docx", label: "Word" },
  { format: "xlsx", label: "Excel" },
  { format: "pptx", label: "PowerPoint" },
  { format: "jpg", label: "JPEG" },
  { format: "png", label: "PNG" },
  { format: "psd", label: "Photoshop" },
  { format: "ai", label: "Illustrator" },
  { format: "dwg", label: "AutoCAD" },
  { format: "skp", label: "SketchUp" },
  { format: "mov", label: "QuickTime" },
  { format: "mp4", label: "MP4" },
];
