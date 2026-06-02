/**
 * SyncOffset Work Order Authority — generated documentation package only
 *
 * No workflow logic — documentation exports only (Rule 4).
 * Constitutional object: kind "work-order-package"
 *
 * @see docs/SYNCOFFSET_WORK_ORDER_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type WorkOrderPackageKind =
  | "department-work-package"
  | "construction-package"
  | "graphics-package"
  | "installation-package"
  | "strike-package";

export type WorkOrderPackageKindDefinition = {
  readonly packageKind: WorkOrderPackageKind;
  readonly label: string;
};

export const WORK_ORDER_PACKAGE_KIND_REGISTRY: Record<WorkOrderPackageKind, WorkOrderPackageKindDefinition> = {
  "department-work-package": {
    packageKind: "department-work-package",
    label: "Department Work Package",
  },
  "construction-package": { packageKind: "construction-package", label: "Construction Package" },
  "graphics-package": { packageKind: "graphics-package", label: "Graphics Package" },
  "installation-package": { packageKind: "installation-package", label: "Installation Package" },
  "strike-package": { packageKind: "strike-package", label: "Strike Package" },
};

export type WorkOrderPackage = AuditableCoreObject & {
  readonly kind: "work-order-package";
  readonly workOrderId: ObjectId;
  readonly packageKind: WorkOrderPackageKind;
  readonly generatedAt: Timestamp;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
