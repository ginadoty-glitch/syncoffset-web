"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { brokerageDocs } from "./brokerage-data";
import { docTypeMeta } from "./brokerage-meta";

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

export function BrokerageIntelligence({
  selectedDocId,
  onSelectDoc,
}: {
  selectedDocId: string | null;
  onSelectDoc: (id: string) => void;
}) {
  const awaiting = brokerageDocs.filter((d) => d.status === "awaiting-clearance");
  const held = brokerageDocs.filter((d) => d.status === "held");
  const cleared = brokerageDocs.filter((d) => d.status === "cleared");

  const actionRequired = brokerageDocs
    .filter((d) => d.signal === "blocker" || (d.priority && d.status === "awaiting-clearance"))
    .slice(0, 5);

  const expiringCarnets = brokerageDocs
    .filter((d) => d.type === "carnet" && d.expiresInDays !== undefined)
    .sort((a, b) => (a.expiresInDays ?? 0) - (b.expiresInDays ?? 0));

  const brokerThreads = brokerageDocs.filter((d) => d.type === "broker-correspondence");
  const drafts = brokerageDocs.filter((d) => d.status === "draft");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em]">Brokerage</span>
          {held.length > 0 && (
            <span className="rounded bg-[#d3410c]/10 px-1.5 py-0.5 font-mono text-[#d3410c] text-[8px]">
              {held.length} held
            </span>
          )}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col divide-y divide-border/40">
          {/* Clearance status */}
          <div className="px-3 py-2">
            <SectionLabel label="Clearance Status" />
            <div className="grid grid-cols-3 gap-1.5">
              {[
                {
                  label: "Awaiting",
                  count: awaiting.length,
                  cls: "text-[#f2b90e]",
                  border: "border-[#f2b90e]/25 bg-[#f2b90e]/[0.05]",
                },
                {
                  label: "Held",
                  count: held.length,
                  cls: "text-[#d3410c]",
                  border: "border-[#d3410c]/25 bg-[#d3410c]/[0.05]",
                },
                {
                  label: "Cleared",
                  count: cleared.length,
                  cls: "text-[#47AE90]",
                  border: "border-[#47AE90]/25 bg-[#47AE90]/[0.05]",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={cn("flex flex-col items-center rounded border px-1 py-1.5", stat.border)}
                >
                  <span className={cn("font-mono text-sm tabular-nums", stat.cls)}>{stat.count}</span>
                  <span className="text-[7px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action required */}
          {actionRequired.length > 0 && (
            <div className="px-3 py-2">
              <SectionLabel label="Action Required" count={actionRequired.length} countClass="text-[#d3410c]" />
              <div className="flex flex-col gap-0.5">
                {actionRequired.map((d) => {
                  const isBlocker = d.signal === "blocker";
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => onSelectDoc(d.id)}
                      className={cn(
                        "border-l-2 py-1 pl-2 text-left transition-colors",
                        isBlocker ? "border-[#d3410c]/50" : "border-[#f2b90e]/45",
                        d.id === selectedDocId && "bg-[#bfd4ef]/[0.04]",
                      )}
                    >
                      <div className="flex items-baseline justify-between gap-1.5">
                        <span className="font-mono text-[#dbd5c5] text-[9px] tracking-wider">{d.id}</span>
                        <span className={cn("font-mono text-[8px]", isBlocker ? "text-[#d3410c]" : "text-[#f2b90e]")}>
                          {isBlocker ? "■ held" : "▲ awaiting"}
                        </span>
                      </div>
                      <div className="truncate text-[9px] text-muted-foreground/65">{d.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expiring carnets */}
          {expiringCarnets.length > 0 && (
            <div className="px-3 py-2">
              <SectionLabel label="Carnet Expiry Watch" count={expiringCarnets.length} countClass="text-[#f2b90e]" />
              <div className="flex flex-col gap-0.5">
                {expiringCarnets.map((d) => {
                  const urgent = (d.expiresInDays ?? 99) <= 14;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => onSelectDoc(d.id)}
                      className={cn(
                        "rounded border px-2 py-1 text-left transition-colors",
                        urgent ? "border-[#f2b90e]/30 bg-[#f2b90e]/[0.05]" : "border-border/50 bg-muted/10",
                        d.id === selectedDocId && "ring-1 ring-[#bfd4ef]/15",
                      )}
                    >
                      <div className="flex items-baseline justify-between gap-1.5">
                        <span className="font-mono text-[#dbd5c5] text-[9px] tracking-wider">{d.id}</span>
                        <span
                          className={cn(
                            "font-mono text-[8px] tabular-nums",
                            urgent ? "text-[#f2b90e]" : "text-muted-foreground",
                          )}
                        >
                          {d.expiresInDays}d
                        </span>
                      </div>
                      <div className="truncate text-[9px] text-muted-foreground/65">{d.expiry}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Broker threads */}
          {brokerThreads.length > 0 && (
            <div className="px-3 py-2">
              <SectionLabel label="Broker Threads" count={brokerThreads.length} countClass="text-[#bfd4ef]" />
              <div className="flex flex-col gap-0.5">
                {brokerThreads.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onSelectDoc(d.id)}
                    className={cn(
                      "rounded border border-border/50 bg-muted/10 px-2 py-1 text-left transition-colors hover:bg-muted/20",
                      d.id === selectedDocId && "border-[#bfd4ef]/30 bg-[#bfd4ef]/[0.04]",
                    )}
                  >
                    <div className="truncate text-[9px] text-[#dbd5c5]/85">{d.broker.company}</div>
                    <div className="truncate text-[9px] text-muted-foreground/60">{d.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Drafts pending */}
          {drafts.length > 0 && (
            <div className="px-3 py-2">
              <SectionLabel label="Drafts · Unsent" count={drafts.length} />
              <div className="flex flex-col gap-0.5">
                {drafts.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onSelectDoc(d.id)}
                    className={cn(
                      "flex items-center gap-1.5 py-1 text-left transition-colors",
                      d.id === selectedDocId && "opacity-100",
                    )}
                  >
                    <span className="font-mono text-[9px] text-muted-foreground/70 tracking-wider">{d.id}</span>
                    <span className="truncate text-[9px] text-muted-foreground/55">{docTypeMeta[d.type].short}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
