"use server";

import { revalidatePath } from "next/cache";

import { buildRunsheetInsertPayload, type TransportOrderForm } from "@/lib/logistics/build-runsheet-insert-payload";
import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

const TRANSPORT_ORDER_PATHS = ["/dashboard/logistics", "/dashboard/logistics/transport-orders"] as const;

function revalidateTransportOrderSurfaces() {
  for (const path of TRANSPORT_ORDER_PATHS) {
    revalidatePath(path);
  }
}

/** Mirrors mobile AppProvider.addRunsheet — inserts into public.runsheets. */
export async function createTransportOrder(form: TransportOrderForm): Promise<ActionResult> {
  const orderNumber = form.orderNumber?.trim();
  const vendorName = form.vendorName?.trim();
  const pickupLocation = form.pickupLocation?.trim();
  const deliveryLocation = form.deliveryLocation?.trim();
  const requestedDate = form.requestedDate?.trim();

  if (!orderNumber) return { ok: false, error: "Order number is required." };
  if (!vendorName) return { ok: false, error: "Vendor is required." };
  if (!pickupLocation) return { ok: false, error: "Pickup location is required." };
  if (!deliveryLocation) return { ok: false, error: "Delivery location is required." };
  if (!requestedDate) return { ok: false, error: "Requested date is required." };

  const showId = await getActiveProductionId();
  const supabase = createServiceClient();
  const payload = buildRunsheetInsertPayload(form, showId);

  const { data, error } = await supabase.from("runsheets").insert(payload).select("id").single();

  if (error) {
    return { ok: false, error: error.message };
  }

  const id = data?.id as string | undefined;
  if (!id) return { ok: false, error: "Transport order saved but no id returned." };

  revalidateTransportOrderSurfaces();
  return { ok: true, id };
}
