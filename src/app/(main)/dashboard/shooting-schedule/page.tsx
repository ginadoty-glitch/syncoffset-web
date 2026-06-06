import { CalendarDays } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function ShootingSchedulePage() {
  return (
    <CanonWorkspaceShell
      group="Production"
      title="Shooting Schedule"
      description="Day-by-day shooting schedule with scene assignments and unit breakdowns."
      icon={CalendarDays}
    />
  );
}
