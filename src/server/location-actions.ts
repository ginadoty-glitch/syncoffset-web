"use server";

import { revalidatePath } from "next/cache";

import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function createLocation(form: { name: string; address?: string; notes?: string }): Promise<ActionResult> {
  const name = form.name?.trim();
  if (!name) return { ok: false, error: "Location name is required." };

  const showId = await getActiveProductionId();
  const supabase = createServiceClient();

  const { error } = await supabase.from("locations").insert({
    show_id: showId,
    name,
    address: form.address?.trim() || "",
    notes: form.notes?.trim() || null,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/locations");
  return { ok: true };
}

export async function updateLocation(
  locationId: string,
  form: {
    name?: string;
    address?: string;
    notes?: string;
  },
): Promise<ActionResult> {
  const supabase = createServiceClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (form.name !== undefined) {
    const trimmed = form.name.trim();
    if (!trimmed) return { ok: false, error: "Location name cannot be empty." };
    updates.name = trimmed;
  }
  if (form.address !== undefined) updates.address = form.address.trim() || "";
  if (form.notes !== undefined) updates.notes = form.notes.trim() || null;

  const { error } = await supabase.from("locations").update(updates).eq("id", locationId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/locations");
  return { ok: true };
}
