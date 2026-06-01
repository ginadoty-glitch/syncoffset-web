/**
 * SyncOffset ShootDay — authority query contracts (no database)
 *
 * Service-level queries for calendar authority records.
 * Graph-level traversal may also use RelationshipQuery from relationships/.
 */

import type { ObjectId } from "../../operations/shared";
import type { ShootDay } from "./shoot-day-record";

export type ShootDayQueryBase = {
  readonly productionId: ObjectId;
  readonly limit?: number;
};

export type ShootDaysByDateQuery = ShootDayQueryBase & {
  readonly type: "shoot-days-by-date";
  readonly calendarDate: string;
};

/** Authority-service query — distinct from `ShootDaysByLocationQuery` in relationships/ */
export type ShootDaysByLocationAuthorityQuery = ShootDayQueryBase & {
  readonly type: "shoot-days-by-location";
  readonly locationId: ObjectId;
};

export type ShootDaysBySceneQuery = ShootDayQueryBase & {
  readonly type: "shoot-days-by-scene";
  readonly sceneId: ObjectId;
};

export type ShootDaysByCastQuery = ShootDayQueryBase & {
  readonly type: "shoot-days-by-cast";
  readonly castMemberId: ObjectId;
};

export type ShootDaysByCrewQuery = ShootDayQueryBase & {
  readonly type: "shoot-days-by-crew";
  readonly crewMemberId: ObjectId;
};

export type ShootDaysByCompanyMoveQuery = ShootDayQueryBase & {
  readonly type: "shoot-days-by-company-move";
  readonly companyMoveId: ObjectId;
};

export type ShootDayQuery =
  | ShootDaysByDateQuery
  | ShootDaysByLocationAuthorityQuery
  | ShootDaysBySceneQuery
  | ShootDaysByCastQuery
  | ShootDaysByCrewQuery
  | ShootDaysByCompanyMoveQuery;

export type ShootDayQueryResult = {
  readonly queryType: ShootDayQuery["type"];
  readonly shootDays: ReadonlyArray<ShootDay>;
};

export type GetShootDayByIdQuery = {
  readonly productionId: ObjectId;
  readonly shootDayId: ObjectId;
};

export type GetShootDayByIdResult = {
  readonly shootDay: ShootDay | null;
};

/**
 * Future read service for ShootDay authority queries — interfaces only.
 */
export type ShootDayQueryService = {
  execute(query: ShootDayQuery): Promise<ShootDayQueryResult>;
  getById(query: GetShootDayByIdQuery): Promise<GetShootDayByIdResult>;
};
