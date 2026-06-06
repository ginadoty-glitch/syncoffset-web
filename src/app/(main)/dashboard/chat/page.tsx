import { MessageSquare } from "lucide-react";

import { CanonWorkspaceShell } from "@/components/canon/canon-workspace-shell";

export default function ChatPage() {
  return (
    <CanonWorkspaceShell
      group="Communications"
      title="Chat"
      description="Crew messaging and production communication channels."
      icon={MessageSquare}
    />
  );
}
