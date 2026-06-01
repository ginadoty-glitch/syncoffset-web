/**
 * SyncOffset ShootDay — conflict detection contracts (no evaluation engine)
 *
 * Article IX: intelligence evaluates records; conflicts are derived findings, not sources.
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { CoreObjectKind } from "../kinds";

export type ShootDayConflictSeverity = "info" | "warning" | "critical";

export type ShootDayConflictCategory = "location" | "cast" | "crew" | "company-move" | "vendor" | "transport";

export type ShootDayConflict = {
  readonly id: ObjectId;
  readonly productionId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly category: ShootDayConflictCategory;
  readonly severity: ShootDayConflictSeverity;
  readonly summary: string;
  readonly detail?: string;
  readonly affectedRecordIds: ReadonlyArray<ObjectId>;
  readonly affectedRecordKinds?: ReadonlyArray<CoreObjectKind>;
  readonly detectedAt: Timestamp;
  /**
   * Constitutional: conflicts are evaluations, not authoritative records.
   */
  readonly isSourceOfTruth: false;
};

export type EvaluateShootDayConflictsInput = {
  readonly productionId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly categories?: ReadonlyArray<ShootDayConflictCategory>;
};

export type EvaluateShootDayConflictsResult = {
  readonly shootDayId: ObjectId;
  readonly evaluatedAt: Timestamp;
  readonly conflicts: ReadonlyArray<ShootDayConflict>;
};

/**
 * Future conflict detection service — interfaces only.
 */
export type ShootDayConflictService = {
  evaluate(input: EvaluateShootDayConflictsInput): Promise<EvaluateShootDayConflictsResult>;
};
