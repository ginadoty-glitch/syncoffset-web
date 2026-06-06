import { ProductionCalendarLegend } from "@/components/production-calendar/production-calendar-legend";
import { ProductionCalendarPrintFrame } from "@/components/production-calendar/production-calendar-print-frame";
import { ProductionStripMonth } from "@/components/production-calendar/production-strip-month";
import { buildDefaultMockWallCalendarMonth } from "@/lib/production-calendar/mock-wall-calendar-data";

import "@/styles/production-wall-calendar.css";

export const dynamic = "force-static";

/** Print review — populated mock at 24×36 landscape. Not operational truth. */
export default function ProductionCalendarMockPrintPage() {
  const data = buildDefaultMockWallCalendarMonth();

  return (
    <div className="min-h-screen bg-background px-2 py-3 md:px-4" data-content-padding="false">
      <ProductionCalendarPrintFrame monthLabel={`${data.monthLabel} · MOCK REVIEW`} />
      <ProductionStripMonth data={data} variant="print" showMeta />
      <ProductionCalendarLegend />
    </div>
  );
}
