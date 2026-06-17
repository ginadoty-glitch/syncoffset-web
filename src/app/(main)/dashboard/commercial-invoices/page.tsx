/** RUNTIME CLASSIFICATION: PRODUCTION — commercial invoices wired to pai_assets + vendors. */

import { CommercialInvoicesWorkspace } from "@/components/commercial-invoices/commercial-invoices-workspace";
import { loadCommercialInvoices } from "@/lib/commercial-invoices/load-commercial-invoices";
import { getActiveShow } from "@/lib/production/get-active-show";
import { loadVendors } from "@/lib/vendors/load-vendors";

export const dynamic = "force-dynamic";

export default async function CommercialInvoicesPage() {
  const [invoices, vendors, show] = await Promise.all([loadCommercialInvoices(), loadVendors(), getActiveShow()]);
  return (
    <CommercialInvoicesWorkspace
      invoices={invoices}
      vendors={vendors.rows}
      showName={show.name}
      loadError={invoices.loadError ?? vendors.loadError}
    />
  );
}
