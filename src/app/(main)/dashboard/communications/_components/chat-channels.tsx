"use client";

import { Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
  type ChannelId,
  type ChatChannel,
  channels,
  type DirectMessage,
  directMessages,
  type Presence,
} from "./chat-data";

const presenceDot: Record<Presence, string> = {
  "on-shift": "bg-[#47AE90]",
  standby: "bg-[#f2b90e]",
  wrapped: "bg-border",
};

const signalText: Record<NonNullable<ChatChannel["signal"]>, string> = {
  rush: "text-[#d3410c]",
  alert: "text-[#f2b90e]",
  info: "text-[#bfd4ef]",
};

function ChannelRow({
  channel,
  active,
  onSelect,
}: {
  channel: ChatChannel;
  active: boolean;
  onSelect: (id: ChannelId) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={(e) => {
        e.currentTarget.blur();
        onSelect(channel.id);
      }}
      className={cn(
        "relative w-full rounded border px-2.5 py-1.5 text-left transition-colors",
        "hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#bfd4ef]/20",
        active ? "border-[#bfd4ef]/30 bg-[#bfd4ef]/[0.04]" : "border-border/50 bg-transparent",
      )}
    >
      {channel.signal && !active && (
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[2px] rounded-l",
            channel.signal === "rush" && "bg-[#d3410c]/55",
            channel.signal === "alert" && "bg-[#f2b90e]/45",
            channel.signal === "info" && "bg-[#bfd4ef]/40",
          )}
        />
      )}
      <div className="flex items-center gap-1.5">
        <span className={cn("shrink-0 font-mono text-[11px]", active ? "text-[#bfd4ef]" : "text-muted-foreground/40")}>
          #
        </span>
        <span
          className={cn("min-w-0 truncate text-[11px]", active ? "font-medium text-[#dbd5c5]" : "text-foreground/80")}
        >
          {channel.label}
        </span>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2">
          {channel.signal && <span className={cn("font-mono text-[9px]", signalText[channel.signal])}>●</span>}
          {channel.unread > 0 ? (
            <span className="rounded bg-[#bfd4ef]/15 px-1 font-mono text-[#bfd4ef] text-[9px] tabular-nums">
              {channel.unread}
            </span>
          ) : (
            <span className="font-mono text-[9px] text-muted-foreground/40 tabular-nums">{channel.lastActivity}</span>
          )}
        </div>
      </div>
      <div className="mt-0.5 truncate text-[9px] text-muted-foreground/55">{channel.topic}</div>
    </button>
  );
}

function DirectRow({ dm }: { dm: DirectMessage }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded border border-transparent px-2.5 py-1.5 text-left transition-colors hover:border-border/50 hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#bfd4ef]/20"
    >
      <div className="relative shrink-0">
        <div className="flex size-6 items-center justify-center rounded-sm bg-muted font-mono text-[9px] tracking-wider">
          {dm.initials}
        </div>
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 size-2 rounded-full border border-background",
            presenceDot[dm.presence],
          )}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span className="min-w-0 truncate text-[11px] text-foreground/85">{dm.name}</span>
          <span className="ml-auto shrink-0 font-mono text-[9px] text-muted-foreground/40 tabular-nums">{dm.time}</span>
        </div>
        <span className="truncate text-[9px] text-muted-foreground/55">{dm.preview}</span>
      </div>
      {dm.unread > 0 && (
        <span className="shrink-0 rounded bg-[#bfd4ef]/15 px-1 font-mono text-[#bfd4ef] text-[9px] tabular-nums">
          {dm.unread}
        </span>
      )}
    </button>
  );
}

type ChatChannelsProps = {
  selectedChannelId: ChannelId;
  onSelectChannel: (id: ChannelId) => void;
};

export function ChatChannels({ selectedChannelId, onSelectChannel }: ChatChannelsProps) {
  const totalUnread = channels.reduce((acc, c) => acc + c.unread, 0) + directMessages.reduce((a, d) => a + d.unread, 0);

  return (
    <Card className="h-full rounded-none ring-0">
      <CardHeader className="px-3 py-2">
        <CardTitle className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
          Channels
          {totalUnread > 0 && (
            <span className="ml-2 rounded bg-[#bfd4ef]/10 px-1.5 py-0.5 font-mono text-[#bfd4ef] text-[8px] normal-case tracking-normal">
              {totalUnread} unread
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-1.5 overflow-hidden px-0">
        <div className="px-3">
          <InputGroup className="h-6">
            <InputGroupInput
              className="h-6 text-[10px]"
              aria-label="Search channels"
              placeholder="Search channels..."
            />
            <InputGroupAddon>
              <Search className="size-3" />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <ScrollArea className="h-0 flex-1">
          <div className="flex flex-col gap-0.5 px-2.5 pb-3">
            {channels.map((channel) => (
              <ChannelRow
                key={channel.id}
                channel={channel}
                active={channel.id === selectedChannelId}
                onSelect={onSelectChannel}
              />
            ))}

            <div className="mt-3 mb-1 px-1 text-[8px] text-muted-foreground uppercase tracking-[0.15em]">
              Direct Messages
            </div>
            {directMessages.map((dm) => (
              <DirectRow key={dm.id} dm={dm} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
