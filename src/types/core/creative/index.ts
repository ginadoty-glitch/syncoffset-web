/**
 * SyncOffset Creative Authority Layer — barrel export
 *
 * Creative authority defines departmental interpretation of script requirements.
 * Operations execute approved interpretation — not the reverse.
 */

export type { ApprovalRecord, ApprovalStatus } from "./approval-record";
export type {
  CreativeReferenceType,
  DepartmentPackageKind,
  DepartmentPackageKindDefinition,
  DirectorNoteType,
  TechPackFormat,
} from "./creative-category";
export {
  DEPARTMENT_PACKAGE_KIND_REGISTRY,
  TECH_PACK_FORMAT_REGISTRY,
} from "./creative-category";
export type { CreativeReference } from "./creative-reference";
export {
  CREATIVE_CANONICAL_RELATIONSHIP_PATHS,
  CREATIVE_REFERENCE_RELATIONSHIP_TARGETS,
  CREATIVE_RELATIONSHIP_SCHEMA_REGISTRY,
} from "./creative-relationship-contracts";
export type {
  ArtDepartmentPackage,
  CameraPackage,
  ConstructionPackage,
  CostumePackage,
  DepartmentPackage,
  DepartmentPackageByKind,
  DepartmentPackageRevision,
  GraphicsPackage,
  HairPackage,
  LocationDepartmentPackage,
  MakeupPackage,
  ProductionDesignPackage,
  PropPackage,
  SetDecorationPackage,
  SFXPackage,
  StuntPackage,
  TypedDepartmentPackage,
  VFXPackage,
} from "./department-package";
export type { DirectorNote } from "./director-note";
export type { TechPack, TechPackRevision } from "./tech-pack";
