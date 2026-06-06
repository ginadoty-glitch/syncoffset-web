import { ProductionCalendarLegend } from "@/components/production-calendar/production-calendar-legend";
import { ProductionCalendarPrintFrame } from "@/components/production-calendar/production-calendar-print-frame";
import { ProductionStripMonth } from "@/components/production-calendar/production-strip-month";
import { parseCalendarMonthParam } from "@/lib/production-calendar/calendar-utils";
import { loadProductionCalendarMonth } from "@/lib/production-calendar/load-production-calendar-month";

import "@/styles/production-wall-calendar.css";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ month?: string }>;
};

export default async function ProductionCalendarPrintPage({ searchParams }: PageProps) {
  const { month: monthParam } = await searchParams;
  const { year, month } = parseCalendarMonthParam(monthParam);
  const data = await loadProductionCalendarMonth(year, month);

  return (
    <div className="min-h-screen bg-background px-2 py-3 md:px-4" data-content-padding="false">
      <ProductionCalendarPrintFrame monthLabel={data.monthLabel} />

      {data.loadError ? (
        <div className="mb-3 border border-destructive/40 px-4 py-3 text-destructive text-sm">{data.loadError}</div>
      ) : null}

      <ProductionStripMonth data={data} variant="print" showMeta />
      <ProductionCalendarLegend />
    </div>
  );
}
