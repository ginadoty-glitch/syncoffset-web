import type { CalendarDayObligationRow, ProductionCalendarDayCell } from "@/lib/production-calendar/calendar-types";
import {
  dayTypeLabel,
  EVENT_CATEGORY_STYLE,
  eventBlockCategory,
  formatSceneReferenceList,
  wallBlockClassForDay,
} from "@/lib/production-calendar/day-type-styles";
import { locationColorClass, locationDisplayLabel } from "@/lib/production-calendar/location-color";
import { resolveUnitIndicator } from "@/lib/production-calendar/unit-indicators";
import { cn } from "@/lib/utils";
import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";
import type { ShootDayMarker } from "@/types/schedule";

const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

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

/**
 * Stacked event blocks — multiple independent colored blocks inside one day
 * cell (company move, meetings, scouts, fittings, etc.). Color = category
 * (the calendar legend explains it); text = the specific event.
 */
function EventBlocks({
  obligations,
  companyMove,
  max,
}: {
  obligations: CalendarDayObligationRow[];
  companyMove?: boolean;
  max: number;
}) {
  const blocks: { key: string; category: keyof typeof EVENT_CATEGORY_STYLE; label: string; time: string | null }[] = [];
  if (companyMove) {
    blocks.push({ key: "company-move", category: "company-move", label: "Company Move", time: null });
  }
  for (const o of obligations) {
    blocks.push({
      key: `${o.label}-${o.time_label ?? ""}`,
      category: eventBlockCategory(o.obligation_type),
      label: o.label,
      time: o.time_label,
    });
  }
  if (blocks.length === 0) return null;

  const shown = blocks.slice(0, max);
  const extra = blocks.length - shown.length;

  return (
    <div className="mt-1 flex flex-col gap-0.5">
      {shown.map((b) => (
        <span
          key={b.key}
          className={cn(
            "truncate rounded-sm border-l-2 px-1 py-px font-bold text-[8px] uppercase leading-tight tracking-wide",
            EVENT_CATEGORY_STYLE[b.category].block,
          )}
        >
          {b.time ? `${b.time} ` : ""}
          {b.label}
        </span>
      ))}
      {extra > 0 ? <span className="text-[8px] text-muted-foreground">+{extra} more</span> : null}
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
    const locationLabel = locationDisplayLabel(productionDay.shoot_location);
    const chipColor = locationColorClass(productionDay.shoot_location);
    const pmLocation = productionDay.company_move_destination?.trim() ?? "";
    const showCompanyMoveSplit = Boolean(productionDay.company_move && pmLocation);
    const pmLocationLabel = locationDisplayLabel(pmLocation);
    const pmChipColor = locationColorClass(pmLocation);
    const showFooterEvents = cell.obligations.length > 0 || (productionDay.company_move && !showCompanyMoveSplit);

    return (
      <div className={cn("production-wall-calendar__cell flex flex-col", blockClass)}>
        {productionDay.move_from_label ? (
          <div className="mb-0.5 flex items-center gap-0.5 font-bold text-[7px] text-amber-400 uppercase leading-none tracking-wider">
            <span aria-hidden>↑</span>
            <span className="min-w-0 truncate">FROM {productionDay.move_from_label}</span>
          </div>
        ) : null}
        <div className="flex items-start gap-1">
          <span className="production-wall-calendar__date-num shrink-0 self-start">{dayNum}</span>
          {showCompanyMoveSplit ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className={cn("rounded-sm px-1.5 py-1", chipColor)}>
                <span className="font-black font-mono text-[11px] text-white leading-none tracking-wider">
                  DAY {productionDay.day_number}
                </span>
                {locationLabel ? (
                  <>
                    <span className="block font-bold text-[7px] text-white/70 uppercase">AM</span>
                    <span className="truncate font-bold text-[9px] text-white uppercase leading-tight tracking-wide">
                      {locationLabel}
                    </span>
                  </>
                ) : null}
              </div>
              <div className="rounded-sm border border-violet-400/40 bg-violet-950/60 px-1 py-0.5 text-center font-black text-[7px] text-violet-200 uppercase tracking-wider">
                Company Move
              </div>
              <div className={cn("rounded-sm px-1.5 py-1", pmChipColor)}>
                <span className="block font-bold text-[7px] text-white/70 uppercase">PM</span>
                <span className="truncate font-bold text-[9px] text-white uppercase leading-tight tracking-wide">
                  {pmLocationLabel}
                </span>
              </div>
            </div>
          ) : (
            <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5 rounded-sm px-1.5 py-1", chipColor)}>
              <span className="font-black font-mono text-[11px] text-white leading-none tracking-wider">
                DAY {productionDay.day_number}
              </span>
              {locationLabel ? (
                <span className="truncate font-bold text-[9px] text-white uppercase leading-tight tracking-wide">
                  {locationLabel}
                </span>
              ) : null}
            </div>
          )}
        </div>

        {unit ? (
          <span className={cn("production-wall-calendar__unit-badge mt-1", unit.className)}>{unit.label}</span>
        ) : null}

        {/* Split day badge (D/N at same location — distinct from company move) */}
        {productionDay.split_day ? (
          <div className="mt-0.5 flex gap-1">
            <span className="rounded bg-violet-600/30 px-1 py-px font-bold text-[7px] text-violet-300 uppercase">
              SPLIT
            </span>
          </div>
        ) : null}

        {sceneRefLine ? <div className="production-wall-calendar__scenes">{sceneRefLine}</div> : null}

        <div className="mt-0.5 flex flex-col gap-0.5">
          {cell.scenes.slice(0, maxSetups).map((sc) =>
            sc.set_name ? (
              <div
                key={`${cell.date}-${sc.scene_number}-${sc.set_name}`}
                className="production-wall-calendar__scene-loc"
              >
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

        {showFooterEvents ? (
          <div className="mt-1 border-foreground/10 border-t pt-1">
            <EventBlocks
              obligations={cell.obligations}
              companyMove={productionDay.company_move && !showCompanyMoveSplit}
              max={variant === "print" ? 8 : 4}
            />
          </div>
        ) : null}
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

      {cell.obligations.length > 0 ? (
        <EventBlocks obligations={cell.obligations} max={variant === "print" ? 8 : 4} />
      ) : null}

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
