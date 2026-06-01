/**
 * SyncOffset Crew Authority — crew assignment (member ↔ requirement ↔ shoot day)
 *
 * Bridge object — constitutional kind "crew-assignment"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CrewAssignmentStatus } from "./crew-status";

export type CrewAssignment = AuditableCoreObject & {
  readonly kind: "crew-assignment";
  readonly assignmentStatus: CrewAssignmentStatus;
  readonly crewMemberId: ObjectId;
  readonly crewRequirementId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly callTime?: string;
  readonly wrapTime?: string;
  readonly sceneId?: ObjectId;
};
