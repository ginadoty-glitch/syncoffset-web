"use client";

/**
 * Email — Production office correspondence surface.
 *
 * Three-column operational shell mirroring Logistics:
 *   LEFT   — Folders (Inbox / Sent / Drafts / Brokerage / Approvals) + message list
 *   CENTER — Reading pane with action bar (read-only preview)
 *   RIGHT  — Message context rail (linked op, labels, participants, attachments)
 *
 * Frontend-only. No backend wiring.
 */

import * as React from "react";

import { EmailContext } from "./email-context";
import { emails, type FolderId } from "./email-data";
import { EmailList } from "./email-list";
import { EmailReader } from "./email-reader";

export function Email() {
  const [selectedFolder, setSelectedFolder] = React.useState<FolderId>("inbox");
  const [selectedEmailId, setSelectedEmailId] = React.useState<string | null>(
    emails.find((e) => e.folder === "inbox")?.id ?? null,
  );

  const handleSelectFolder = (folder: FolderId) => {
    setSelectedFolder(folder);
    const first = emails.find((e) => e.folder === folder);
    setSelectedEmailId(first?.id ?? null);
  };

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) ?? null;

  return (
    <div
      data-content-padding="false"
      className="grid h-[calc(100dvh-var(--dashboard-header-height))] overflow-hidden lg:grid-cols-[288px_minmax(0,1fr)_240px] lg:divide-x"
    >
      <div className="h-full overflow-hidden">
        <EmailList
          selectedFolder={selectedFolder}
          onSelectFolder={handleSelectFolder}
          selectedEmailId={selectedEmailId}
          onSelectEmail={setSelectedEmailId}
        />
      </div>

      <div className="hidden h-full overflow-hidden lg:block">
        <EmailReader email={selectedEmail} />
      </div>

      <div className="hidden h-full overflow-hidden lg:block">
        <EmailContext email={selectedEmail} />
      </div>
    </div>
  );
}
