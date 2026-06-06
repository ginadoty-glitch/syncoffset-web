import { ProductionCalendarEmpty } from "@/components/production-calendar/production-calendar-empty";
import { ProductionCalendarLegend } from "@/components/production-calendar/production-calendar-legend";
import { ProductionCalendarToolbar } from "@/components/production-calendar/production-calendar-toolbar";
import { ProductionStripMonth } from "@/components/production-calendar/production-strip-month";
import { adjacentMonth, parseCalendarMonthParam } from "@/lib/production-calendar/calendar-utils";
import { loadProductionCalendarMonth } from "@/lib/production-calendar/load-production-calendar-month";

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

  return (
    <div className="flex flex-col gap-4 px-2 py-4 md:px-4 md:py-6" data-content-padding="false">
      <ProductionCalendarToolbar data={data} prev={prev} next={next} />

      {data.loadError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive text-sm">
          {data.loadError}
        </div>
      ) : null}

      <ProductionCalendarLegend />

      {!data.loadError && !hasAnyProductionDay ? (
        <ProductionCalendarEmpty
          message="Month grid is ready — publish schedule days to fill wall cells with DAY #, location, scenes, units, and notes."
          showMigrationHint={data.tablesAvailable}
        />
      ) : null}

      <ProductionStripMonth data={data} variant="screen" />
    </div>
  );
}
