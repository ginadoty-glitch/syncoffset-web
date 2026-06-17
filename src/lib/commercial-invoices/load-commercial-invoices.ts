import { loadForShow } from "@/lib/production-read/load-for-show";

export type CommercialInvoiceRow = {
  id: string;
  show_id: string;
  title: string | null;
  subtype: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

const SELECT = "id, show_id, title, subtype, metadata, created_at" as const;

export async function loadCommercialInvoices() {
  const result = await loadForShow<CommercialInvoiceRow>("pai_assets", SELECT, {
    column: "created_at",
    ascending: false,
  });
  return {
    ...result,
    rows: result.rows.filter((row) => row.subtype === "commercial_invoice"),
  };
}
