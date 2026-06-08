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
  updated_at: string;
};

export async function listProductions(): Promise<ProductionRow[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("shows")
    .select("id, name, code, production_company, location, updated_at")
    .order("name");
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

export async function switchActiveProduction(showId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_PRODUCTION_COOKIE, showId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  revalidatePath("/dashboard", "layout");
}

export async function getActiveProductionIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_PRODUCTION_COOKIE)?.value ?? null;
}
