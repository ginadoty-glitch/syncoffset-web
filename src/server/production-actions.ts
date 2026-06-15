"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ACTIVE_PRODUCTION_COOKIE } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

export type ProductionRow = {
  id: string;
  name: string;
  code: string | null;
  production_company: string | null;
  location: string | null;
  production_type: string | null;
  notes: string | null;
  archived_at: string | null;
  updated_at: string;
};

export async function listProductions(includeArchived = false): Promise<ProductionRow[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from("shows")
    .select("id, name, code, production_company, location, production_type, notes, archived_at, updated_at")
    .order("name");
  if (!includeArchived) {
    query = query.is("archived_at", null);
  }
  const { data } = await query;
  return (data ?? []) as ProductionRow[];
}

export async function createProduction(form: {
  name: string;
  code?: string;
  productionCompany?: string;
  location?: string;
}): Promise<{ ok: true; showId: string } | { ok: false; error: string }> {
  const name = form.name?.trim();
  if (!name) return { ok: false, error: "Production name is required" };

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("shows")
    .insert({
      name,
      code: form.code?.trim() || null,
      production_company: form.productionCompany?.trim() || null,
      location: form.location?.trim() || null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  const showId = data.id as string;

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_PRODUCTION_COOKIE, showId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/dashboard", "layout");

  return { ok: true, showId };
}

export async function switchActiveProduction(showId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("shows").select("id, archived_at").eq("id", showId).maybeSingle();

  if (!data) return { ok: false, error: "Production not found." };
  if (data.archived_at) return { ok: false, error: "Cannot open an archived production. Restore it first." };

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_PRODUCTION_COOKIE, showId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function getActiveProductionIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_PRODUCTION_COOKIE)?.value ?? null;
}

export async function updateProduction(
  showId: string,
  form: {
    name?: string;
    code?: string;
    productionCompany?: string;
    location?: string;
    productionType?: string;
    notes?: string;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createServiceClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (form.name !== undefined) {
    const trimmed = form.name.trim();
    if (!trimmed) return { ok: false, error: "Production name cannot be empty" };
    updates.name = trimmed;
  }
  if (form.code !== undefined) updates.code = form.code.trim() || null;
  if (form.productionCompany !== undefined) updates.production_company = form.productionCompany.trim() || null;
  if (form.location !== undefined) updates.location = form.location.trim() || null;
  if (form.productionType !== undefined) updates.production_type = form.productionType.trim() || null;
  if (form.notes !== undefined) updates.notes = form.notes.trim() || null;

  const { error } = await supabase.from("shows").update(updates).eq("id", showId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function archiveProduction(showId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("shows")
    .update({ archived_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", showId);

  if (error) return { ok: false, error: error.message };

  // If the archived production was the active cookie, switch away
  const cookieStore = await cookies();
  const activeCookie = cookieStore.get(ACTIVE_PRODUCTION_COOKIE)?.value;
  if (activeCookie === showId) {
    const { data: remaining } = await supabase.from("shows").select("id").is("archived_at", null).limit(2);

    if (remaining?.length === 1) {
      cookieStore.set(ACTIVE_PRODUCTION_COOKIE, remaining[0].id as string, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    } else {
      cookieStore.delete(ACTIVE_PRODUCTION_COOKIE);
    }
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function unarchiveProduction(showId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("shows")
    .update({ archived_at: null, updated_at: new Date().toISOString() })
    .eq("id", showId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
