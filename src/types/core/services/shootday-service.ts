/**
 * SyncOffset ShootDay Authority Service — interface contracts only
 *
 * Article VII: ShootDay is the calendar authority object.
 * All schedule-based outputs derive from ShootDay; ShootDay does not derive from outputs.
 *
 * No implementation, persistence, or UI in this module.
 */

import type { ObjectId } from "../../operations/shared";
import type { PlatformRelationship } from "../relationships/relationship-edge";
import type { RecordProvenance } from "../source/provenance";
import type { ShootDay, ShootDayScheduleState } from "./shoot-day-record";
import type {
  ReviseShootDayInput,
  ReviseShootDayResult,
  SupersedeShootDayInput,
  SupersedeShootDayResult,
} from "./shootday-revision";

// ─── Command inputs / results ───────────────────────────────────────────────────

export type CreateShootDayInput = {
  readonly productionId: ObjectId;
  readonly dayLabel: string;
  readonly calendarDate: string;
  readonly callTime?: string;
  readonly unitId?: ObjectId;
  readonly scheduleState?: ShootDayScheduleState;
  readonly createdBy: string;
  readonly provenance: RecordProvenance;
};

export type CreateShootDayResult = {
  readonly shootDay: ShootDay;
};

export type ArchiveShootDayInput = {
  readonly productionId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly archivedBy: string;
  readonly reason?: string;
};

export type ArchiveShootDayResult = {
  readonly shootDay: ShootDay;
};

export type GetShootDayInput = {
  readonly productionId: ObjectId;
  readonly shootDayId: ObjectId;
};

export type GetShootDayResult = {
  readonly shootDay: ShootDay | null;
};

export type GetShootDayRelationshipsInput = {
  readonly productionId: ObjectId;
  readonly shootDayId: ObjectId;
};

export type GetShootDayRelationshipsResult = {
  readonly shootDayId: ObjectId;
  readonly relationships: ReadonlyArray<PlatformRelationship>;
};

// ─── Authority service (constitutional mutation + read API) ─────────────────────

/**
 * Sole service contract for creating and mutating ShootDay authority records.
 * Implementations must enforce: no output may revise a ShootDay without provenance.
 */
export type ShootDayAuthorityService = {
  createShootDay(input: CreateShootDayInput): Promise<CreateShootDayResult>;

  reviseShootDay(input: ReviseShootDayInput): Promise<ReviseShootDayResult>;

  supersedeShootDay(input: SupersedeShootDayInput): Promise<SupersedeShootDayResult>;

  archiveShootDay(input: ArchiveShootDayInput): Promise<ArchiveShootDayResult>;

  getShootDay(input: GetShootDayInput): Promise<GetShootDayResult>;

  getShootDayRelationships(input: GetShootDayRelationshipsInput): Promise<GetShootDayRelationshipsResult>;
};
