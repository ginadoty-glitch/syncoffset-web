/**
 * Print legend — explains the color-block fills. Because the color IS the
 * location, the legend lists the actual filming locations present in the month
 * with their cell colors (like the reference calendar's location-zone key),
 * plus activity and off-day keys.
 */

import type { ProductionCalendarMonthData } from "@/lib/production-calendar/calendar-types";
import { canonicalLocationKey, locationDisplayLabel } from "@/lib/production-calendar/location-color";
import { dayTypePrintColor, offDayColor, printLocationColor } from "@/lib/production-calendar/print-location-palette";

const SHOOT_TYPES = new Set(["shoot", "pickup", "reshoot"]);
const MAX_LOCATIONS = 16;

function Swatch({ color }: { color: string }) {
  return <span className="po-print__legend-swatch" style={{ background: color }} />;
}

export function ProductionPrintLegend({ data }: { data: ProductionCalendarMonthData }) {
  const seen = new Set<string>();
  const locations: { label: string; bar: string }[] = [];
  const activities = new Set<string>();

  for (const cell of data.cells) {
    const day = cell.day;
    if (!day || !cell.inMonth) continue;
    if (SHOOT_TYPES.has(day.day_type)) {
      const key = canonicalLocationKey(day.shoot_location);
      const label = locationDisplayLabel(day.shoot_location);
      if (key && label && !seen.has(key) && locations.length < MAX_LOCATIONS) {
        seen.add(key);
        locations.push({ label, bar: printLocationColor(day.shoot_location).bar });
      }
    } else if (day.day_type === "prep" || day.day_type === "tech-scout" || day.day_type === "travel") {
      activities.add(day.day_type);
    }
  }

  return (
    <div className="po-print__legend">
      {locations.length > 0 ? (
        <div className="po-print__legend-group">
          <span className="po-print__legend-title">Locations</span>
          {locations.map((loc) => (
            <div key={loc.label} className="po-print__legend-item">
              <Swatch color={loc.bar} />
              <span className="po-print__legend-label">{loc.label}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="po-print__legend-group">
        <span className="po-print__legend-title">Other</span>
        {[...activities].map((a) => (
          <div key={a} className="po-print__legend-item">
            <Swatch color={dayTypePrintColor(a as Parameters<typeof dayTypePrintColor>[0]).bar} />
            <span className="po-print__legend-label">{a.replace("-", " ")}</span>
          </div>
        ))}
        <div className="po-print__legend-item">
          <Swatch color={offDayColor("dark-day").bar} />
          <span className="po-print__legend-label">Company Day Off</span>
        </div>
        <div className="po-print__legend-item">
          <Swatch color={offDayColor("holiday").bar} />
          <span className="po-print__legend-label">Holiday</span>
        </div>
        <div className="po-print__legend-item">
          <Swatch color="#1f2937" />
          <span className="po-print__legend-label">Company Move</span>
        </div>
      </div>
    </div>
  );
}
