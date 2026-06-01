/**
 * SyncOffset Creative Authority — director note (creative instruction)
 *
 * Constitutional object: kind "director-note"
 * Originates from script revision context; informs department packages.
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ApprovalStatus } from "./approval-record";
import type { DirectorNoteType } from "./creative-category";

export type DirectorNote = AuditableCoreObject & {
  readonly kind: "director-note";
  readonly title: string;
  readonly author: string;
  readonly noteType: DirectorNoteType;
  readonly revisionId: ObjectId;
  readonly sceneIds: ReadonlyArray<ObjectId>;
  readonly locationIds: ReadonlyArray<ObjectId>;
  readonly mediaAssetIds: ReadonlyArray<ObjectId>;
  readonly departmentIds: ReadonlyArray<ObjectId>;
  /** Summary approval state — detail in ApprovalRecord refs */
  readonly approvalStatus: ApprovalStatus;
  readonly approvalRecordIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
