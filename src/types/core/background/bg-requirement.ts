/**
 * SyncOffset Background — BG Requirement (production need)
 *
 * A BG Requirement is not a person. It is a need generated from script breakdown.
 * Constitutional object: kind "bg-requirement"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { BgCategoryId } from "./bg-category";
import type { BgRequirementStatus } from "./bg-status";

export type BgWardrobeRequirement = {
  readonly label: string;
  readonly notes?: string;
};

export type BgMakeupRequirement = {
  readonly label: string;
  readonly notes?: string;
};

/**
 * Production need for background performers on a scene.
 * Originates from breakdown; fulfilled via BgAssignment records.
 */
export type BgRequirement = AuditableCoreObject & {
  readonly kind: "bg-requirement";
  readonly status: BgRequirementStatus;
  readonly sceneId: ObjectId;
  readonly scriptRevisionId: ObjectId;
  readonly breakdownElementId: ObjectId;
  readonly category: BgCategoryId;
  /** Display label e.g. "Business Pedestrians", "Casino Patrons" */
  readonly requirementLabel: string;
  readonly customCategoryLabel?: string;
  readonly quantityRequired: number;
  readonly quantityBooked: number;
  readonly quantityConfirmed: number;
  readonly wardrobeRequirements: ReadonlyArray<BgWardrobeRequirement>;
  readonly makeupRequirements: ReadonlyArray<BgMakeupRequirement>;
  readonly specialSkills: ReadonlyArray<string>;
  readonly stuntFlag: boolean;
  readonly notes?: string;
};
