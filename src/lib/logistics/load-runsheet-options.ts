import { loadForShow } from "@/lib/production-read/load-for-show";

export type RunsheetOption = {
  id: string;
  po_number: string | null;
  pickup_vendor_name: string | null;
  pickup_address: string | null;
  dropoff_location_name: string | null;
};

const SELECT = "id, po_number, pickup_vendor_name, pickup_address, dropoff_location_name" as const;

export async function loadRunsheetOptions() {
  return loadForShow<RunsheetOption>("runsheets", SELECT, { column: "updated_at", ascending: false });
}
