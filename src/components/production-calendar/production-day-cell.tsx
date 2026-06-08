import type { ProductionCalendarDayCell } from "@/lib/production-calendar/calendar-types";
import {
  dayTypeLabel,
  formatSceneReferenceList,
  wallBlockClassForDay,
} from "@/lib/production-calendar/day-type-styles";
import { resolveUnitIndicator } from "@/lib/production-calendar/unit-indicators";
import { cn } from "@/lib/utils";
import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";
import type { ShootDayMarker } from "@/types/schedule";

const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const ZONE_STRIP_BG: Record<string, string> = {
  van: "bg-emerald-600",
  north: "bg-sky-600",
  east: "bg-amber-600",
  island: "bg-violet-600",
};

function MarkerList({ markers }: { markers: ShootDayMarker[] }) {
  if (markers.length === 0) return null;
  return (
    <div className="mt-1 flex flex-col gap-0.5">
      {markers.map((m) => (
        <span
          key={`${m.label}-${m.time ?? ""}`}
          className={cn(
            "font-black text-[8px] uppercase tracking-wider",
            m.markerType === "milestone" ? "text-amber-500" : "text-muted-foreground",
          )}
        >
          {m.time ? `${m.time} — ` : ""}
          {m.label}
        </span>
      ))}
    </div>
  );
}

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
  const isShootDay = dayType === "shoot" && productionDay.day_number != null;
  const zoneBg = ZONE_STRIP_BG[productionDay.zone_color ?? ""] ?? "bg-emerald-600";
  const markers = productionDay.markers ?? [];
  const maxSetups = variant === "print" ? 8 : 4;

  if (isShootDay) {
    const allScenes = cell.scenes.flatMap((s) =>
      s.scene_number
        ? s.scene_number
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : [],
    );
    const sceneRefLine = formatSceneReferenceList(allScenes);

    return (
      <div className={cn("production-wall-calendar__cell flex flex-col", blockClass)}>
        <div className="flex items-stretch gap-0">
          <span className="production-wall-calendar__date-num shrink-0 self-start pr-1">{dayNum}</span>
          <div className={cn("flex min-w-0 flex-1 items-baseline gap-1 rounded-sm px-1.5 py-0.5", zoneBg)}>
            <span className="shrink-0 font-black font-mono text-[11px] text-white leading-tight tracking-wider">
              DAY {productionDay.day_number}
            </span>
            {productionDay.shoot_location?.trim() ? (
              <span className="min-w-0 truncate font-bold text-[9px] text-white/90 uppercase leading-tight tracking-wide">
                {productionDay.shoot_location}
              </span>
            ) : null}
          </div>
        </div>

        {/* Split day + company move badges */}
        {productionDay.split_day || productionDay.company_move ? (
          <div className="mt-0.5 flex gap-1">
            {productionDay.split_day ? (
              <span className="rounded bg-violet-600/30 px-1 py-px font-bold text-[7px] text-violet-300 uppercase">
                SPLIT
              </span>
            ) : null}
            {productionDay.company_move ? (
              <span className="rounded bg-amber-600/30 px-1 py-px font-bold text-[7px] text-amber-300 uppercase">
                CO. MOVE
              </span>
            ) : null}
          </div>
        ) : null}

        {unit ? (
          <span className={cn("production-wall-calendar__unit-badge mt-1", unit.className)}>{unit.label}</span>
        ) : null}

        {sceneRefLine ? <div className="production-wall-calendar__scenes">{sceneRefLine}</div> : null}

        <div className="mt-0.5 flex flex-col gap-0.5">
          {cell.scenes.slice(0, maxSetups).map((sc, i) =>
            sc.set_name ? (
              <div key={`${cell.date}-setup-${i}`} className="production-wall-calendar__scene-loc">
                <span className="font-semibold">{sc.interior_exterior}</span>
                {sc.interior_exterior ? ". " : ""}
                {sc.set_name}
                {sc.day_night ? <span className="ml-1 font-bold text-[8px] opacity-70">({sc.day_night})</span> : null}
                {sc.d_number ? <span className="ml-1 font-mono text-[7px] text-sky-400">{sc.d_number}</span> : null}
              </div>
            ) : null,
          )}
          {cell.scenes.length > maxSetups ? (
            <span className="text-[8px] text-muted-foreground">+{cell.scenes.length - maxSetups} more</span>
          ) : null}
        </div>

        <MarkerList markers={markers} />

        {/* Total pages */}
        {productionDay.total_pages ? (
          <span className="mt-0.5 font-mono text-[7px] text-muted-foreground">{productionDay.total_pages} pgs</span>
        ) : null}

        {productionDay.notes ? (
          <p className="production-wall-calendar__notes line-clamp-2">{productionDay.notes}</p>
        ) : null}

        {(cell.obligations.length > 0 || cell.departmentFlags.length > 0) && (
          <div className="mt-1 flex flex-col gap-0.5 border-foreground/10 border-t pt-1">
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

      <MarkerList markers={markers} />

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
