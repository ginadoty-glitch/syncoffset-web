import { DAY_TYPE_BLOCK_CLASS, ZONE_LEGEND } from "@/lib/production-calendar/day-type-styles";
import { cn } from "@/lib/utils";
import type { CalendarDayType } from "@/types/core/production-calendar/calendar-day-type";
import { CALENDAR_DAY_TYPE_REGISTRY } from "@/types/core/production-calendar/calendar-day-type";

const LEGEND_DAY_TYPES: CalendarDayType[] = [
  "prep",
  "shoot",
  "wrap",
  "tech-scout",
  "construction",
  "travel",
  "holiday",
];

export function ProductionCalendarLegend() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Day types</span>
        {LEGEND_DAY_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={cn("size-3 rounded-sm border", DAY_TYPE_BLOCK_CLASS[type])} />
            <span className="text-[10px] uppercase">{CALENDAR_DAY_TYPE_REGISTRY[type].label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Units / zones</span>
        {ZONE_LEGEND.map((z) => (
          <div key={z.id} className="flex items-center gap-1.5">
            <span className={cn("size-3 rounded-sm", z.className)} />
            <span className="text-[10px] uppercase">{z.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground">
        Strip calendar — each cell is a production day container (not an appointment). Scene → Shoot Day → Calendar.
      </p>
    </div>
  );
}
