/**
 * SyncOffset Script Authority — revision change (diff between revisions)
 *
 * Impact analysis input only — no execution logic.
 * Constitutional object: kind "revision-change"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { RevisionChangeKind } from "./revision-change-kind";

export type RevisionChange = AuditableCoreObject & {
  readonly kind: "revision-change";
  readonly changeKind: RevisionChangeKind;
  readonly sourceRevisionId: ObjectId;
  readonly targetRevisionId: ObjectId;
  readonly sceneId?: ObjectId;
  readonly affectedDepartments: ReadonlyArray<string>;
  readonly notes?: string;
};
