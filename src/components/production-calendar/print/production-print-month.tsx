import type { ProductionCalendarMonthData } from "@/lib/production-calendar/calendar-types";

import { ProductionPrintDayCell } from "./production-print-day-cell";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ProductionPrintMonth({ data }: { data: ProductionCalendarMonthData }) {
  const weeks: (typeof data.cells)[] = [];
  for (let i = 0; i < data.cells.length; i += 7) {
    weeks.push(data.cells.slice(i, i + 7));
  }

  return (
    <>
      <div className="po-print__weekday-row">
        {WEEKDAYS.map((d) => (
          <div key={d} className="po-print__weekday-cell">
            {d}
          </div>
        ))}
      </div>

      <div className="po-print__grid">
        {weeks.map((week, weekIndex) => (
          <div key={week[0]?.date ?? `week-${weekIndex}`} className="po-print__week">
            {week.map((cell) => (
              <ProductionPrintDayCell key={cell.date} cell={cell} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
