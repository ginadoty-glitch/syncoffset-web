import { loadForShow } from "@/lib/production-read/load-for-show";

import type { VendorRow } from "./types";

const SELECT =
  "id, show_id, name, phone, email, gst_number, gst_confirmed, account_number, credit_limit, created_at, address, category" as const;

export async function loadVendors() {
  return loadForShow<VendorRow>("vendors", SELECT, { column: "name", ascending: true });
}

export const VENDOR_CATEGORIES = [
  "all",
  "camera",
  "costume",
  "construction",
  "grip-electric",
  "catering",
  "post",
  "transport",
  "other",
] as const;
