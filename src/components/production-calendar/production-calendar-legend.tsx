import {
  UNIT_LEGEND,
  WALL_DAY_TYPE_BLOCK_CLASS,
  WALL_LEGEND_DAY_TYPES,
  ZONE_LEGEND,
} from "@/lib/production-calendar/day-type-styles";
import { cn } from "@/lib/utils";
import { CALENDAR_DAY_TYPE_REGISTRY } from "@/types/core/production-calendar/calendar-day-type";

export function ProductionCalendarLegend() {
  return (
    <div className="production-wall-calendar__legend flex flex-col gap-3 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Schedule blocks</span>
        {ZONE_LEGEND.map((z) => (
          <div key={z.id} className="flex items-center gap-1.5">
            <span className={cn("production-wall-calendar__legend-swatch", z.className)} />
            <span className="text-[10px] uppercase">{z.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Day types</span>
        {WALL_LEGEND_DAY_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={cn("production-wall-calendar__legend-swatch", WALL_DAY_TYPE_BLOCK_CLASS[type])} />
            <span className="text-[10px] uppercase">{CALENDAR_DAY_TYPE_REGISTRY[type].label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Units</span>
        {UNIT_LEGEND.map((u) => (
          <div key={u.id} className="flex items-center gap-1.5">
            <span className={cn("production-wall-calendar__legend-swatch", u.className)} />
            <span className="text-[10px] uppercase">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
