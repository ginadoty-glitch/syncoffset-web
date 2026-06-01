"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
  type ChannelId,
  type ChatChannel,
  channelLinkedRefs,
  channelMembers,
  messages,
  type Presence,
} from "./chat-data";

const presenceDot: Record<Presence, string> = {
  "on-shift": "bg-[#47AE90]",
  standby: "bg-[#f2b90e]",
  wrapped: "bg-border",
};

const presenceLabel: Record<Presence, string> = {
  "on-shift": "On Shift",
  standby: "Standby",
  wrapped: "Wrapped",
};

function SectionLabel({ label, count, countClass }: { label: string; count?: number; countClass?: string }) {
  return (
    <div className="mb-1.5 flex items-center justify-between">
      <span className="text-[8px] text-muted-foreground uppercase tracking-[0.15em]">{label}</span>
      {count !== undefined && (
        <span className={cn("font-mono text-[8px]", countClass ?? "text-muted-foreground")}>{count}</span>
      )}
    </div>
  );
}

export function ChatContext({ channel }: { channel: ChatChannel }) {
  const members = channelMembers[channel.id as ChannelId] ?? [];
  const linkedRefs = channelLinkedRefs[channel.id as ChannelId] ?? [];
  const pinned = messages.filter((m) => m.channelId === channel.id && m.pinned);
  const onShift = members.filter((m) => m.presence === "on-shift").length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em]">Channel Info</span>
          <span className="font-mono text-[8px] text-[#47AE90]">{onShift} on shift</span>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col divide-y divide-border/40">
          {/* Linked operations */}
          {linkedRefs.length > 0 && (
            <div className="px-3 py-2">
              <SectionLabel label="Linked Operations" count={linkedRefs.length} countClass="text-[#bfd4ef]" />
              <div className="flex flex-wrap gap-1">
                {linkedRefs.map((ref) => (
                  <span
                    key={ref}
                    className="rounded-sm border border-[#bfd4ef]/25 bg-[#bfd4ef]/[0.06] px-1.5 py-px font-mono text-[#bfd4ef] text-[9px] tracking-wider"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pinned */}
          {pinned.length > 0 && (
            <div className="px-3 py-2">
              <SectionLabel label="Pinned" count={pinned.length} countClass="text-[#f2b90e]" />
              <div className="flex flex-col gap-1">
                {pinned.map((m) => (
                  <div key={m.id} className="rounded border border-border/50 bg-muted/10 px-2 py-1">
                    <div className="flex items-baseline justify-between gap-1.5">
                      <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider">
                        {m.author}
                      </span>
                      <span className="font-mono text-[8px] text-muted-foreground/50 tabular-nums">{m.time}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[9px] text-muted-foreground/80 leading-snug">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          <div className="px-3 py-2">
            <SectionLabel label="Members" count={members.length} />
            <div className="flex flex-col gap-1">
              {members.map((member) => (
                <div key={member.name} className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <div className="flex size-6 items-center justify-center rounded-sm bg-muted font-mono text-[8px] tracking-wider">
                      {member.initials}
                    </div>
                    <span
                      className={cn(
                        "absolute -right-0.5 -bottom-0.5 size-2 rounded-full border border-background",
                        presenceDot[member.presence],
                      )}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[10px] text-foreground/85 leading-none">{member.name}</span>
                    <span className="truncate text-[8px] text-muted-foreground/55">{member.role}</span>
                  </div>
                  <span className="shrink-0 text-[8px] text-muted-foreground/45 uppercase tracking-wider">
                    {presenceLabel[member.presence]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
