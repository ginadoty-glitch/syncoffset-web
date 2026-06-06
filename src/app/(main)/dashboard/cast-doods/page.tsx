import { Calendar } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function CastDoodsPage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Cast DOODs"
      description="Day Out Of Days reports for cast members."
      icon={Calendar}
    />
  );
}
