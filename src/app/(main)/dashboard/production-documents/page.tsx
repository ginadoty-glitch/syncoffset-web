/** RUNTIME CLASSIFICATION: PRODUCTION — read-only production_documents; live Supabase only. */

import { ProductionDocumentsIndex } from "@/components/production-documents/production-documents-index";
import { getActiveShow } from "@/lib/production/get-active-show";
import { loadProductionDocuments } from "@/lib/production-documents/load-production-documents";

export const dynamic = "force-dynamic";

export default async function ProductionDocumentsPage() {
  const [data, show] = await Promise.all([loadProductionDocuments(), getActiveShow()]);
  return <ProductionDocumentsIndex data={data} showName={show.name} />;
}
