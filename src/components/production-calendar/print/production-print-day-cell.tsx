import { Fragment } from "react";

import type { ProductionCalendarDayCell } from "@/lib/production-calendar/calendar-types";
import { locationDisplayLabel } from "@/lib/production-calendar/location-color";
import { cn } from "@/lib/utils";
import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";
import type { ShootDayMarker } from "@/types/schedule";

const OFF_TYPES = new Set<CalendarDayType>(["holiday", "dark-day", "weather-hold", "strike"]);
const SCENE_TYPES = new Set<CalendarDayType>(["shoot", "pickup", "reshoot"]);

/** Day types that read as a single centered event headline on the wall calendar. */
const HEADLINE_EVENT_LABEL: Partial<Record<CalendarDayType, string>> = {
  "tech-scout": "TECH SCOUT",
  "camera-test": "CAMERA TEST",
  travel: "TRAVEL",
  "company-move": "COMPANY MOVE",
  wrap: "WRAP",
  construction: "CONSTRUCTION",
};

const MAX_SCENES = 6;

type MarkerKind = "countdown" | "begin" | "end" | "event" | "note";

function classifyMarker(marker: ShootDayMarker): MarkerKind {
  const label = marker.label.toUpperCase();
  if (/\bOUT\b/.test(label)) return "countdown";
  if (marker.markerType === "milestone") {
    return /\b(END|WRAP|FINAL|LAST)\b/.test(label) ? "end" : "begin";
  }
  if (marker.markerType === "meeting") return "event";
  return "note";
}

function sceneLine(scene: ProductionCalendarDayCell["scenes"][number]): string | null {
  const name = scene.set_name?.trim() || scene.description?.trim();
  if (!name) return null;
  const ie = scene.interior_exterior?.trim();
  const dn = scene.day_night?.trim();
  return `${ie ? `${ie}. ` : ""}${name}${dn ? ` (${dn})` : ""}`;
}

export function ProductionPrintDayCell({ cell }: { cell: ProductionCalendarDayCell }) {
  const dayNum = Number.parseInt(cell.date.slice(8, 10), 10);

  if (!cell.inMonth) {
    return (
      <div className="po-print__cell po-print__cell--outside">
        <span className="po-print__date po-print__date--outside">{dayNum}</span>
      </div>
    );
  }

  const day = cell.day;
  if (!day) {
    return (
      <div className="po-print__cell">
        <span className="po-print__date">{dayNum}</span>
      </div>
    );
  }

  const dayType = day.day_type;
  const isShoot = dayType === "shoot" && day.day_number != null;
  const isOff = OFF_TYPES.has(dayType);
  const location = locationDisplayLabel(day.shoot_location);

  const markers = day.markers ?? [];
  const countdowns = markers.filter((m) => classifyMarker(m) === "countdown");
  const begins = markers.filter((m) => classifyMarker(m) === "begin");
  const ends = markers.filter((m) => classifyMarker(m) === "end");
  const markerEvents = markers.filter((m) => classifyMarker(m) === "event");
  const notes = markers.filter((m) => classifyMarker(m) === "note");

  const sceneLines = SCENE_TYPES.has(dayType)
    ? cell.scenes.map(sceneLine).filter((line): line is string => line != null)
    : [];
  const shownScenes = sceneLines.slice(0, MAX_SCENES);
  const extraScenes = sceneLines.length - shownScenes.length;

  const headline = HEADLINE_EVENT_LABEL[dayType];
  const showCompanyMove = day.company_move && dayType !== "company-move" && dayType !== "travel";

  const events: string[] = [];
  if (showCompanyMove) events.push("Company Move");
  for (const o of cell.obligations) events.push(o.time_label ? `${o.time_label} ${o.label}` : o.label);
  for (const m of markerEvents) events.push(m.time ? `${m.time} ${m.label}` : m.label);

  const isCallout = dayType === "custom" && day.notes.trim().length > 0;

  return (
    <div className={cn("po-print__cell", isOff && "po-print__cell--off")}>
      <span className="po-print__date">{dayNum}</span>
      {isShoot ? <span className="po-print__dnum">D{day.day_number}</span> : null}

      <div className="po-print__body">
        {countdowns.map((m) => (
          <div key={`cd-${m.label}`} className="po-print__countdown">
            {m.label}
          </div>
        ))}
        {begins.map((m) => (
          <div key={`b-${m.label}`} className="po-print__milestone po-print__milestone--begin">
            {m.label}
          </div>
        ))}

        {isOff ? (
          <div className={cn("po-print__dayoff", dayType === "holiday" && "po-print__dayoff--holiday")}>
            {dayType === "holiday" ? day.notes.trim() || "Holiday" : "Company Day Off"}
          </div>
        ) : null}

        {!isOff && headline ? <div className="po-print__event">{headline}</div> : null}

        {shownScenes.map((line, i) => (
          <Fragment key={`sc-${line}`}>
            {i > 0 ? <div className="po-print__divider" /> : null}
            <div className="po-print__scene">{line}</div>
          </Fragment>
        ))}
        {extraScenes > 0 ? <div className="po-print__milestone--note">+{extraScenes} more</div> : null}

        {!isOff &&
          events.map((label) => (
            <div key={`ev-${label}`} className="po-print__event">
              {label}
            </div>
          ))}

        {isCallout ? (
          <>
            <div className="po-print__callout-label">To Be Scheduled:</div>
            <div className="po-print__callout-value">{day.notes.trim()}</div>
          </>
        ) : null}

        {ends.map((m) => (
          <div key={`e-${m.label}`} className="po-print__milestone po-print__milestone--end">
            {m.label}
          </div>
        ))}
        {notes.map((m) => (
          <div key={`n-${m.label}`} className="po-print__milestone--note">
            {m.label}
          </div>
        ))}

        {!isOff && location ? <div className="po-print__location">{location}</div> : null}
      </div>
    </div>
  );
}
