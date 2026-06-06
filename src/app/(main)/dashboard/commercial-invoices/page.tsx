import { FileText } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function CommercialInvoicesPage() {
  return (
    <CanonWorkspaceShell
      group="Brokerage"
      title="Commercial Invoices"
      description="Commercial invoices for cross-border shipments and customs documentation."
      icon={FileText}
    />
  );
}
