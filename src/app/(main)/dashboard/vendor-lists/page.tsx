/** RUNTIME CLASSIFICATION: PRODUCTION — read-only vendors; live Supabase only. */

import { VendorsIndex } from "@/components/vendors/vendors-index";
import { loadVendors } from "@/lib/vendors/load-vendors";

export const dynamic = "force-dynamic";

export default async function VendorListsPage() {
  const data = await loadVendors();
  return <VendorsIndex data={data} />;
}
