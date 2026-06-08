/** RUNTIME CLASSIFICATION: PRODUCTION — read-only vendors; live Supabase only. */

import { VendorsIndex } from "@/components/vendors/vendors-index";
import { getActiveShow } from "@/lib/production/get-active-show";
import { loadVendors } from "@/lib/vendors/load-vendors";

export const dynamic = "force-dynamic";

export default async function VendorListsPage() {
  const [data, show] = await Promise.all([loadVendors(), getActiveShow()]);
  return <VendorsIndex data={data} showName={show.name} />;
}
