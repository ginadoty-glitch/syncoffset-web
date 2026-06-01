/**
 * SyncOffset Creative Authority — department package (production intent)
 *
 * Constitutional object: kind "department-package"
 * Specializations share one base contract with discriminated packageKind.
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { DepartmentPackageKind } from "./creative-category";

export type DepartmentPackageRevision = {
  readonly revisionNumber: number;
  readonly revisionLabel?: string;
  readonly supersededByPackageId?: ObjectId;
  readonly supersedesPackageId?: ObjectId;
};

/**
 * Base department package — all specializations extend this shape.
 */
export type DepartmentPackage = AuditableCoreObject & {
  readonly kind: "department-package";
  readonly packageKind: DepartmentPackageKind;
  readonly packageName: string;
  readonly department: string;
  readonly revision: DepartmentPackageRevision;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly mediaAssetIds: ReadonlyArray<ObjectId>;
  readonly sceneIds: ReadonlyArray<ObjectId>;
  readonly locationIds: ReadonlyArray<ObjectId>;
  readonly approvalIds: ReadonlyArray<ObjectId>;
  readonly directorNoteIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};

// ─── Typed specializations (discriminated union) ───────────────────────────────

export type ProductionDesignPackage = DepartmentPackage & {
  readonly packageKind: "production-design";
};

export type ArtDepartmentPackage = DepartmentPackage & { readonly packageKind: "art" };

export type SetDecorationPackage = DepartmentPackage & { readonly packageKind: "set-decoration" };

export type PropPackage = DepartmentPackage & { readonly packageKind: "props" };

export type ConstructionPackage = DepartmentPackage & { readonly packageKind: "construction" };

export type GraphicsPackage = DepartmentPackage & { readonly packageKind: "graphics" };

export type CostumePackage = DepartmentPackage & { readonly packageKind: "costume" };

export type HairPackage = DepartmentPackage & { readonly packageKind: "hair" };

export type MakeupPackage = DepartmentPackage & { readonly packageKind: "makeup" };

export type SFXPackage = DepartmentPackage & { readonly packageKind: "sfx" };

export type VFXPackage = DepartmentPackage & { readonly packageKind: "vfx" };

export type LocationDepartmentPackage = DepartmentPackage & {
  readonly packageKind: "location-department";
};

export type CameraPackage = DepartmentPackage & { readonly packageKind: "camera" };

export type StuntPackage = DepartmentPackage & { readonly packageKind: "stunt" };

export type TypedDepartmentPackage =
  | ProductionDesignPackage
  | ArtDepartmentPackage
  | SetDecorationPackage
  | PropPackage
  | ConstructionPackage
  | GraphicsPackage
  | CostumePackage
  | HairPackage
  | MakeupPackage
  | SFXPackage
  | VFXPackage
  | LocationDepartmentPackage
  | CameraPackage
  | StuntPackage;

export type DepartmentPackageByKind = {
  readonly "production-design": ProductionDesignPackage;
  readonly art: ArtDepartmentPackage;
  readonly "set-decoration": SetDecorationPackage;
  readonly props: PropPackage;
  readonly construction: ConstructionPackage;
  readonly graphics: GraphicsPackage;
  readonly costume: CostumePackage;
  readonly hair: HairPackage;
  readonly makeup: MakeupPackage;
  readonly sfx: SFXPackage;
  readonly vfx: VFXPackage;
  readonly "location-department": LocationDepartmentPackage;
  readonly camera: CameraPackage;
  readonly stunt: StuntPackage;
};
