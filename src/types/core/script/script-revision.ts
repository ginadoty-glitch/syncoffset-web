/**
 * SyncOffset Script Authority — script revision (constitutional root)
 *
 * Authority record derived from immutable source script files.
 * Distinct from:
 *   - source/ScriptRevisionSourceDocument (immutable file)
 *   - operations/callsheet-revision (scheduling document)
 *
 * Constitutional object: kind "script-revision"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ScriptRevisionColor, ScriptRevisionStatus } from "./script-status";

export type ScriptRevision = AuditableCoreObject & {
  readonly kind: "script-revision";
  readonly status: ScriptRevisionStatus;
  readonly title: string;
  readonly revisionColor: ScriptRevisionColor;
  readonly customColorLabel?: string;
  readonly revisionNumber: number;
  readonly revisionDate: string;
  readonly pageCount: number;
  readonly lockedPages: ReadonlyArray<number>;
  /** Immutable source file this revision was ingested from */
  readonly sourceDocumentId: ObjectId;
  readonly scriptId?: ObjectId;
  readonly previousRevisionId?: ObjectId;
  readonly supersededById?: ObjectId;
  readonly sceneIds: ReadonlyArray<ObjectId>;
  readonly changeIds: ReadonlyArray<ObjectId>;
};
