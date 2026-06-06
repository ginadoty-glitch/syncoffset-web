import type { ProductionCalendarDayCell } from "@/lib/production-calendar/calendar-types";
import {
  dayTypeLabel,
  formatSceneReferenceList,
  wallBlockClassForDay,
} from "@/lib/production-calendar/day-type-styles";
import { resolveUnitIndicator } from "@/lib/production-calendar/unit-indicators";
import { cn } from "@/lib/utils";
import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";

const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const ZONE_STRIP_COLOR: Record<string, string> = {
  van: "bg-emerald-600",
  north: "bg-sky-600",
  east: "bg-amber-600",
  island: "bg-violet-600",
};

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
  const sceneNumbers = cell.scenes.map((s) => s.scene_number);
  const sceneRefLine = formatSceneReferenceList(sceneNumbers);
  const isShootDay = dayType === "shoot" && productionDay.day_number != null;
  const zoneColor = ZONE_STRIP_COLOR[productionDay.zone_color ?? ""] ?? "bg-emerald-600";

  if (isShootDay) {
    return (
      <div className={cn("production-wall-calendar__cell flex flex-col", blockClass)}>
        <span className="production-wall-calendar__date-num">{dayNum}</span>

        {/* Production strip — dominant visual element */}
        <div className={cn("mt-1 flex flex-col items-center justify-center rounded-sm px-1 py-2", zoneColor)}>
          <span className="font-mono text-[15px] font-black leading-tight tracking-wider text-white drop-shadow-sm">
            DAY {productionDay.day_number}
          </span>
          {productionDay.shoot_location?.trim() ? (
            <span className="mt-0.5 text-center text-[9px] font-bold leading-tight tracking-wide text-white/90 uppercase">
              {productionDay.shoot_location}
            </span>
          ) : null}
        </div>

        {unit ? (
          <span className={cn("production-wall-calendar__unit-badge mt-1", unit.className)}>{unit.label}</span>
        ) : null}

        {sceneRefLine ? <div className="production-wall-calendar__scenes">{sceneRefLine}</div> : null}

        <div className="mt-0.5 flex flex-col gap-0.5">
          {cell.scenes.slice(0, variant === "print" ? 6 : 3).map((sc) =>
            sc.location_label ? (
              <div key={`${cell.date}-${sc.scene_number}-loc`} className="production-wall-calendar__scene-loc">
                {sc.interior_exterior}. {sc.location_label}
              </div>
            ) : null,
          )}
        </div>

        {(cell.obligations.length > 0 || cell.departmentFlags.length > 0) && (
          <div className="mt-1 flex flex-col gap-0.5 border-t border-foreground/10 pt-1">
            {cell.obligations.slice(0, variant === "print" ? 5 : 2).map((o) => (
              <span key={`${o.label}-${o.time_label}`} className="production-wall-calendar__scene-loc font-semibold">
                {o.time_label ? `${o.time_label} — ` : ""}
                {o.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Non-shoot day types: prep, travel, wrap, holiday, etc.
  const typeLabel = dayTypeLabel(dayType).toUpperCase();
  const location = productionDay.shoot_location?.trim();

  return (
    <div className={cn("production-wall-calendar__cell flex flex-col", blockClass)}>
      <span className="production-wall-calendar__date-num">{dayNum}</span>

      <div className="production-wall-calendar__headline mt-1">
        {typeLabel}
        {location ? ` · ${location}` : ""}
      </div>

      {unit ? (
        <span className={cn("production-wall-calendar__unit-badge mt-1", unit.className)}>{unit.label}</span>
      ) : null}

      {cell.obligations.length > 0 && (
        <div className="mt-1 flex flex-col gap-0.5">
          {cell.obligations.slice(0, variant === "print" ? 5 : 3).map((o) => (
            <span key={`${o.label}-${o.time_label}`} className="production-wall-calendar__scene-loc font-semibold">
              {o.time_label ? `${o.time_label} — ` : ""}
              {o.label}
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
