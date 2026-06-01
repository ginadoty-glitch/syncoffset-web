"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { categoryMeta, notifications, type Severity } from "./notifications-data";
import { severityMeta } from "./notifications-meta";

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

const severityRowOrder: Severity[] = ["critical", "attention", "info", "resolved"];
const severityRowLabel: Record<Severity, string> = {
  critical: "Critical",
  attention: "Attention",
  info: "Informational",
  resolved: "Resolved",
};

export function NotificationsDigest() {
  const actionItems = notifications.filter((n) => n.actionRequired);
  const severityCounts = severityRowOrder.map((sev) => ({
    severity: sev,
    count: notifications.filter((n) => n.severity === sev).length,
  }));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em]">Digest</span>
          {actionItems.length > 0 && (
            <span className="rounded bg-[#d3410c]/10 px-1.5 py-0.5 font-mono text-[#d3410c] text-[8px]">
              {actionItems.length} action
            </span>
          )}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col divide-y divide-border/40">
          {/* By severity */}
          <div className="px-3 py-2">
            <SectionLabel label="By Severity" />
            <div className="flex flex-col gap-1">
              {severityCounts.map(({ severity, count }) => {
                const meta = severityMeta[severity];
                return (
                  <div key={severity} className="flex items-center gap-2">
                    <span className={cn("size-1.5 rounded-full", meta.dot)} />
                    <span className="text-[9px] text-muted-foreground/80">{severityRowLabel[severity]}</span>
                    <span
                      className={cn(
                        "ml-auto font-mono text-[9px] tabular-nums",
                        count > 0 ? meta.text : "text-muted-foreground/40",
                      )}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Needs action */}
          {actionItems.length > 0 && (
            <div className="px-3 py-2">
              <SectionLabel label="Needs Action" count={actionItems.length} countClass="text-[#d3410c]" />
              <div className="flex flex-col gap-1">
                {actionItems.map((item) => {
                  const meta = severityMeta[item.severity];
                  return (
                    <div key={item.id} className={cn("border-l-2 py-1 pl-2", meta.border)}>
                      <div className="flex items-baseline justify-between gap-1.5">
                        <span className="text-[8px] text-muted-foreground uppercase tracking-wider">
                          {categoryMeta[item.category].label}
                        </span>
                        <span className="font-mono text-[8px] text-muted-foreground/45 tabular-nums">{item.time}</span>
                      </div>
                      <div className="line-clamp-2 text-[9px] text-[#dbd5c5] leading-snug">{item.title}</div>
                      {item.ref && <span className="font-mono text-[8px] text-[#bfd4ef]/70">{item.ref}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
