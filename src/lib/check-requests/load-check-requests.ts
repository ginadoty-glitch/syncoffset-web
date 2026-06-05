import { loadForShow } from "@/lib/production-read/load-for-show";

import type { ProductionCheckRequestRow } from "./types";

const SELECT =
  "id, show_id, request_number, vendor_name, request_scope, requested_amount, currency_code, payment_method_requested, status, justification, updated_at" as const;

export async function loadCheckRequests() {
  return loadForShow<ProductionCheckRequestRow>("production_check_requests", SELECT, {
    column: "updated_at",
    ascending: false,
  });
}
