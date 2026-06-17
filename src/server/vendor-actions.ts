"use server";

import { revalidatePath } from "next/cache";

import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

const VENDOR_PATHS = [
  "/dashboard/vendor-lists",
  "/dashboard/budget",
  "/dashboard/live-budget",
  "/dashboard/commercial-invoices",
  "/dashboard/logistics/shipment-tracking",
] as const;

function revalidateVendorSurfaces() {
  for (const path of VENDOR_PATHS) {
    revalidatePath(path);
  }
}

export type VendorForm = {
  name: string;
  category?: string;
  address?: string;
  phone?: string;
  email?: string;
  gst_number?: string;
  gst_confirmed?: boolean;
  account_number?: string;
  credit_limit?: string | number;
};

function parseCreditLimit(raw: string | number | undefined): number | null {
  if (raw === undefined || raw === null || raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(String(raw).replace(/[$,\s]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

function rowFromForm(showId: string, form: VendorForm): Record<string, unknown> {
  const name = form.name.trim();
  return {
    show_id: showId,
    name,
    category: form.category?.trim() || null,
    address: form.address?.trim() || null,
    phone: form.phone?.trim() || null,
    email: form.email?.trim() || null,
    gst_number: form.gst_number?.trim() || null,
    gst_confirmed: form.gst_confirmed ?? false,
    account_number: form.account_number?.trim() || null,
    credit_limit: parseCreditLimit(form.credit_limit),
    updated_at: new Date().toISOString(),
  };
}

/** Mirrors mobile AppProvider.addVendor — dedupe by normalized name per show. */
export async function createVendor(form: VendorForm): Promise<ActionResult & { id?: string }> {
  const name = form.name?.trim();
  if (!name) return { ok: false, error: "Vendor name is required." };

  const showId = await getActiveProductionId();
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("vendors")
    .select("id, name")
    .eq("show_id", showId)
    .ilike("name", name)
    .maybeSingle();

  if (existing?.id) {
    revalidateVendorSurfaces();
    return { ok: true, id: existing.id as string };
  }

  const payload = rowFromForm(showId, form);
  delete payload.updated_at;

  const { data, error } = await supabase.from("vendors").insert(payload).select("id").single();

  if (error) {
    if (error.code === "PGRST204") {
      const { data: minimal, error: err2 } = await supabase
        .from("vendors")
        .insert({ show_id: showId, name })
        .select("id")
        .single();
      if (err2 || !minimal) return { ok: false, error: err2?.message ?? "Insert failed." };
      revalidateVendorSurfaces();
      return { ok: true, id: minimal.id as string };
    }
    return { ok: false, error: error.message };
  }

  revalidateVendorSurfaces();
  return { ok: true, id: data.id as string };
}

export async function updateVendor(vendorId: string, form: Partial<VendorForm>): Promise<ActionResult> {
  if (!vendorId) return { ok: false, error: "Missing vendor id." };

  const supabase = createServiceClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (form.name !== undefined) {
    const trimmed = form.name.trim();
    if (!trimmed) return { ok: false, error: "Vendor name cannot be empty." };
    updates.name = trimmed;
  }
  if (form.category !== undefined) updates.category = form.category.trim() || null;
  if (form.address !== undefined) updates.address = form.address.trim() || null;
  if (form.phone !== undefined) updates.phone = form.phone.trim() || null;
  if (form.email !== undefined) updates.email = form.email.trim() || null;
  if (form.gst_number !== undefined) updates.gst_number = form.gst_number.trim() || null;
  if (form.gst_confirmed !== undefined) updates.gst_confirmed = form.gst_confirmed;
  if (form.account_number !== undefined) updates.account_number = form.account_number.trim() || null;
  if (form.credit_limit !== undefined) updates.credit_limit = parseCreditLimit(form.credit_limit);

  const { error } = await supabase.from("vendors").update(updates).eq("id", vendorId);
  if (error) return { ok: false, error: error.message };

  revalidateVendorSurfaces();
  return { ok: true };
}

export async function deleteVendor(vendorId: string): Promise<ActionResult> {
  if (!vendorId) return { ok: false, error: "Missing vendor id." };

  const supabase = createServiceClient();
  const { error } = await supabase.from("vendors").delete().eq("id", vendorId);
  if (error) return { ok: false, error: error.message };

  revalidateVendorSurfaces();
  return { ok: true };
}
