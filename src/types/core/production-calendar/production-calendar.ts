/**
 * SyncOffset Production Calendar Authority — master production calendar
 *
 * Approved production timeline for a show — planning dates, not execution.
 * Constitutional object: kind "production-calendar"
 *
 * @see docs/SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CalendarRevisionColor } from "./calendar-revision-colors";
import type { ProductionCalendarStatus } from "./calendar-status";

export type ProductionCalendar = AuditableCoreObject & {
  readonly kind: "production-calendar";
  readonly status: ProductionCalendarStatus;
  readonly showId: ObjectId;
  readonly calendarName: string;
  readonly revisionNumber: number;
  readonly revisionColor: CalendarRevisionColor;
  readonly startDate: string;
  readonly endDate: string;
  readonly notes: string;
  readonly shootingScheduleId?: ObjectId;
  readonly calendarDayIds: ReadonlyArray<ObjectId>;
  readonly calendarRevisionIds: ReadonlyArray<ObjectId>;
  readonly calendarPackageIds: ReadonlyArray<ObjectId>;
};
