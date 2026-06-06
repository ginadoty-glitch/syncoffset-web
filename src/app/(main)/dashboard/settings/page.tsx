import { Settings } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function SettingsPage() {
  return (
    <CanonWorkspaceShell
      group="System"
      title="Settings"
      description="Production settings, preferences, and system configuration."
      icon={Settings}
    />
  );
}
