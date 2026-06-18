"use client";

import Link from "next/link";

import { CalendarSearch, ChevronLeft, ChevronRight, Printer, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProductionCalendarMonthData } from "@/lib/production-calendar/calendar-types";
import { monthParamFromParts } from "@/lib/production-calendar/calendar-utils";

type Props = {
  showName?: string | null;
  data: ProductionCalendarMonthData;
  prev: { year: number; month: number };
  next: { year: number; month: number };
  view?: "wall" | "desk";
};

export function ProductionCalendarToolbar({ showName, data, prev, next, view = "wall" }: Props) {
  const monthParam = monthParamFromParts(data.year, data.month);
  const range = data.scheduleRange;
  const viewQ = view === "desk" ? "&view=desk" : "";
  const monthHref = (y: number, m: number) =>
    `/dashboard/production-calendar?month=${monthParamFromParts(y, m)}${viewQ}`;

  const isOnActiveMonth = range != null && data.year === range.firstMonth.year && data.month === range.firstMonth.month;

  return (
    <div className="production-calendar-screen-only flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {showName ? <h1 className="font-extrabold text-2xl tracking-tight">{showName}</h1> : null}
          {showName ? (
            <h2 className="font-semibold text-lg uppercase tracking-wide">Production Calendar</h2>
          ) : (
            <h1 className="font-semibold text-xl uppercase tracking-wide">Production Calendar</h1>
          )}
          {data.calendarName ? <p className="text-muted-foreground text-sm">{data.calendarName}</p> : null}
          <p className="text-muted-foreground text-xs">
            {data.monthLabel}
            {range ? ` · ${range.totalDays} shoot days scheduled` : ""}
            {view === "wall" ? " · Wall calendar view" : " · Desk view"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={monthHref(prev.year, prev.month)}>
              <ChevronLeft className="size-4" />
              <span className="sr-only">Previous Month</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={monthHref(next.year, next.month)}>
              <ChevronRight className="size-4" />
              <span className="sr-only">Next Month</span>
            </Link>
          </Button>

          {range && !isOnActiveMonth ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/dashboard/production-calendar?month=${monthParamFromParts(range.firstMonth.year, range.firstMonth.month)}${viewQ}`}
              >
                <CalendarSearch className="mr-1.5 size-4" />
                Jump to Active Schedule
              </Link>
            </Button>
          ) : null}

          {view === "wall" ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/production-calendar?month=${monthParam}&view=desk`}>Desk View</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/production-calendar?month=${monthParam}`}>Wall Calendar</Link>
            </Button>
          )}

          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/dashboard/production-calendar/print?month=${monthParam}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Printer className="mr-1.5 size-4" />
              Print 24×36
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/ingestion/upload?kind=shoot-schedule">
              <Upload className="mr-1.5 size-4" />
              Import Schedule
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
