"use client";

import { Archive, Forward, Paperclip, Reply, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { EmailMessage } from "./email-data";
import { attachmentKindLabel, labelClasses } from "./email-meta";

function EmptyReader() {
  return (
    <div className="grid h-full place-items-center text-[11px] text-muted-foreground uppercase tracking-widest">
      Select a message to read.
    </div>
  );
}

export function EmailReader({ email }: { email: EmailMessage | null }) {
  if (!email) {
    return <EmptyReader />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Subject + action bar */}
      <div className="shrink-0 border-b px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              {email.priority === "rush" && (
                <span className="rounded bg-[#d3410c]/10 px-1.5 py-0.5 font-mono text-[#d3410c] text-[9px] uppercase tracking-wider">
                  ■ rush
                </span>
              )}
              {email.priority === "attention" && (
                <span className="rounded bg-[#f2b90e]/10 px-1.5 py-0.5 font-mono text-[#f2b90e] text-[9px] uppercase tracking-wider">
                  ▲ attention
                </span>
              )}
              {email.labels.map((label) => (
                <span
                  key={label}
                  className={cn(
                    "rounded-sm border px-1 py-px font-mono text-[8px] uppercase tracking-wider",
                    labelClasses[label],
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
            <h1 className="font-medium text-[#dbd5c5] text-sm leading-snug">{email.subject}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button size="icon-sm" variant="ghost" className="size-7" disabled aria-label="Reply">
              <Reply className="size-3.5" />
            </Button>
            <Button size="icon-sm" variant="ghost" className="size-7" disabled aria-label="Forward">
              <Forward className="size-3.5" />
            </Button>
            <Button size="icon-sm" variant="ghost" className="size-7" disabled aria-label="Archive">
              <Archive className="size-3.5" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className={cn("size-7", email.starred && "text-[#f2b90e]")}
              disabled
              aria-label="Star"
            >
              <Star className={cn("size-3.5", email.starred && "fill-current")} />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col">
          {/* Sender row */}
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-muted font-mono text-[11px] tracking-wider">
              {email.from.initials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-[#dbd5c5] text-xs">{email.from.name}</span>
                <span className="text-[8px] text-muted-foreground/60 uppercase tracking-widest">{email.from.role}</span>
              </div>
              <span className="truncate font-mono text-[10px] text-muted-foreground/65">{email.from.email}</span>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-mono text-[10px] text-muted-foreground tabular-nums">{email.time}</div>
              <div className="text-[9px] text-muted-foreground/50">{email.date}</div>
            </div>
          </div>

          {/* To line */}
          <div className="border-b px-4 py-2 text-[9px] text-muted-foreground/55">
            to <span className="font-mono text-muted-foreground/75">{email.to}</span>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-3 px-4 py-4">
            {email.body.map((para, i) => (
              <p key={`${email.id}-p${i}`} className="text-[12px] text-foreground/85 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Attachments */}
          {email.attachments.length > 0 && (
            <div className="border-t px-4 py-3">
              <div className="mb-2 text-[8px] text-muted-foreground uppercase tracking-[0.15em]">
                Attachments ({email.attachments.length})
              </div>
              <div className="flex flex-col gap-1.5">
                {email.attachments.map((att) => (
                  <div
                    key={att.name}
                    className="flex items-center gap-2.5 rounded border border-border/50 bg-muted/15 px-2.5 py-1.5"
                  >
                    <Paperclip className="size-3.5 shrink-0 text-muted-foreground/55" />
                    <span className="min-w-0 flex-1 truncate text-[10px] text-foreground/80">{att.name}</span>
                    <span className="shrink-0 font-mono text-[8px] text-muted-foreground/50">{att.size}</span>
                    <span className="shrink-0 rounded-sm border border-border/60 bg-muted/40 px-1 py-px font-mono text-[8px] text-muted-foreground uppercase">
                      {attachmentKindLabel[att.kind]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
