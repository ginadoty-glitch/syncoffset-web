import { type OneLinerRow, OneLineScheduleView } from "@/components/one-line-schedule/one-line-schedule-view";
import { getDefaultProductionId } from "@/lib/ingestion/production";
import { extractShadow } from "@/lib/schedule/extract-shadow";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ScheduleDayRow = {
  id: string;
  strip_position: number;
  shoot_day: string;
  day_type: string | null;
  title: string;
  notes: string | null;
};

type SceneRegistryRow = {
  scene_number: string;
  scene_readiness: string;
  shoot_day_number: number | null;
};

export default async function OneLineSchedulePage() {
  let rows: OneLinerRow[] = [];
  let revisionName = "";
  let totalDays = 0;

  try {
    const supabase = createServiceClient();
    const showId = getDefaultProductionId();

    const { data: rev } = await supabase
      .from("production_schedule_revisions")
      .select("id, revision_name")
      .eq("show_id", showId)
      .eq("revision_scope", "published")
      .maybeSingle();

    if (rev) {
      revisionName = rev.revision_name as string;

      const { data: days } = await supabase
        .from("production_schedule_days")
        .select("id, strip_position, shoot_day, day_type, title, notes")
        .eq("revision_id", rev.id)
        .order("strip_position", { ascending: true });

      // Load scene readiness from registry (may not exist yet)
      const sceneReadiness = new Map<string, string>();
      try {
        const { data: scenes } = await supabase
          .from("scene_registry")
          .select("scene_number, scene_readiness, shoot_day_number")
          .eq("show_id", showId);
        if (scenes) {
          for (const s of scenes as SceneRegistryRow[]) {
            sceneReadiness.set(s.scene_number, s.scene_readiness);
          }
        }
      } catch {
        // scene_registry may not exist yet
      }

      const shootDays = (days ?? []).filter((d: ScheduleDayRow) => d.strip_position < 100) as ScheduleDayRow[];
      totalDays = shootDays.length;

      rows = shootDays.map((d) => {
        const shadow = extractShadow(d.notes);
        const dayNumber = d.strip_position + 1;
        const location = d.title?.trim() || "TBD";

        return {
          id: d.id,
          dayNumber,
          date: d.shoot_day?.slice(0, 10) ?? "",
          dayType: d.day_type ?? "shoot",
          location,
          secondaryLocation: shadow.companyMoveDestination,
          zone: shadow.zone,
          totalPages: shadow.totalPages,
          splitDay: shadow.splitDay,
          companyMove: shadow.companyMove,
          companyMoveDestination: shadow.companyMoveDestination,
          unitLabel: shadow.units[0]?.unitLabel ?? "",
          setups: shadow.setups,
          markers: shadow.markers,
          events: shadow.events,
          notes: shadow.cleanedNotes,
          sceneReadiness: sceneReadiness,
        };
      });
    }
  } catch {
    // Supabase not configured
  }

  return <OneLineScheduleView rows={rows} revisionName={revisionName} totalDays={totalDays} />;
}
