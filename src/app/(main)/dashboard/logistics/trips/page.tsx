import { Route } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function TripsPage() {
  return (
    <CanonWorkspaceShell
      group="Logistics"
      title="Trips"
      description="Active and completed trips with driver assignments and stop sequences."
      icon={Route}
    />
  );
}
