/**
 * SyncOffset Background — BG Assignment (performer ↔ requirement ↔ shoot day)
 *
 * Bridge between production need (BgRequirement) and individual (BackgroundPerformer).
 * Constitutional object: kind "bg-assignment"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { BgAssignmentStatus } from "./bg-status";

/**
 * Fulfills a BgRequirement with a BackgroundPerformer on a ShootDay (and optional Scene).
 */
export type BgAssignment = AuditableCoreObject & {
  readonly kind: "bg-assignment";
  readonly status: BgAssignmentStatus;
  readonly performerId: ObjectId;
  readonly bgRequirementId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly sceneId: ObjectId;
  readonly callTime?: string;
  readonly wrapTime?: string;
  readonly costumeApproved: boolean;
  readonly makeupApproved: boolean;
  readonly transportationRequired: boolean;
};
