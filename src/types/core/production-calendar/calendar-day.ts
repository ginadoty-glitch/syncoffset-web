/**
 * SyncOffset Production Calendar Authority — calendar day (single production date)
 *
 * Planning date on the master calendar. Not necessarily a Shoot Day (Rule 3).
 * Constitutional object: kind "calendar-day"
 *
 * @see docs/SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CalendarDayType } from "./calendar-day-type";

export type CalendarDay = AuditableCoreObject & {
  readonly kind: "calendar-day";
  readonly calendarId: ObjectId;
  readonly calendarDate: string;
  readonly dayNumber: number;
  readonly dayType: CalendarDayType;
  readonly notes: string;
  /** Present when this planning day generated an execution Shoot Day (Rule 2). */
  readonly shootDayId?: ObjectId;
};
