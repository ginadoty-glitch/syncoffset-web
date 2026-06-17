"use server";

import { revalidatePath } from "next/cache";

import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUUID(value: string | undefined | null): boolean {
  return typeof value === "string" && UUID_REGEX.test(value);
}

export type ShipmentLogForm = {
  vendorName: string;
  origin: string;
  destination: string;
  direction: "inbound" | "outbound";
  carrier?: string;
  trackingNumber?: string;
  runsheetId?: string;
};

function composeOrigin(vendorName: string, origin: string): string {
  const vendor = vendorName.trim();
  const location = origin.trim();
  if (location && vendor && !location.toLowerCase().includes(vendor.toLowerCase())) {
    return `${vendor} · ${location}`;
  }
  return location || vendor;
}

/** Mirrors mobile AppProvider.addShipment — inserts into public.shipments. */
export async function createShipmentLog(form: ShipmentLogForm): Promise<ActionResult> {
  const vendorName = form.vendorName?.trim();
  const destination = form.destination?.trim();
  const originInput = form.origin?.trim();
  const trackingNumber = form.trackingNumber?.trim();

  if (!vendorName) return { ok: false, error: "Vendor is required." };
  if (!originInput && !trackingNumber) {
    return { ok: false, error: "Enter origin or tracking number." };
  }
  if (!destination) return { ok: false, error: "Destination is required." };

  const showId = await getActiveProductionId();
  const supabase = createServiceClient();
  const origin = composeOrigin(vendorName, originInput || vendorName);
  const runsheetId = isUUID(form.runsheetId) ? form.runsheetId : null;

  const rpc = await supabase.rpc("log_shipment_for_desk", {
    p_show_id: showId,
    p_runsheet_id: runsheetId,
    p_direction: form.direction,
    p_origin: origin,
    p_destination: destination,
    p_carrier: form.carrier?.trim() || null,
    p_tracking_number: trackingNumber || null,
  });

  if (!rpc.error && rpc.data) {
    revalidatePath("/dashboard/logistics/shipment-tracking");
    return { ok: true, id: rpc.data as string };
  }

  if (rpc.error && rpc.error.code !== "PGRST202" && rpc.error.code !== "42883") {
    return { ok: false, error: rpc.error.message };
  }

  const { data, error } = await supabase
    .from("shipments")
    .insert({
      show_id: showId,
      runsheet_id: runsheetId,
      direction: form.direction,
      origin,
      destination,
      status: "preparing",
      carrier: form.carrier?.trim() || null,
      tracking_number: trackingNumber || null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/logistics/shipment-tracking");
  return { ok: true, id: data.id as string };
}
