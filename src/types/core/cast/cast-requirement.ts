/**
 * SyncOffset Cast Authority — cast requirement (production need)
 *
 * Requirement is not a performer and not the character definition alone —
 * it is the need to fulfill a character on production.
 * Constitutional object: kind "cast-requirement"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type CastRequirement = AuditableCoreObject & {
  readonly kind: "cast-requirement";
  readonly sceneId: ObjectId;
  readonly characterId: ObjectId;
  readonly scriptRevisionId: ObjectId;
  readonly notes?: string;
};
