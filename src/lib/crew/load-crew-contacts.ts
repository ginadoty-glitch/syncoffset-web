import { loadForShow } from "@/lib/production-read/load-for-show";

import type { CrewContactRow } from "./types";

const SELECT = "id, show_id, name, department, position, phone, email, company, notes, created_at" as const;

export async function loadCrewContacts() {
  return loadForShow<CrewContactRow>("crew_contacts", SELECT, { column: "name", ascending: true });
}
