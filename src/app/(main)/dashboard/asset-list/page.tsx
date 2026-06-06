import { Database } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function AssetListPage() {
  return (
    <CanonWorkspaceShell
      group="Accounting"
      title="Asset List"
      description="Accounting asset register, depreciation tracking, and inventory control."
      icon={Database}
    />
  );
}
