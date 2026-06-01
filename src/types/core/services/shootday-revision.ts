/**
 * SyncOffset ShootDay — revision contracts (no persistence)
 *
 * Revisions create new ShootDay lineage nodes; sources remain immutable.
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { ShootDayScheduleState } from "./shoot-day-record";

/**
 * Revision metadata required on every ShootDay revision event.
 */
export type ShootDayRevisionRecord = {
  readonly revisionNumber: number;
  readonly supersededById?: ObjectId;
  readonly supersedesId?: ObjectId;
  readonly revisionReason: string;
  readonly revisionSourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly createdBy: string;
  readonly createdAt: Timestamp;
};

/** Input to record a new revision against an existing shoot day. */
export type ReviseShootDayInput = {
  readonly productionId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly revisionReason: string;
  readonly revisionSourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly revisedBy: string;
  readonly changes?: ReviseShootDayChanges;
};

export type ReviseShootDayChanges = {
  readonly calendarDate?: string;
  readonly callTime?: string;
  readonly unitId?: ObjectId;
  readonly scheduleState?: ShootDayScheduleState;
};

export type ReviseShootDayResult = {
  readonly shootDayId: ObjectId;
  readonly revision: ShootDayRevisionRecord;
  readonly supersededShootDayId?: ObjectId;
};

/** Input when a new revision fully supersedes operational view of a prior shoot day. */
export type SupersedeShootDayInput = {
  readonly productionId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly supersededByShootDayId: ObjectId;
  readonly revisionReason: string;
  readonly revisionSourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly supersededBy: string;
};

export type SupersedeShootDayResult = {
  readonly priorShootDayId: ObjectId;
  readonly activeShootDayId: ObjectId;
  readonly revision: ShootDayRevisionRecord;
};

export type ShootDayRevisionHistoryQuery = {
  readonly productionId: ObjectId;
  readonly shootDayId: ObjectId;
};

export type ShootDayRevisionHistoryResult = {
  readonly shootDayId: ObjectId;
  readonly revisions: ReadonlyArray<ShootDayRevisionRecord>;
};

/**
 * Future revision history service — no implementation in this phase.
 */
export type ShootDayRevisionService = {
  getRevisionHistory(query: ShootDayRevisionHistoryQuery): Promise<ShootDayRevisionHistoryResult>;
};
