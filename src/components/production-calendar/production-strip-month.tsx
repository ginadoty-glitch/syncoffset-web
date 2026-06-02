import type { ProductionCalendarMonthData } from "@/lib/production-calendar/calendar-types";

import { ProductionCalendarWeekdayHeader, ProductionDayCell } from "./production-day-cell";

export function ProductionStripMonth({ data }: { data: ProductionCalendarMonthData }) {
  const weeks: (typeof data.cells)[] = [];
  for (let i = 0; i < data.cells.length; i += 7) {
    weeks.push(data.cells.slice(i, i + 7));
  }

  return (
    <div className="overflow-x-auto">
      <ProductionCalendarWeekdayHeader />
      <div className="flex flex-col border border-t-0 border-border">
        {weeks.map((week) => (
          <div key={week[0]?.date ?? "week"} className="grid grid-cols-7 border-b border-border last:border-b-0">
            {week.map((cell, idx) => (
              <ProductionDayCell key={cell.date} cell={cell} weekdayIndex={idx} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
