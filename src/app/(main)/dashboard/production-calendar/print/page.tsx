import { ProductionPrintHeader } from "@/components/production-calendar/print/production-print-header";
import { ProductionPrintLegend } from "@/components/production-calendar/print/production-print-legend";
import { ProductionPrintMonth } from "@/components/production-calendar/print/production-print-month";
import { ProductionCalendarPrintFrame } from "@/components/production-calendar/production-calendar-print-frame";
import { getActiveShow } from "@/lib/production/get-active-show";
import { parseCalendarMonthParam } from "@/lib/production-calendar/calendar-utils";
import { loadProductionCalendarMonth } from "@/lib/production-calendar/load-production-calendar-month";

import "@/styles/production-wall-calendar.css";
import "@/styles/production-print-calendar.css";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ month?: string }>;
};

export default async function ProductionCalendarPrintPage({ searchParams }: PageProps) {
  const { month: monthParam } = await searchParams;
  const { year, month } = parseCalendarMonthParam(monthParam);
  const [data, show] = await Promise.all([loadProductionCalendarMonth(year, month), getActiveShow()]);

  return (
    <div className="min-h-screen bg-neutral-300 px-2 py-4 md:px-4" data-content-padding="false">
      <ProductionCalendarPrintFrame monthLabel={data.monthLabel} />

      <div className="po-print mx-auto w-full max-w-[1700px] p-4 shadow-xl print:max-w-none print:p-0 print:shadow-none">
        {data.loadError ? (
          <div className="mb-3 border border-[#cc1414] px-4 py-3 font-semibold text-[#cc1414] text-sm">
            {data.loadError}
          </div>
        ) : null}

        <ProductionPrintHeader showName={show.name} monthLabel={data.monthLabel} calendarName={data.calendarName} />
        <ProductionPrintMonth data={data} />
        <ProductionPrintLegend data={data} />
      </div>
    </div>
  );
}
