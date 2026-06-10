import { isMissingRelation } from "@/lib/operations/is-missing-relation";
import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { emptyReadResult, type ProductionReadResult } from "@/lib/production-read/empty-result";
import { createServiceClient } from "@/lib/supabase/server";

import type { CrewDirectoryRow } from "./types";

export async function loadCrewDirectory(): Promise<ProductionReadResult<CrewDirectoryRow>> {
  let showId: string;

  try {
    showId = await getActiveProductionId();
  } catch (error) {
    return emptyReadResult(error instanceof Error ? error.message : "No active production selected.");
  }

  const supabase = createServiceClient();

  const [contactsResult, driversResult] = await Promise.all([
    supabase
      .from("crew_contacts")
      .select("id, name, department, position, phone, email, company, notes")
      .eq("show_id", showId)
      .order("name", { ascending: true }),
    supabase
      .from("drivers")
      .select("id, name, phone, status, designation")
      .eq("show_id", showId)
      .order("name", { ascending: true }),
  ]);

  if (contactsResult.error && !isMissingRelation(contactsResult.error)) {
    return { showId, rows: [], loadError: contactsResult.error.message };
  }

  if (driversResult.error && !isMissingRelation(driversResult.error)) {
    return { showId, rows: [], loadError: driversResult.error.message };
  }

  const rows: CrewDirectoryRow[] = [];

  for (const c of contactsResult.data ?? []) {
    rows.push({
      id: `contact:${c.id as string}`,
      source: "contact",
      name: c.name as string,
      department: (c.department as string | null) ?? null,
      role: null,
      position: (c.position as string | null) ?? null,
      phone: (c.phone as string | null) ?? null,
      email: (c.email as string | null) ?? null,
      company: (c.company as string | null) ?? null,
      notes: (c.notes as string | null) ?? null,
      status: null,
    });
  }

  for (const d of driversResult.data ?? []) {
    rows.push({
      id: `driver:${d.id as string}`,
      source: "driver",
      name: d.name as string,
      department: "Transport",
      role: "driver",
      position: (d.designation as string | null) ?? null,
      phone: (d.phone as string | null) ?? null,
      email: null,
      company: null,
      notes: null,
      status: (d.status as string | null) ?? null,
    });
  }

  try {
    const { data: members, error: membersError } = await supabase
      .from("show_members")
      .select("id, user_sub, role, department, position, status")
      .eq("show_id", showId)
      .order("role", { ascending: true });

    if (!membersError && members) {
      for (const m of members) {
        const sub = m.user_sub as string;
        const alreadyListed = rows.some((r) => r.name === sub || r.email === sub);
        if (alreadyListed) continue;
        rows.push({
          id: `member:${m.id as string}`,
          source: "member",
          name: sub,
          department: (m.department as string | null) ?? null,
          role: (m.role as string | null) ?? null,
          position: (m.position as string | null) ?? null,
          phone: null,
          email: null,
          company: null,
          notes: null,
          status: (m.status as string | null) ?? null,
        });
      }
    }
  } catch {
    // Service role unavailable — crew_contacts + drivers still returned.
  }

  rows.sort((a, b) => a.name.localeCompare(b.name));

  return { showId, rows, loadError: null };
}
