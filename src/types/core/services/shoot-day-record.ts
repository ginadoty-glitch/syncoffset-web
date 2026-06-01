/**
 * SyncOffset ShootDay — calendar authority record (Article VII)
 *
 * ShootDay is the only constitutional calendar authority object.
 * All schedule-based outputs are consumers of ShootDay; never the reverse.
 */

import type { ObjectId, RefCode } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ShootDayRevisionRecord } from "./shootday-revision";

/** Lifecycle of a shoot day on the production calendar. */
export type ShootDayScheduleState = "planned" | "confirmed" | "in-production" | "wrapped" | "cancelled";

/**
 * Canonical ShootDay core object.
 * Mutations flow only through ShootDayAuthorityService (future implementation).
 */
export type ShootDay = AuditableCoreObject & {
  readonly kind: "shoot-day";
  readonly ref?: RefCode;
  readonly dayLabel: string;
  readonly calendarDate: string;
  readonly callTime?: string;
  readonly unitId?: ObjectId;
  readonly scheduleState: ShootDayScheduleState;
  /** Head revision metadata — full history via revision service */
  readonly currentRevision: ShootDayRevisionRecord;
};
