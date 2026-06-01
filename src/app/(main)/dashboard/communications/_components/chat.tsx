"use client";

/**
 * Chat — Production communications surface.
 *
 * Three-column operational shell mirroring Logistics:
 *   LEFT   — Channels + Direct Messages
 *   CENTER — Active channel thread + composer (read-only preview)
 *   RIGHT  — Channel context rail (linked ops, pinned, members)
 *
 * Frontend-only. No backend wiring.
 */

import * as React from "react";

import { ChatChannels } from "./chat-channels";
import { ChatContext } from "./chat-context";
import { type ChannelId, channels } from "./chat-data";
import { ChatThread } from "./chat-thread";

export function Chat() {
  const [selectedChannelId, setSelectedChannelId] = React.useState<ChannelId>(channels[0].id);
  const selectedChannel = channels.find((c) => c.id === selectedChannelId) ?? channels[0];

  return (
    <div
      data-content-padding="false"
      className="grid h-[calc(100dvh-var(--dashboard-header-height))] overflow-hidden lg:grid-cols-[288px_minmax(0,1fr)_240px] lg:divide-x"
    >
      <div className="h-full overflow-hidden">
        <ChatChannels selectedChannelId={selectedChannelId} onSelectChannel={setSelectedChannelId} />
      </div>

      <div className="hidden h-full overflow-hidden lg:block">
        <ChatThread channel={selectedChannel} />
      </div>

      <div className="hidden h-full overflow-hidden lg:block">
        <ChatContext channel={selectedChannel} />
      </div>
    </div>
  );
}
