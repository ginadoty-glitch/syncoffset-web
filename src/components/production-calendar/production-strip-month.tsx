import type { ProductionCalendarMonthData } from "@/lib/production-calendar/calendar-types";

import { ProductionCalendarWeekdayHeader, ProductionDayCell } from "./production-day-cell";

type ProductionStripMonthProps = {
  data: ProductionCalendarMonthData;
  variant?: "screen" | "print";
  showMeta?: boolean;
};

export function ProductionStripMonth({ data, variant = "screen", showMeta = true }: ProductionStripMonthProps) {
  const weeks: (typeof data.cells)[] = [];
  for (let i = 0; i < data.cells.length; i += 7) {
    weeks.push(data.cells.slice(i, i + 7));
  }

  return (
    <div className="production-wall-calendar w-full">
      {showMeta ? (
        <div className="mb-3 flex flex-col gap-1 border-b border-border pb-3">
          <h2 className="production-wall-calendar__month-title text-center font-bold text-2xl uppercase tracking-wide">
            {data.monthLabel}
          </h2>
          {data.calendarName ? (
            <p className="text-center font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              {data.calendarName}
            </p>
          ) : null}
        </div>
      ) : null}

      <ProductionCalendarWeekdayHeader />

      <div className="production-wall-calendar__grid">
        {weeks.map((week, weekIndex) => (
          <div key={week[0]?.date ?? `week-${weekIndex}`} className="production-wall-calendar__week-row">
            {week.map((cell) => (
              <ProductionDayCell key={cell.date} cell={cell} variant={variant} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
