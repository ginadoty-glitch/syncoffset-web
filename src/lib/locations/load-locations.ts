import { loadForShow } from "@/lib/production-read/load-for-show";

import type { LocationRow } from "./types";

const SELECT = "id, show_id, name, address, notes, created_at, updated_at" as const;

export async function loadLocations() {
  return loadForShow<LocationRow>("locations", SELECT, { column: "name", ascending: true });
}
