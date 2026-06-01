/**
 * SyncOffset Cast Authority — cast assignment (performer ↔ character ↔ schedule)
 *
 * Bridge between cast member, character, scene, and shoot day.
 * Constitutional object: kind "cast-assignment"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CastAssignmentStatus } from "./cast-contract-status";

export type CastAssignment = AuditableCoreObject & {
  readonly kind: "cast-assignment";
  readonly status: CastAssignmentStatus;
  readonly characterId: ObjectId;
  readonly castMemberId: ObjectId;
  readonly sceneId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly castRequirementId?: ObjectId;
};
