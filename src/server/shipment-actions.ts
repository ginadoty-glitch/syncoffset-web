"use server";

import { revalidatePath } from "next/cache";

import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function createShipmentLog(form: {
  vendorId: string;
  vendorName: string;
  direction: "inbound" | "outbound";
  destination?: string;
  carrier?: string;
  trackingNumber?: string;
}): Promise<ActionResult> {
  const vendorName = form.vendorName?.trim();
  if (!vendorName) return { ok: false, error: "Vendor is required." };

  const showId = await getActiveProductionId();
  const supabase = createServiceClient();

  const origin = vendorName;
  const destination = form.destination?.trim() || "Production";

  const { data, error } = await supabase
    .from("shipments")
    .insert({
      show_id: showId,
      direction: form.direction,
      origin,
      destination,
      status: "preparing",
      carrier: form.carrier?.trim() || null,
      tracking_number: form.trackingNumber?.trim() || null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/logistics/shipment-tracking");
  return { ok: true, id: data.id as string };
}
