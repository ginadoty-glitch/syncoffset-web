/**
 * @deprecated Use `ShootDay` from `src/types/core/shootday/shoot-day.ts`.
 * See docs/SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md. Retained as `LegacyShootDay` for service contract migration.
 *
 * SyncOffset ShootDay — legacy calendar record shape (Article VII services)
 */

import type { ObjectId, RefCode } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ShootDayRevisionRecord } from "./shootday-revision";

/** Lifecycle of a shoot day on the production calendar. */
export type ShootDayScheduleState = "planned" | "confirmed" | "in-production" | "wrapped" | "cancelled";

/** @deprecated Import `ShootDay` from `@/types/core` (shootday authority). */
export type LegacyShootDay = AuditableCoreObject & {
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

/** @deprecated Alias for `LegacyShootDay` — do not use in new constitutional work. */
export type ShootDay = LegacyShootDay;
