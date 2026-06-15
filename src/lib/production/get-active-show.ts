import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

export type ActiveShow = {
  id: string;
  name: string;
  code: string | null;
  productionCompany: string | null;
  location: string | null;
};

const fallback: ActiveShow = {
  id: "",
  name: "Unknown Production",
  code: null,
  productionCompany: null,
  location: null,
};

export async function getActiveShow(): Promise<ActiveShow> {
  let showId: string;
  try {
    showId = await getActiveProductionId();
  } catch {
    return fallback;
  }

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("shows")
      .select("id, name, code, production_company, location")
      .eq("id", showId)
      .is("archived_at", null)
      .maybeSingle();

    if (data) {
      return {
        id: data.id as string,
        name: (data.name as string) || "Untitled Production",
        code: (data.code as string) || null,
        productionCompany: (data.production_company as string) || null,
        location: (data.location as string) || null,
      };
    }
  } catch {
    // Supabase not configured
  }

  return { ...fallback, id: showId };
}
