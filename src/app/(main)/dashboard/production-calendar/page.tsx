import { redirect } from "next/navigation";

import { ProductionCalendarLegend } from "@/components/production-calendar/production-calendar-legend";
import { ProductionCalendarToolbar } from "@/components/production-calendar/production-calendar-toolbar";
import { ProductionStripMonth } from "@/components/production-calendar/production-strip-month";
import { getActiveShow } from "@/lib/production/get-active-show";
import { adjacentMonth, monthParamFromParts, parseCalendarMonthParam } from "@/lib/production-calendar/calendar-utils";
import { loadProductionCalendarMonth } from "@/lib/production-calendar/load-production-calendar-month";

import "@/styles/production-wall-calendar.css";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ month?: string }>;
};

export default async function ProductionCalendarPage({ searchParams }: PageProps) {
  const { month: monthParam } = await searchParams;

  // When no month param, load current month first to detect schedule range,
  // then redirect to the first month of the published schedule if available.
  if (!monthParam) {
    const probe = await loadProductionCalendarMonth(new Date().getFullYear(), new Date().getMonth() + 1);
    if (probe.scheduleRange) {
      const { year: fy, month: fm } = probe.scheduleRange.firstMonth;
      redirect(`/dashboard/production-calendar?month=${monthParamFromParts(fy, fm)}`);
    }
  }

  const { year, month } = parseCalendarMonthParam(monthParam);
  const [data, show] = await Promise.all([loadProductionCalendarMonth(year, month), getActiveShow()]);
  const prev = adjacentMonth(year, month, -1);
  const next = adjacentMonth(year, month, 1);

  const hasAnyProductionDay = data.cells.some((c) => c.inMonth && c.day !== null);

  return (
    <div className="flex flex-col gap-4 px-2 py-4 md:px-4 md:py-6" data-content-padding="false">
      <ProductionCalendarToolbar showName={show.name} data={data} prev={prev} next={next} />

      {data.loadError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive text-sm">
          {data.loadError}
        </div>
      ) : null}

      {!hasAnyProductionDay && !data.loadError ? (
        <div className="rounded border border-border bg-muted/20 px-3 py-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          No shoot days scheduled for {data.monthLabel}
        </div>
      ) : null}

      <ProductionCalendarLegend />

      <ProductionStripMonth data={data} variant="screen" />
    </div>
  );
}
