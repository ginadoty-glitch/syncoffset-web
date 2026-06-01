/**
 * SyncOffset Crew Authority — crew requirement (labor need)
 *
 * Generated from scenes, breakdown elements, or department packages.
 * Not a crew member — constitutional object: kind "crew-requirement"
 *
 * Examples: Leadman, Set Dresser, Buyer, Prop Assistant, Truck Driver,
 * Greensperson, Construction Coordinator, SPFX Technician, Makeup Artist, Hair Stylist
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CrewRequirementStatus } from "./crew-status";

export type CrewRequirement = AuditableCoreObject & {
  readonly kind: "crew-requirement";
  readonly status: CrewRequirementStatus;
  readonly departmentId: ObjectId;
  readonly roleLabel: string;
  readonly sceneId?: ObjectId;
  readonly breakdownElementId?: ObjectId;
  readonly departmentPackageId?: ObjectId;
  readonly quantityRequired: number;
  readonly notes?: string;
};
