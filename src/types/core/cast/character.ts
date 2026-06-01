/**
 * SyncOffset Cast Authority — character (scripted role)
 *
 * A character is not a performer.
 * Constitutional object: kind "character"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CharacterStatus } from "./character-status";

export type Character = AuditableCoreObject & {
  readonly kind: "character";
  readonly status: CharacterStatus;
  readonly characterName: string;
  readonly scriptRevisionId: ObjectId;
  readonly sceneIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
