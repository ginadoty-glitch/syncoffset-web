import type {
  CalendarDayRow,
  CalendarDaySceneRow,
  ProductionCalendarDayCell,
} from "@/lib/production-calendar/calendar-types";
import { dayTypeLabel, formatSceneReferenceList } from "@/lib/production-calendar/day-type-styles";
import { locationDisplayLabel } from "@/lib/production-calendar/location-color";
import {
  dayTypePrintColor,
  OFF_DAY_TYPES,
  offDayColor,
  printLocationColor,
} from "@/lib/production-calendar/print-location-palette";
import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";

const SHOOT_TYPES = new Set<CalendarDayType>(["shoot", "pickup", "reshoot"]);
const MAX_SCENES = 6;

type Region = { location: string; scenes: CalendarDaySceneRow[] };

/** Group a day's scenes into colored regions by location (split-location days). */
function buildRegions(cell: ProductionCalendarDayCell, day: CalendarDayRow): Region[] {
  const order: string[] = [];
  const map = new Map<string, CalendarDaySceneRow[]>();
  for (const s of cell.scenes) {
    const key = (s.location_label || day.shoot_location || "").trim();
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(s);
    } else {
      map.set(key, [s]);
      order.push(key);
    }
  }
  if (order.length === 0) return [{ location: day.shoot_location, scenes: [] }];
  return order.map((key) => ({ location: key, scenes: map.get(key) ?? [] }));
}

function sceneLine(scene: CalendarDaySceneRow): string | null {
  const name = scene.set_name?.trim() || scene.description?.trim();
  if (!name) return null;
  const ie = scene.interior_exterior?.trim();
  const dn = scene.day_night?.trim();
  return `${ie ? `${ie}. ` : ""}${name}${dn ? ` (${dn})` : ""}`;
}

function sceneNumbers(scenes: CalendarDaySceneRow[]): string {
  const nums = scenes
    .filter((s) => s.set_name)
    .flatMap((s) =>
      s.scene_number
        ? s.scene_number
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : [],
    );
  return formatSceneReferenceList(nums);
}

export function ProductionPrintDayCell({ cell }: { cell: ProductionCalendarDayCell }) {
  const dayNum = Number.parseInt(cell.date.slice(8, 10), 10);

  if (!cell.inMonth) {
    return (
      <div className="po-cell po-cell--outside">
        <span className="po-cell__date po-cell__date--outside">{dayNum}</span>
      </div>
    );
  }

  const day = cell.day;
  if (!day) {
    return (
      <div className="po-cell">
        <span className="po-cell__date">{dayNum}</span>
      </div>
    );
  }

  const dayType = day.day_type;

  // Off / non-operating day — the whole cell is a single colored fill.
  if (OFF_DAY_TYPES.has(dayType)) {
    const c = offDayColor(dayType);
    const label = dayType === "holiday" ? day.notes.trim() || "Holiday" : "Company Day Off";
    return (
      <div className="po-cell po-cell--off" style={{ background: c.tint }}>
        <span className="po-cell__date" style={{ color: c.ink }}>
          {dayNum}
        </span>
        <div className="po-cell__offlabel" style={{ color: c.ink }}>
          {label}
        </div>
      </div>
    );
  }

  const isShootType = SHOOT_TYPES.has(dayType);
  const isShoot = dayType === "shoot" && day.day_number != null;
  const regions = buildRegions(cell, day);
  const primaryLoc = locationDisplayLabel(day.shoot_location);
  const topColor = isShootType ? printLocationColor(day.shoot_location) : dayTypePrintColor(dayType);
  const markers = day.markers ?? [];

  return (
    <div className="po-cell">
      <div className="po-cell__top">
        <span className="po-cell__date">{dayNum}</span>
        {isShoot ? (
          <div className="po-cell__daybar" style={{ background: topColor.bar, color: topColor.onBar }}>
            <span className="po-cell__dayn">Day {day.day_number}</span>
            {primaryLoc ? <span className="po-cell__dayloc">{primaryLoc}</span> : null}
          </div>
        ) : null}
      </div>

      <div className="po-cell__regions">
        {day.company_move ? <div className="po-cell__cm">Company Move</div> : null}

        {regions.map((region, idx) => {
          const c = isShootType
            ? printLocationColor(region.location || day.shoot_location)
            : dayTypePrintColor(dayType);
          const showOwnBar = !isShoot || idx > 0;
          const loc = locationDisplayLabel(region.location);
          const lines = region.scenes.map(sceneLine).filter((l): l is string => l != null);
          const shown = lines.slice(0, MAX_SCENES);
          const extra = lines.length - shown.length;
          const nums = sceneNumbers(region.scenes);

          return (
            <div
              key={`${cell.date}-${region.location || "main"}`}
              className="po-cell__region"
              style={{ background: c.tint, color: c.ink }}
            >
              {showOwnBar ? (
                <div className="po-cell__rbar" style={{ background: c.bar, color: c.onBar }}>
                  {!isShootType ? <span>{dayTypeLabel(dayType).toUpperCase()}</span> : null}
                  {loc ? <span className="po-cell__rbarloc">{loc}</span> : null}
                </div>
              ) : null}

              <div className="po-cell__rbody">
                {idx === 0
                  ? cell.obligations.map((o) => (
                      <div key={`ev-${o.label}`} className="po-cell__event">
                        {o.time_label ? <span className="po-cell__time">{o.time_label} </span> : null}
                        {o.label}
                      </div>
                    ))
                  : null}

                {idx === 0
                  ? markers.map((m) => (
                      <div key={`mk-${m.label}`} className="po-cell__marker">
                        {m.label}
                      </div>
                    ))
                  : null}

                {shown.map((line) => (
                  <div key={`sc-${line}`} className="po-cell__scene">
                    {line}
                  </div>
                ))}
                {extra > 0 ? <div className="po-cell__more">+{extra} more</div> : null}

                {nums ? <div className="po-cell__scenenums">{nums}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
