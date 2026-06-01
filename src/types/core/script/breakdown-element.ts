/**
 * SyncOffset Script Authority — breakdown element (script-derived requirement)
 *
 * Constitutional object: kind "breakdown-element"
 * Feeds BgRequirement, department packages, and downstream operations.
 *
 * Legacy `element` kind remains in registry for backward compatibility;
 * new work should prefer `breakdown-element`.
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { BreakdownCategory } from "./breakdown-category";

export type BreakdownElement = AuditableCoreObject & {
  readonly kind: "breakdown-element";
  readonly sceneId: ObjectId;
  readonly category: BreakdownCategory;
  readonly quantity: number;
  readonly description: string;
  readonly notes?: string;
  readonly sourceRevisionId: ObjectId;
  readonly customCategoryLabel?: string;
};
