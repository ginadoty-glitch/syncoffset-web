/**
 * SyncOffset Crew Authority — department (organizational unit)
 *
 * Constitutional object: kind "department"
 * Owns crew requirements and crew members for a production.
 *
 * Not the same as creative `DepartmentPackage` (look/tech intent artifacts).
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ProductionDepartmentId } from "./department-registry";

export type Department = AuditableCoreObject & {
  readonly kind: "department";
  readonly departmentId: ProductionDepartmentId;
  readonly displayName: string;
  readonly customLabel?: string;
  readonly headOfDepartmentId?: ObjectId;
  readonly crewMemberIds: ReadonlyArray<ObjectId>;
  readonly crewRequirementIds: ReadonlyArray<ObjectId>;
  readonly departmentPackageIds: ReadonlyArray<ObjectId>;
};
