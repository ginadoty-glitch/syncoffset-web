"use client";

import { Archive, FileDown, Forward, Globe, type LucideIcon, Mail, Paperclip } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { BrokerageDoc, BrokerageEvent } from "./brokerage-data";
import { attachmentKindLabel, docTypeMeta, signalMeta, statusMeta } from "./brokerage-meta";

const eventDot: Record<BrokerageEvent["type"], string> = {
  created: "bg-[#bfd4ef]",
  sent: "bg-[#bfd4ef]",
  clearance: "bg-[#47AE90]",
  amended: "bg-[#4a7fa5]",
  attachment: "bg-muted-foreground",
  correspondence: "bg-[#f2b90e]",
  archived: "bg-border",
};

function EmptyDetail() {
  return (
    <div className="grid h-full place-items-center text-[11px] text-muted-foreground uppercase tracking-widest">
      Select a document to view brokerage detail.
    </div>
  );
}

function ActionButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled
      className="h-7 gap-1.5 border-border/60 px-2 text-[10px] text-muted-foreground"
    >
      <Icon className="size-3" />
      {label}
    </Button>
  );
}

export function BrokerageDetail({ doc }: { doc: BrokerageDoc | null }) {
  if (!doc) {
    return <EmptyDetail />;
  }

  const TypeIcon = docTypeMeta[doc.type].icon;
  const status = statusMeta[doc.status];
  const signal = signalMeta[doc.signal];
  const showBanner = doc.signal === "blocker" || doc.signal === "attention";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b px-3 py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] tabular-nums tracking-wider">{doc.id}</span>
              <Badge variant="outline" className="gap-1.5 text-[10px] text-muted-foreground">
                <TypeIcon className="size-3" />
                {docTypeMeta[doc.type].label}
              </Badge>
              <Badge variant="outline" className={cn("gap-1.5 text-[10px]", status.badge)}>
                <span className="size-1.5 rounded-full bg-current" />
                {status.label}
              </Badge>
            </div>
            <div className="truncate font-medium text-[#dbd5c5] text-xs">{doc.title}</div>
            <div className="text-[10px] text-muted-foreground">
              {doc.broker.company}
              {doc.valueDisplay && <span className="ml-2 font-mono text-muted-foreground/70">{doc.valueDisplay}</span>}
            </div>
          </div>
          <div className="shrink-0 text-right">
            {doc.linkedOrder && (
              <span className="rounded-sm border border-[#bfd4ef]/20 bg-[#bfd4ef]/[0.05] px-1.5 py-0.5 font-mono text-[#bfd4ef]/80 text-[9px] tracking-wider">
                {doc.linkedOrder}
              </span>
            )}
            <div className="mt-1 font-mono text-[9px] text-muted-foreground/55 tabular-nums">{doc.created}</div>
          </div>
        </div>
      </div>

      {/* Action bar — visual only, no backend wiring */}
      <div className="shrink-0 border-b px-3 py-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <ActionButton icon={FileDown} label="Generate PDF" />
          <ActionButton icon={Mail} label="Email Broker" />
          <ActionButton icon={Forward} label="Forward" />
          <ActionButton icon={Paperclip} label="Attach" />
          <ActionButton icon={Archive} label="Archive" />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col divide-y divide-border/30">
          {/* Signal banner */}
          {showBanner && (
            <div className="px-3 py-2.5">
              <div
                className={cn(
                  "border-l-2 py-1.5 pl-2.5",
                  doc.signal === "blocker" ? "border-[#d3410c]/60 bg-[#d3410c]/[0.04]" : "border-[#f2b90e]/50",
                )}
              >
                <span className={cn("font-mono text-[9px] uppercase tracking-[0.1em]", signal.text)}>{signal.tag}</span>
                <p className="mt-0.5 text-[10px] text-muted-foreground/75 leading-snug">{doc.summary}</p>
              </div>
            </div>
          )}

          {/* Summary (when no banner) */}
          {!showBanner && (
            <div className="px-3 py-2.5">
              <div className="mb-1 text-[8px] text-muted-foreground uppercase tracking-[0.15em]">Summary</div>
              <p className="text-[11px] text-foreground/80 leading-relaxed">{doc.summary}</p>
            </div>
          )}

          {/* Routing */}
          <div className="px-3 py-2.5">
            <div className="mb-1.5 text-[8px] text-muted-foreground uppercase tracking-[0.15em]">Routing & Broker</div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-mono text-[10px] text-muted-foreground/70">{doc.origin.code}</span>
              <span className="text-muted-foreground/40">→</span>
              <span className="font-medium font-mono text-[#dbd5c5] text-[10px]">{doc.destination.code}</span>
              <span className="text-[10px] text-muted-foreground/60">
                {doc.origin.country} → {doc.destination.country}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <Globe className="size-3 shrink-0 text-muted-foreground/50" />
              <span className="text-[10px] text-foreground/80">{doc.broker.name}</span>
              <span className="font-mono text-[9px] text-muted-foreground/55">{doc.broker.email}</span>
            </div>
          </div>

          {/* Key fields */}
          <div className="px-3 py-2.5">
            <div className="mb-1.5 text-[8px] text-muted-foreground uppercase tracking-[0.15em]">Document Fields</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {doc.fields.map((field) => (
                <div key={field.label} className="flex flex-col gap-0.5">
                  <span className="text-[8px] text-muted-foreground/55 uppercase tracking-wider">{field.label}</span>
                  <span className="text-[#dbd5c5]/85 text-[10px] leading-snug">{field.value}</span>
                </div>
              ))}
              {doc.expiry && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] text-muted-foreground/55 uppercase tracking-wider">
                    Validity / Expiry
                  </span>
                  <span
                    className={cn(
                      "text-[10px] leading-snug",
                      doc.expiresInDays !== undefined && doc.expiresInDays <= 14
                        ? "text-[#f2b90e]"
                        : "text-[#dbd5c5]/85",
                    )}
                  >
                    {doc.expiry}
                    {doc.expiresInDays !== undefined && (
                      <span className="ml-1 font-mono text-[9px]">({doc.expiresInDays}d)</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tabbed history / attachments */}
          <div className="px-3 pb-3">
            <Tabs defaultValue="history" className="w-full">
              <TabsList
                className="h-7 w-full justify-start gap-0 border-b px-0 pb-0 **:data-[slot=tabs-trigger]:text-[10px]"
                variant="line"
              >
                <TabsTrigger className="h-7 flex-none px-3" value="history">
                  History
                </TabsTrigger>
                <TabsTrigger className="h-7 flex-none px-3" value="attachments">
                  Attachments ({doc.attachments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent className="pt-2" value="history">
                <div className="flex flex-col">
                  {doc.history.map((event, i) => (
                    <div key={`${event.time}-${i}`} className="flex gap-2.5 py-2 first:pt-0">
                      <div className="flex shrink-0 flex-col items-center pt-1">
                        <div className={cn("size-1.5 shrink-0 rounded-full", eventDot[event.type])} />
                        {i < doc.history.length - 1 && <div className="mt-1 min-h-4 w-px flex-1 bg-border/60" />}
                      </div>
                      <div className="flex min-w-0 flex-col gap-0.5 pb-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-[#dbd5c5] text-[11px] leading-none">{event.action}</span>
                          <span className="font-mono text-[9px] text-muted-foreground/45 tabular-nums">
                            {event.time}
                          </span>
                        </div>
                        <span className="text-[9px] text-muted-foreground/60">{event.actor}</span>
                        {event.note && <span className="text-[9px] text-muted-foreground/50 italic">{event.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent className="pt-2" value="attachments">
                {doc.attachments.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {doc.attachments.map((att) => (
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
                ) : (
                  <div className="py-4 text-center text-[9px] text-muted-foreground/45 uppercase tracking-widest">
                    No supporting files attached
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
