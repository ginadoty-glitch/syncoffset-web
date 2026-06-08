import { CastListView } from "@/components/cast/cast-list-view";
import { getDefaultProductionId } from "@/lib/ingestion/production";
import { getActiveShow } from "@/lib/production/get-active-show";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type CastRow = {
  id: string;
  name: string;
  department: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
};

export default async function CastListsPage() {
  let cast: CastRow[] = [];

  try {
    const supabase = createServiceClient();
    const showId = await getDefaultProductionId();
    const { data } = await supabase
      .from("crew_contacts")
      .select("id, name, department, position, phone, email")
      .eq("show_id", showId)
      .eq("department", "Cast")
      .order("position", { ascending: true });
    cast = (data ?? []) as CastRow[];
  } catch {
    // Supabase not configured
  }

  const show = await getActiveShow();

  return <CastListView cast={cast} showName={show.name} />;
}
