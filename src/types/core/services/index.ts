/**
 * @deprecated Shoot Day **core object** shape moved to `src/types/core/shootday/`.
 * Service interfaces below remain for future implementation reference only.
 * See docs/SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md
 */

export type { LegacyShootDay, ShootDayScheduleState } from "./shoot-day-record";
export type {
  EvaluateShootDayConflictsInput,
  EvaluateShootDayConflictsResult,
  ShootDayConflict,
  ShootDayConflictCategory,
  ShootDayConflictService,
  ShootDayConflictSeverity,
} from "./shootday-conflict";
export type {
  PlanShootDayPropagationInput,
  ShootDayInboundPropagationSpec,
  ShootDayOutboundPropagationSpec,
  ShootDayPropagationPlan,
  ShootDayPropagationService,
  ShootDayPropagationTarget,
  ShootDayPropagationTrigger,
} from "./shootday-propagation";
export { SHOOTDAY_PROPAGATION_SPECS } from "./shootday-propagation";
export type {
  GetShootDayByIdQuery,
  GetShootDayByIdResult,
  ShootDayQuery,
  ShootDayQueryBase,
  ShootDayQueryResult,
  ShootDayQueryService,
  ShootDaysByCastQuery,
  ShootDaysByCompanyMoveQuery,
  ShootDaysByCrewQuery,
  ShootDaysByDateQuery,
  ShootDaysByLocationAuthorityQuery,
  ShootDaysBySceneQuery,
} from "./shootday-query";
export type {
  ReviseShootDayChanges,
  ReviseShootDayInput,
  ReviseShootDayResult,
  ShootDayRevisionHistoryQuery,
  ShootDayRevisionHistoryResult,
  ShootDayRevisionRecord,
  ShootDayRevisionService,
  SupersedeShootDayInput,
  SupersedeShootDayResult,
} from "./shootday-revision";
export type {
  ArchiveShootDayInput,
  ArchiveShootDayResult,
  CreateShootDayInput,
  CreateShootDayResult,
  GetShootDayInput,
  GetShootDayRelationshipsInput,
  GetShootDayRelationshipsResult,
  GetShootDayResult,
  ShootDayAuthorityService,
} from "./shootday-service";
