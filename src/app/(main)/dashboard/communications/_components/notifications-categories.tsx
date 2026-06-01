"use client";

import { Bell } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { categoryMeta, categoryOrder, type NotificationCategory, notifications } from "./notifications-data";
import { categoryIcon } from "./notifications-meta";

export type CategoryFilter = NotificationCategory | "all";

function unreadFor(category: NotificationCategory) {
  return notifications.filter((n) => n.category === category && !n.read).length;
}

function CategoryRow({
  id,
  label,
  active,
  onSelect,
}: {
  id: CategoryFilter;
  label: string;
  active: boolean;
  onSelect: (id: CategoryFilter) => void;
}) {
  const Icon = id === "all" ? Bell : categoryIcon[id];
  const unread = id === "all" ? notifications.filter((n) => !n.read).length : unreadFor(id);
  const total = id === "all" ? notifications.length : notifications.filter((n) => n.category === id).length;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={(e) => {
        e.currentTarget.blur();
        onSelect(id);
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded border px-2.5 py-2 text-left transition-colors",
        "hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#bfd4ef]/20",
        active ? "border-[#bfd4ef]/30 bg-[#bfd4ef]/[0.04]" : "border-transparent",
      )}
    >
      <Icon className={cn("size-3.5 shrink-0", active ? "text-[#bfd4ef]" : "text-muted-foreground/55")} />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[11px]",
          active ? "font-medium text-[#dbd5c5]" : "text-foreground/80",
        )}
      >
        {label}
      </span>
      {unread > 0 ? (
        <span className="rounded bg-[#bfd4ef]/15 px-1 font-mono text-[#bfd4ef] text-[9px] tabular-nums">{unread}</span>
      ) : (
        <span className="font-mono text-[9px] text-muted-foreground/35 tabular-nums">{total}</span>
      )}
    </button>
  );
}

export function NotificationsCategories({
  selected,
  onSelect,
}: {
  selected: CategoryFilter;
  onSelect: (id: CategoryFilter) => void;
}) {
  const totalUnread = notifications.filter((n) => !n.read).length;

  return (
    <Card className="h-full rounded-none ring-0">
      <CardHeader className="px-3 py-2">
        <CardTitle className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
          Notifications
          {totalUnread > 0 && (
            <span className="ml-2 rounded bg-[#bfd4ef]/10 px-1.5 py-0.5 font-mono text-[#bfd4ef] text-[8px] normal-case tracking-normal">
              {totalUnread} unread
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col overflow-hidden px-0">
        <ScrollArea className="h-0 flex-1">
          <div className="flex flex-col gap-0.5 px-2.5 pb-3">
            <CategoryRow id="all" label="All Signals" active={selected === "all"} onSelect={onSelect} />
            <div className="my-1 px-1 text-[8px] text-muted-foreground uppercase tracking-[0.15em]">Categories</div>
            {categoryOrder.map((category) => (
              <CategoryRow
                key={category}
                id={category}
                label={categoryMeta[category].label}
                active={selected === category}
                onSelect={onSelect}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
