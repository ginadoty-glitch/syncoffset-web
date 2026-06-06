"use client";

import Link from "next/link";

import { ChevronLeft, ChevronRight, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProductionCalendarMonthData } from "@/lib/production-calendar/calendar-types";
import { monthParamFromParts } from "@/lib/production-calendar/calendar-utils";

type Props = {
  data: ProductionCalendarMonthData;
  prev: { year: number; month: number };
  next: { year: number; month: number };
};

export function ProductionCalendarToolbar({ data, prev, next }: Props) {
  const monthParam = `${data.year}-${String(data.month).padStart(2, "0")}`;

  return (
    <div className="production-calendar-screen-only flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-semibold text-xl uppercase tracking-wide">Production Calendar</h1>
        <p className="text-muted-foreground text-sm">
          {data.calendarName ?? "Master calendar"} · {data.monthLabel}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/production-calendar?month=${monthParamFromParts(prev.year, prev.month)}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/production-calendar">Today</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/production-calendar?month=${monthParamFromParts(next.year, next.month)}`}>
            <ChevronRight className="size-4" />
          </Link>
        </Button>
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
      </div>
    </div>
  );
}
