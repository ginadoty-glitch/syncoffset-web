import { Building2 } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function VendorListsPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Vendor Lists"
      description="Approved vendors, contact information, and payment terms."
      icon={Building2}
    />
  );
}
