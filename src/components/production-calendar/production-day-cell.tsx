import type { ProductionCalendarDayCell } from "@/lib/production-calendar/calendar-types";
import { DAY_TYPE_BLOCK_CLASS, dayTypeLabel } from "@/lib/production-calendar/day-type-styles";
import { cn } from "@/lib/utils";
import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function ProductionDayCell({
  cell,
  showWeekdayHeader,
  weekdayIndex,
}: {
  cell: ProductionCalendarDayCell;
  showWeekdayHeader?: boolean;
  weekdayIndex?: number;
}) {
  const dayNum = cell.date.slice(8, 10);
  const productionDay = cell.day;

  if (!cell.inMonth) {
    return (
      <div className="min-h-[148px] border border-border/30 bg-muted/10 p-1.5">
        {showWeekdayHeader && weekdayIndex !== undefined ? (
          <span className="font-mono text-[9px] text-muted-foreground/40">{WEEKDAYS[weekdayIndex]}</span>
        ) : null}
      </div>
    );
  }

  if (!productionDay) {
    return (
      <div className="flex min-h-[148px] flex-col border border-border/50 bg-background p-1.5">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{dayNum}</span>
        </div>
        <span className="mt-auto text-[9px] text-muted-foreground/50 uppercase tracking-wider">—</span>
      </div>
    );
  }

  const blockClass = DAY_TYPE_BLOCK_CLASS[productionDay.day_type as CalendarDayType] ?? DAY_TYPE_BLOCK_CLASS.custom;
  const shootLabel =
    productionDay.day_number != null
      ? `DAY ${productionDay.day_number}`
      : dayTypeLabel(productionDay.day_type as CalendarDayType);

  return (
    <div className={cn("flex min-h-[148px] flex-col border-2 p-1.5 text-[10px] leading-tight", blockClass)}>
      <div className="flex items-start justify-between gap-1">
        <span className="font-mono text-[11px] font-semibold tabular-nums">{dayNum}</span>
        <span className="text-[8px] text-muted-foreground uppercase">
          {dayTypeLabel(productionDay.day_type as CalendarDayType)}
        </span>
      </div>

      <div className="mt-0.5 font-bold text-[11px] uppercase tracking-tight">{shootLabel}</div>
      {productionDay.shoot_location ? (
        <div className="font-semibold text-[10px] uppercase">{productionDay.shoot_location}</div>
      ) : null}
      {productionDay.unit_label ? (
        <div className="text-[9px] text-muted-foreground uppercase">{productionDay.unit_label}</div>
      ) : null}

      <div className="mt-1 flex flex-col gap-0.5">
        {cell.scenes.slice(0, 4).map((sc) => (
          <div key={`${cell.date}-${sc.scene_number}`} className="truncate uppercase">
            <span className="font-mono font-semibold">Sc. {sc.scene_number}</span>
            {sc.location_label ? (
              <span className="block truncate text-[9px] normal-case text-foreground/85">
                {sc.interior_exterior}. {sc.location_label}
              </span>
            ) : null}
          </div>
        ))}
        {cell.scenes.length > 4 ? (
          <span className="text-[9px] text-muted-foreground">+{cell.scenes.length - 4} scenes</span>
        ) : null}
      </div>

      {(cell.obligations.length > 0 || cell.departmentFlags.length > 0) && (
        <div className="mt-auto flex flex-col gap-0.5 border-t border-foreground/10 pt-1">
          {cell.obligations.slice(0, 3).map((o) => (
            <span key={`${o.label}-${o.time_label}`} className="truncate font-medium uppercase">
              {o.label}
              {o.time_label ? <span className="font-normal text-muted-foreground"> {o.time_label}</span> : null}
            </span>
          ))}
          {cell.departmentFlags.slice(0, 2).map((f) => (
            <span key={`${f.department}-${f.label}`} className="truncate text-[9px] text-muted-foreground">
              {f.department}: {f.label}
            </span>
          ))}
        </div>
      )}

      {productionDay.notes ? (
        <p className="mt-0.5 line-clamp-2 text-[9px] normal-case text-muted-foreground">{productionDay.notes}</p>
      ) : null}
    </div>
  );
}

export function ProductionCalendarWeekdayHeader() {
  return (
    <div className="grid grid-cols-7 border border-border bg-muted/40">
      {WEEKDAYS.map((d) => (
        <div
          key={d}
          className="border-r border-border/60 px-2 py-1.5 text-center font-mono text-[10px] font-semibold tracking-widest last:border-r-0"
        >
          {d}
        </div>
      ))}
    </div>
  );
}
