import { ProductionCalendarEmpty } from "@/components/production-calendar/production-calendar-empty";
import { ProductionCalendarLegend } from "@/components/production-calendar/production-calendar-legend";
import { ProductionCalendarToolbar } from "@/components/production-calendar/production-calendar-toolbar";
import { ProductionStripMonth } from "@/components/production-calendar/production-strip-month";
import { adjacentMonth, parseCalendarMonthParam } from "@/lib/production-calendar/calendar-utils";
import { loadProductionCalendarMonth } from "@/lib/production-calendar/load-production-calendar-month";

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
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6 md:py-8" data-content-padding="false">
      <ProductionCalendarToolbar data={data} prev={prev} next={next} />

      {data.loadError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive text-sm">
          {data.loadError}
        </div>
      ) : null}

      <ProductionCalendarLegend />

      {!data.loadError && !hasAnyProductionDay ? (
        <ProductionCalendarEmpty
          message="Month grid is ready — seed calendar days to fill cells (DAY #, location, scenes, obligations). No demo rows."
          showMigrationHint={data.tablesAvailable}
        />
      ) : null}

      {!data.loadError ? <ProductionStripMonth data={data} /> : null}

      {!data.loadError && hasAnyProductionDay ? (
        <p className="text-[10px] text-muted-foreground">
          Forecast layers: scenes (constitutional), obligations, work orders by due date, transport activity. Read-only
          wall view — not Google Calendar.
        </p>
      ) : null}
    </div>
  );
}
