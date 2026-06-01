"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { CategoryFilter } from "./notifications-categories";
import { categoryMeta, type NotificationItem, notifications } from "./notifications-data";
import { categoryIcon, severityMeta } from "./notifications-meta";

function NotificationRow({ item }: { item: NotificationItem }) {
  const meta = severityMeta[item.severity];
  const Icon = categoryIcon[item.category];

  return (
    <div
      className={cn("border-l-2 px-3 py-2.5 transition-colors", meta.border, meta.bg, !item.read && "bg-muted/[0.04]")}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("size-3 shrink-0", meta.text)} />
        <span className={cn("font-mono text-[8px] uppercase tracking-[0.1em]", meta.text)}>{meta.tag}</span>
        <span className="text-[8px] text-muted-foreground/55 uppercase tracking-widest">
          {categoryMeta[item.category].label}
        </span>
        {item.actionRequired && (
          <span className="rounded-sm bg-[#d3410c]/10 px-1 py-px font-mono text-[#d3410c] text-[7px] uppercase tracking-wider">
            Action
          </span>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {!item.read && <span className="size-1.5 rounded-full bg-[#bfd4ef]" />}
          <span className="font-mono text-[9px] text-muted-foreground/45 tabular-nums">{item.time}</span>
        </div>
      </div>
      <div className="mt-1 font-medium text-[#dbd5c5] text-[11px] leading-snug">{item.title}</div>
      <p className="mt-0.5 text-[10px] text-muted-foreground/70 leading-relaxed">{item.detail}</p>
      {item.ref && (
        <span className="mt-1.5 inline-flex rounded-sm border border-[#bfd4ef]/25 bg-[#bfd4ef]/[0.06] px-1.5 py-px font-mono text-[#bfd4ef] text-[9px] tracking-wider">
          {item.ref}
        </span>
      )}
    </div>
  );
}

export function NotificationsFeed({ filter }: { filter: CategoryFilter }) {
  const items = notifications.filter((n) => filter === "all" || n.category === filter);
  const heading = filter === "all" ? "All Signals" : categoryMeta[filter].label;
  const actionCount = items.filter((n) => n.actionRequired).length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-[#dbd5c5] text-sm">{heading}</span>
          <div className="flex items-center gap-2">
            {actionCount > 0 && (
              <span className="rounded bg-[#d3410c]/10 px-1.5 py-0.5 font-mono text-[#d3410c] text-[9px] uppercase tracking-wider">
                {actionCount} action
              </span>
            )}
            <span className="font-mono text-[10px] text-muted-foreground/50 tabular-nums">{items.length}</span>
          </div>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col divide-y divide-border/25">
          {items.length > 0 ? (
            items.map((item) => <NotificationRow key={item.id} item={item} />)
          ) : (
            <div className="grid place-items-center py-16 text-[10px] text-muted-foreground/45 uppercase tracking-widest">
              No notifications
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
