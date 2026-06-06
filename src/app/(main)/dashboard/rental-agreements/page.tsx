import { Key } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function RentalAgreementsPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Rental Agreements"
      description="Equipment and facility rental agreements, terms, and return dates."
      icon={Key}
    />
  );
}
