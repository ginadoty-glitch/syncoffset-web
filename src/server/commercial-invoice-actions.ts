"use server";

import { revalidatePath } from "next/cache";

import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function createCommercialInvoiceRecord(form: {
  vendorId: string;
  vendorName: string;
  title?: string;
  invoiceNo?: string;
}): Promise<ActionResult> {
  const vendorName = form.vendorName?.trim();
  if (!vendorName) return { ok: false, error: "Vendor is required." };

  const showId = await getActiveProductionId();
  const supabase = createServiceClient();

  const title = form.title?.trim() || `Commercial Invoice — ${vendorName}`;
  const metadata: Record<string, unknown> = {
    vendor_id: form.vendorId,
    vendor_name: vendorName,
    source: "web_desk",
  };
  if (form.invoiceNo?.trim()) metadata.invoice_no = form.invoiceNo.trim();

  const { data, error } = await supabase
    .from("pai_assets")
    .insert({
      show_id: showId,
      asset_type: "document",
      subtype: "commercial_invoice",
      title,
      status: "active",
      metadata,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/commercial-invoices");
  return { ok: true, id: data.id as string };
}
