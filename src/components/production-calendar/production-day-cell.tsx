import type { ProductionCalendarDayCell } from "@/lib/production-calendar/calendar-types";
import {
  formatProductionHeadline,
  formatSceneReferenceList,
  wallBlockClassForDay,
} from "@/lib/production-calendar/day-type-styles";
import { resolveUnitIndicator } from "@/lib/production-calendar/unit-indicators";
import { cn } from "@/lib/utils";
import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";

const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

type ProductionDayCellProps = {
  cell: ProductionCalendarDayCell;
  variant?: "screen" | "print";
};

export function ProductionDayCell({ cell, variant = "screen" }: ProductionDayCellProps) {
  const dayNum = Number.parseInt(cell.date.slice(8, 10), 10);
  const productionDay = cell.day;

  if (!cell.inMonth) {
    return (
      <div className={cn("production-wall-calendar__cell production-wall-calendar__cell--outside")}>
        <span className="production-wall-calendar__date-num opacity-40">{dayNum}</span>
      </div>
    );
  }

  if (!productionDay) {
    return (
      <div className={cn("production-wall-calendar__cell production-wall-calendar__cell--empty flex flex-col")}>
        <span className="production-wall-calendar__date-num">{dayNum}</span>
      </div>
    );
  }

  const dayType = productionDay.day_type as CalendarDayType;
  const blockClass = wallBlockClassForDay(dayType, productionDay.unit_label);
  const unit = resolveUnitIndicator(productionDay.unit_label);
  const headline = formatProductionHeadline(dayType, productionDay.day_number, productionDay.shoot_location);
  const sceneNumbers = cell.scenes.map((s) => s.scene_number);
  const sceneRefLine = formatSceneReferenceList(sceneNumbers);

  return (
    <div className={cn("production-wall-calendar__cell flex flex-col", blockClass)}>
      <div className="flex items-start justify-between gap-1">
        <span className="production-wall-calendar__date-num">{dayNum}</span>
        {productionDay.day_number != null && dayType === "shoot" ? (
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
            #{productionDay.day_number}
          </span>
        ) : null}
      </div>

      <div className="production-wall-calendar__headline">{headline}</div>

      {unit ? <span className={cn("production-wall-calendar__unit-badge", unit.className)}>{unit.label}</span> : null}

      {sceneRefLine ? <div className="production-wall-calendar__scenes">{sceneRefLine}</div> : null}

      <div className="mt-0.5 flex flex-col gap-0.5">
        {cell.scenes.slice(0, variant === "print" ? 6 : 4).map((sc) =>
          sc.location_label ? (
            <div key={`${cell.date}-${sc.scene_number}-loc`} className="production-wall-calendar__scene-loc">
              {sc.interior_exterior}. {sc.location_label}
            </div>
          ) : null,
        )}
      </div>

      {(cell.obligations.length > 0 || cell.departmentFlags.length > 0) && (
        <div className="mt-1 flex flex-col gap-0.5 border-t border-foreground/10 pt-1">
          {cell.obligations.slice(0, variant === "print" ? 5 : 3).map((o) => (
            <span key={`${o.label}-${o.time_label}`} className="production-wall-calendar__scene-loc font-semibold">
              {o.time_label ? `${o.time_label} — ` : ""}
              {o.label}
            </span>
          ))}
          {cell.departmentFlags.slice(0, variant === "print" ? 3 : 2).map((f) => (
            <span key={`${f.department}-${f.label}`} className="production-wall-calendar__scene-loc">
              {f.department}: {f.label}
            </span>
          ))}
        </div>
      )}

      {productionDay.notes ? (
        <p className="production-wall-calendar__notes line-clamp-3">{productionDay.notes}</p>
      ) : null}
    </div>
  );
}

export function ProductionCalendarWeekdayHeader() {
  return (
    <div className="production-wall-calendar__weekday-row grid grid-cols-7">
      {WEEKDAYS.map((d) => (
        <div key={d} className="production-wall-calendar__weekday-cell">
          {d}
        </div>
      ))}
    </div>
  );
}
