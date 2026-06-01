"use client";

import { Hash, Paperclip, Pin, Send, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { type ChannelId, type ChatChannel, type ChatMessage, type MessagePriority, messages } from "./chat-data";

const priorityAccent: Record<MessagePriority, string> = {
  rush: "border-[#d3410c]/60",
  alert: "border-[#f2b90e]/50",
  info: "border-[#bfd4ef]/40",
};

const priorityTag: Record<MessagePriority, { label: string; cls: string }> = {
  rush: { label: "■ RUSH", cls: "text-[#d3410c]" },
  alert: { label: "▲ ATTN", cls: "text-[#f2b90e]" },
  info: { label: "→ INFO", cls: "text-[#bfd4ef]" },
};

function MessageRow({ message }: { message: ChatMessage }) {
  return (
    <div className="flex gap-2.5 px-3 py-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-muted font-mono text-[9px] tracking-wider">
        {message.initials}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-medium text-[#dbd5c5] text-xs leading-none">{message.author}</span>
          <span className="text-[8px] text-muted-foreground/60 uppercase tracking-widest">{message.role}</span>
          <span className="font-mono text-[9px] text-muted-foreground/40 tabular-nums">{message.time}</span>
          {message.pinned && <Pin className="size-2.5 text-muted-foreground/45" />}
        </div>
        <div
          className={cn(message.priority && "border-l-2 pl-2.5", message.priority && priorityAccent[message.priority])}
        >
          {message.priority && (
            <span
              className={cn(
                "mb-0.5 block font-mono text-[8px] uppercase tracking-[0.1em]",
                priorityTag[message.priority].cls,
              )}
            >
              {priorityTag[message.priority].label}
            </span>
          )}
          <p className="text-[11px] text-foreground/85 leading-relaxed">{message.text}</p>
        </div>
        {message.ref && (
          <span className="w-fit rounded-sm border border-[#bfd4ef]/25 bg-[#bfd4ef]/[0.06] px-1.5 py-px font-mono text-[#bfd4ef] text-[9px] tracking-wider">
            {message.ref}
          </span>
        )}
      </div>
    </div>
  );
}

type ChatThreadProps = {
  channel: ChatChannel;
};

export function ChatThread({ channel }: ChatThreadProps) {
  const channelMessages = messages.filter((m) => m.channelId === (channel.id as ChannelId));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Channel header */}
      <div className="shrink-0 border-b px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Hash className="size-3.5 shrink-0 text-muted-foreground/50" />
            <span className="truncate font-medium text-[#dbd5c5] text-sm">{channel.label}</span>
            {channel.signal === "rush" && (
              <span className="shrink-0 rounded bg-[#d3410c]/10 px-1.5 py-0.5 font-mono text-[#d3410c] text-[9px] uppercase tracking-wider">
                ■ active rush
              </span>
            )}
            {channel.signal === "alert" && (
              <span className="shrink-0 rounded bg-[#f2b90e]/10 px-1.5 py-0.5 font-mono text-[#f2b90e] text-[9px] uppercase tracking-wider">
                ▲ attention
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground/60">
            <Users className="size-3" />
            <span className="font-mono text-[10px] tabular-nums">{channel.members}</span>
          </div>
        </div>
        <p className="mt-1 truncate text-[10px] text-muted-foreground/60">{channel.topic}</p>
      </div>

      {/* Message stream */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col divide-y divide-border/25 py-1">
          {channelMessages.map((message) => (
            <MessageRow key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      {/* Composer — visual only, no backend wiring */}
      <div className="shrink-0 border-t px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5">
          <Button size="icon-sm" variant="ghost" className="size-6 shrink-0" disabled aria-label="Attach file">
            <Paperclip className="size-3.5" />
          </Button>
          <input
            disabled
            aria-label={`Message #${channel.label}`}
            placeholder={`Message #${channel.label.toLowerCase()}`}
            className="min-w-0 flex-1 bg-transparent text-[11px] text-foreground/80 placeholder:text-muted-foreground/50 focus:outline-none disabled:cursor-not-allowed"
          />
          <Button
            size="icon-sm"
            variant="ghost"
            className="size-6 shrink-0 text-[#bfd4ef]"
            disabled
            aria-label="Send message"
          >
            <Send className="size-3.5" />
          </Button>
        </div>
        <p className="mt-1 px-1 text-[8px] text-muted-foreground/40 uppercase tracking-widest">
          Read-only preview · messaging not yet wired
        </p>
      </div>
    </div>
  );
}
