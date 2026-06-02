/**
 * SyncOffset Scene Authority — set (production container)
 *
 * A Set exists to support one or more scenes. It is NOT the parent authority of production.
 * Derived from script and breakdown requirements; subordinate to Scene and Budget authority.
 *
 * Constitutional object: kind "set"
 * @see docs/SYNCOFFSET_SCENE_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type SetStatus = "planned" | "active" | "struck" | "archived";

/**
 * Production set — e.g. SET 101 Police Station, SET 205 Apartment.
 * `setNumber` is a constitutional production identifier for department tracking.
 */
export type ProductionSet = AuditableCoreObject & {
  readonly kind: "set";
  readonly status: SetStatus;
  readonly setNumber: string;
  readonly setName: string;
  readonly relatedSceneIds: ReadonlyArray<ObjectId>;
  readonly assetIds: ReadonlyArray<ObjectId>;
  readonly locationIds: ReadonlyArray<ObjectId>;
  readonly budgetLineIds: ReadonlyArray<ObjectId>;
  readonly departmentId?: ObjectId;
  readonly notes?: string;
};
