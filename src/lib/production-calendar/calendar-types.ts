import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";

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
};

export type CalendarDaySceneRow = {
  scene_number: string;
  interior_exterior: string;
  description: string;
  set_name: string | null;
  location_label: string;
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

export type ProductionCalendarMonthData = {
  year: number;
  month: number;
  monthLabel: string;
  calendarName: string | null;
  cells: ProductionCalendarDayCell[];
  persistenceAvailable: boolean;
  tablesAvailable: boolean;
  loadError: string | null;
};
