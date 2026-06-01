/**
 * SyncOffset Background — Background Performer (individual)
 *
 * Represents a person — not a production need.
 * No payroll, contracts, or deal memo fields in this layer.
 *
 * Constitutional object: kind "background-performer"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { BackgroundPerformerAvailabilityStatus } from "./bg-status";

export type BackgroundPerformerContact = {
  readonly phone?: string;
  readonly email?: string;
  readonly emergencyContactName?: string;
  readonly emergencyContactPhone?: string;
};

export type BackgroundPerformerWardrobeSizes = {
  readonly shirt?: string;
  readonly pants?: string;
  readonly dress?: string;
  readonly shoe?: string;
  readonly hat?: string;
  readonly notes?: string;
};

export type BackgroundPerformerUnionStatus = "union" | "non-union" | "mixed" | "unknown";

/**
 * Individual background performer.
 *
 * Future graph relationships: ShootDay, Scene, BgAssignment, GeneratedOutput
 * (via PlatformRelationship — no embedded payroll).
 */
export type BackgroundPerformer = AuditableCoreObject & {
  readonly kind: "background-performer";
  readonly performerId: ObjectId;
  readonly firstName: string;
  readonly lastName: string;
  readonly agency?: string;
  readonly unionStatus: BackgroundPerformerUnionStatus;
  readonly availabilityStatus: BackgroundPerformerAvailabilityStatus;
  readonly contactInformation: BackgroundPerformerContact;
  readonly wardrobeSizes: BackgroundPerformerWardrobeSizes;
  readonly specialSkills: ReadonlyArray<string>;
  readonly notes?: string;
};
