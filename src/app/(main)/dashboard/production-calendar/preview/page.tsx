import { ProductionCalendarLegend } from "@/components/production-calendar/production-calendar-legend";
import { ProductionCalendarPrintFrame } from "@/components/production-calendar/production-calendar-print-frame";
import { ProductionStripMonth } from "@/components/production-calendar/production-strip-month";
import { buildDefaultMockWallCalendarMonth } from "@/lib/production-calendar/mock-wall-calendar-data";

import "@/styles/production-wall-calendar.css";

export const dynamic = "force-static";

/** Visual-review route — populated mock strip calendar. Not operational truth. */
export default function ProductionCalendarPreviewPage() {
  const data = buildDefaultMockWallCalendarMonth();

  return (
    <div className="flex flex-col gap-4 px-2 py-4 md:px-4 md:py-6" data-content-padding="false">
      <div className="production-calendar-screen-only rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-amber-100 text-sm">
        Mock review — August 2024 Block 03 reference data for cell readability. Not synced to Supabase.
      </div>

      <ProductionCalendarLegend />
      <ProductionStripMonth data={data} variant="screen" />
    </div>
  );
}
