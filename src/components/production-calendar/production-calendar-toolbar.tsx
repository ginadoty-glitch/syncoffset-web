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
};

export function ProductionCalendarToolbar({ showName, data, prev, next }: Props) {
  const monthParam = monthParamFromParts(data.year, data.month);
  const range = data.scheduleRange;

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
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/production-calendar?month=${monthParamFromParts(prev.year, prev.month)}`}>
              <ChevronLeft className="size-4" />
              <span className="sr-only">Previous Month</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/production-calendar?month=${monthParamFromParts(next.year, next.month)}`}>
              <ChevronRight className="size-4" />
              <span className="sr-only">Next Month</span>
            </Link>
          </Button>

          {range && !isOnActiveMonth ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/dashboard/production-calendar?month=${monthParamFromParts(range.firstMonth.year, range.firstMonth.month)}`}
              >
                <CalendarSearch className="mr-1.5 size-4" />
                Jump to Active Schedule
              </Link>
            </Button>
          ) : null}

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
