"use client";

import Link from "next/link";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProductionCalendarMonthData } from "@/lib/production-calendar/calendar-types";
import { monthParamFromParts } from "@/lib/production-calendar/calendar-utils";

type Props = {
  data: ProductionCalendarMonthData;
  prev: { year: number; month: number };
  next: { year: number; month: number };
};

export function ProductionCalendarToolbar({ data, prev, next }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-semibold text-xl uppercase tracking-wide">Production calendar</h1>
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
      </div>
    </div>
  );
}
