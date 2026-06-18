import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";
import type { ShootDayMarker } from "@/types/schedule";

/** Postgres row → constitutional CalendarDay + strip-calendar display fields. */
export type CalendarDayRow = {
  id: string;
  calendar_date: string;
  day_number: number | null;
  day_type: CalendarDayType;
  shoot_location: string;
  unit_label: string;
  zone_color: string;
  notes: string;
  markers?: ShootDayMarker[];
  total_pages?: string | null;
  split_day?: boolean;
  company_move?: boolean;
  /** PM / post–company-move location from SYNCO_SHADOW_JSON v2. */
  company_move_destination?: string | null;
  /** Derived presentation field: prior shoot day's location when this day is a location arrival. */
  move_from_label?: string;
};

export type CalendarDaySceneRow = {
  scene_number: string;
  interior_exterior: string;
  description: string;
  set_name: string | null;
  location_label: string;
  day_night?: string;
  /** Lighting continuity reference: D2, D3, N1, N4 */
  d_number?: string;
};

export type CalendarDayObligationRow = {
  obligation_type: string;
  label: string;
  time_label: string | null;
};

export type CalendarDayDepartmentFlag = {
  department: string;
  label: string;
};

export type ProductionCalendarDayCell = {
  date: string;
  inMonth: boolean;
  day: CalendarDayRow | null;
  scenes: CalendarDaySceneRow[];
  obligations: CalendarDayObligationRow[];
  departmentFlags: CalendarDayDepartmentFlag[];
  workOrderCount: number;
  transportCount: number;
};

export type ScheduleDateRange = {
  firstDate: string;
  lastDate: string;
  firstMonth: { year: number; month: number };
  totalDays: number;
};

export type ProductionCalendarMonthData = {
  year: number;
  month: number;
  monthLabel: string;
  calendarName: string | null;
  cells: ProductionCalendarDayCell[];
  persistenceAvailable: boolean;
  tablesAvailable: boolean;
  loadError: string | null;
  scheduleRange: ScheduleDateRange | null;
};
