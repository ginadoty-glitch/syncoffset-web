import { loadForShow } from "@/lib/production-read/load-for-show";

export type ShipmentLogRow = {
  id: string;
  show_id: string;
  runsheet_id: string | null;
  direction: string;
  origin: string;
  destination: string;
  status: string;
  carrier: string | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
};

const SELECT =
  "id, show_id, runsheet_id, direction, origin, destination, status, carrier, tracking_number, created_at, updated_at" as const;

export async function loadShipmentLogs() {
  return loadForShow<ShipmentLogRow>("shipments", SELECT, { column: "created_at", ascending: false });
}
