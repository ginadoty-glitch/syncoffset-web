/** RUNTIME CLASSIFICATION: PRODUCTION — read-only production_documents; live Supabase only. */

import { ProductionDocumentsIndex } from "@/components/production-documents/production-documents-index";
import { loadProductionDocuments } from "@/lib/production-documents/load-production-documents";

export const dynamic = "force-dynamic";

export default async function ProductionDocumentsPage() {
  const data = await loadProductionDocuments();
  return <ProductionDocumentsIndex data={data} />;
}
