import { PrepScheduleView } from "@/components/prep-schedule/prep-schedule-view";
import { getDefaultProductionId } from "@/lib/ingestion/production";
import { getActiveShow } from "@/lib/production/get-active-show";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PrepTask = {
  id: string;
  title: string;
  notes: string | null;
  status: string | null;
  priority: string | null;
  due_at: string | null;
  assignee_name: string | null;
};

export default async function PrepSchedulePage() {
  let tasks: PrepTask[] = [];

  try {
    const supabase = createServiceClient();
    const showId = await getDefaultProductionId();
    const { data } = await supabase
      .from("production_tasks")
      .select("id, title, notes, status, priority, due_at, assignee_name")
      .eq("show_id", showId)
      .order("due_at", { ascending: true });
    tasks = (data ?? []) as PrepTask[];
  } catch {
    // Supabase not configured
  }

  const show = await getActiveShow();

  return <PrepScheduleView tasks={tasks} showName={show.name} />;
}
