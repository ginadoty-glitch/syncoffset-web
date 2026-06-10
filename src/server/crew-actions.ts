"use server";

import { revalidatePath } from "next/cache";

import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function createCrewContact(form: {
  name: string;
  department?: string;
  position?: string;
  phone?: string;
  email?: string;
  company?: string;
  notes?: string;
}): Promise<ActionResult> {
  const name = form.name?.trim();
  if (!name) return { ok: false, error: "Name is required." };

  const showId = await getActiveProductionId();
  const supabase = createServiceClient();

  const { error } = await supabase.from("crew_contacts").insert({
    show_id: showId,
    name,
    department: form.department?.trim() || null,
    position: form.position?.trim() || null,
    phone: form.phone?.trim() || null,
    email: form.email?.trim() || null,
    company: form.company?.trim() || null,
    notes: form.notes?.trim() || null,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/crew");
  return { ok: true };
}

export async function updateCrewContact(
  contactId: string,
  form: {
    name?: string;
    department?: string;
    position?: string;
    phone?: string;
    email?: string;
    company?: string;
    notes?: string;
  },
): Promise<ActionResult> {
  const supabase = createServiceClient();
  const updates: Record<string, unknown> = {};

  if (form.name !== undefined) {
    const trimmed = form.name.trim();
    if (!trimmed) return { ok: false, error: "Name cannot be empty." };
    updates.name = trimmed;
  }
  if (form.department !== undefined) updates.department = form.department.trim() || null;
  if (form.position !== undefined) updates.position = form.position.trim() || null;
  if (form.phone !== undefined) updates.phone = form.phone.trim() || null;
  if (form.email !== undefined) updates.email = form.email.trim() || null;
  if (form.company !== undefined) updates.company = form.company.trim() || null;
  if (form.notes !== undefined) updates.notes = form.notes.trim() || null;

  const { error } = await supabase.from("crew_contacts").update(updates).eq("id", contactId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/crew");
  return { ok: true };
}
