/**
 * SyncOffset Location Authority — location requirement (production need)
 *
 * Generated from scenes, breakdown elements, or production packages.
 * Not a physical location record — constitutional kind "location-requirement"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { LocationRequirementStatus } from "./location-status";

export type LocationRequirement = AuditableCoreObject & {
  readonly kind: "location-requirement";
  readonly status: LocationRequirementStatus;
  readonly sceneId?: ObjectId;
  readonly breakdownElementId?: ObjectId;
  readonly scriptRevisionId?: ObjectId;
  readonly departmentPackageId?: ObjectId;
  readonly locationId?: ObjectId;
  readonly requirementLabel: string;
  readonly notes?: string;
};
