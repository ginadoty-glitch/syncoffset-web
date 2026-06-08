import Link from "next/link";

import { Upload } from "lucide-react";

import { ShootingScheduleView } from "@/components/shooting-schedule/shooting-schedule-view";
import { Button } from "@/components/ui/button";
import { getDefaultProductionId } from "@/lib/ingestion/production";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ShootingSchedulePage() {
  let days: Array<{
    id: string;
    strip_position: number;
    shoot_day: string;
    day_type: string | null;
    title: string;
    notes: string | null;
  }> = [];

  try {
    const supabase = createServiceClient();
    const showId = getDefaultProductionId();

    const { data: rev } = await supabase
      .from("production_schedule_revisions")
      .select("id, revision_name")
      .eq("show_id", showId)
      .eq("revision_scope", "published")
      .maybeSingle();

    if (rev?.id) {
      const { data } = await supabase
        .from("production_schedule_days")
        .select("id, strip_position, shoot_day, day_type, title, notes")
        .eq("revision_id", rev.id)
        .order("strip_position", { ascending: true });
      days = (data ?? []) as typeof days;
    }
  } catch {
    // Supabase not configured
  }

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
          <h1 className="text-2xl tracking-tight">Shooting Schedule</h1>
          <p className="text-muted-foreground text-sm">
            {days.length > 0
              ? `${days.length} shoot days · Published revision`
              : "Day-by-day shooting schedule with scene assignments and unit breakdowns."}
          </p>
        </div>
        <Button asChild>
          <Link href="/ingestion/upload?kind=shoot-schedule">
            <Upload className="mr-2 size-4" />
            Upload Schedule
          </Link>
        </Button>
      </header>

      <ShootingScheduleView days={days} />
    </div>
  );
}
