"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { EmailMessage } from "./email-data";
import { attachmentKindLabel, labelClasses } from "./email-meta";

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

export function EmailContext({ email }: { email: EmailMessage | null }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b px-3 py-2">
        <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em]">Message Context</span>
      </div>

      {email ? (
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col divide-y divide-border/40">
            {/* Linked operation */}
            {email.ref && (
              <div className="px-3 py-2">
                <SectionLabel label="Linked Operation" />
                <span className="inline-flex rounded-sm border border-[#bfd4ef]/25 bg-[#bfd4ef]/[0.06] px-1.5 py-px font-mono text-[#bfd4ef] text-[9px] tracking-wider">
                  {email.ref}
                </span>
              </div>
            )}

            {/* Labels */}
            {email.labels.length > 0 && (
              <div className="px-3 py-2">
                <SectionLabel label="Labels" count={email.labels.length} />
                <div className="flex flex-wrap gap-1">
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
              </div>
            )}

            {/* Participants */}
            <div className="px-3 py-2">
              <SectionLabel label="Participants" />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-sm bg-muted font-mono text-[8px] tracking-wider">
                    {email.from.initials}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[10px] text-foreground/85 leading-none">{email.from.name}</span>
                    <span className="truncate text-[8px] text-muted-foreground/55">{email.from.role}</span>
                  </div>
                  <span className="shrink-0 text-[8px] text-muted-foreground/45 uppercase tracking-wider">From</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-sm bg-muted/60 font-mono text-[8px] text-muted-foreground tracking-wider">
                    @
                  </div>
                  <span className="min-w-0 flex-1 truncate font-mono text-[9px] text-muted-foreground/70">
                    {email.to}
                  </span>
                  <span className="shrink-0 text-[8px] text-muted-foreground/45 uppercase tracking-wider">To</span>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {email.attachments.length > 0 && (
              <div className="px-3 py-2">
                <SectionLabel label="Attachments" count={email.attachments.length} countClass="text-[#bfd4ef]" />
                <div className="flex flex-col gap-1">
                  {email.attachments.map((att) => (
                    <div
                      key={att.name}
                      className="flex items-center gap-2 rounded border border-border/50 bg-muted/10 px-2 py-1"
                    >
                      <span className="shrink-0 rounded-sm border border-border/60 bg-muted/40 px-1 py-px font-mono text-[7px] text-muted-foreground uppercase">
                        {attachmentKindLabel[att.kind]}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[9px] text-foreground/80">{att.name}</span>
                      <span className="shrink-0 font-mono text-[8px] text-muted-foreground/50">{att.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      ) : (
        <div className="grid flex-1 place-items-center px-3 text-center text-[9px] text-muted-foreground/45 uppercase tracking-widest">
          No message selected
        </div>
      )}
    </div>
  );
}
