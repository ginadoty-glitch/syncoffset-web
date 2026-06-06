import { FileText } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function NftsPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="NFTs"
      description="Non-Film Transactions and overhead charges."
      icon={FileText}
    />
  );
}
