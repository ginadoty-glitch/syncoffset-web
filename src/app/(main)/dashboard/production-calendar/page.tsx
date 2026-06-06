import { ProductionCalendarLegend } from "@/components/production-calendar/production-calendar-legend";
import { ProductionCalendarToolbar } from "@/components/production-calendar/production-calendar-toolbar";
import { ProductionStripMonth } from "@/components/production-calendar/production-strip-month";
import { adjacentMonth, parseCalendarMonthParam } from "@/lib/production-calendar/calendar-utils";
import { loadProductionCalendarMonth } from "@/lib/production-calendar/load-production-calendar-month";
import { buildDefaultMockWallCalendarMonth } from "@/lib/production-calendar/mock-wall-calendar-data";

import "@/styles/production-wall-calendar.css";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ month?: string }>;
};

export default async function ProductionCalendarPage({ searchParams }: PageProps) {
  const { month: monthParam } = await searchParams;
  const { year, month } = parseCalendarMonthParam(monthParam);
  const data = await loadProductionCalendarMonth(year, month);
  const prev = adjacentMonth(year, month, -1);
  const next = adjacentMonth(year, month, 1);

  const hasAnyProductionDay = data.cells.some((c) => c.inMonth && c.day !== null);

  const useMock = !hasAnyProductionDay;
  const displayData = useMock ? buildDefaultMockWallCalendarMonth() : data;

  return (
    <div className="flex flex-col gap-4 px-2 py-4 md:px-4 md:py-6" data-content-padding="false">
      <ProductionCalendarToolbar data={data} prev={prev} next={next} />

      {data.loadError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive text-sm">
          {data.loadError}
        </div>
      ) : null}

      {useMock ? (
        <div className="rounded border border-border bg-muted/20 px-3 py-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          Preview — August 2024 Block 03 mock data · No published schedule days for this production
        </div>
      ) : null}

      <ProductionCalendarLegend />

      <ProductionStripMonth data={displayData} variant="screen" />
    </div>
  );
}
