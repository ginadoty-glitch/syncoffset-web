"use client";

import { format, parseISO } from "date-fns";
import { ClipboardList } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

type PrepTask = {
  id: string;
  title: string;
  notes: string | null;
  status: string | null;
  priority: string | null;
  due_at: string | null;
  assignee_name: string | null;
};

function StatusPill({ status }: { status: string | null }) {
  const s = status ?? "open";
  const color =
    s === "done"
      ? "bg-emerald-500/20 text-emerald-400"
      : s === "in_progress"
        ? "bg-amber-500/20 text-amber-400"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${color}`}>
      {s.replace("_", " ")}
    </span>
  );
}

function PriorityDot({ priority }: { priority: string | null }) {
  const p = priority ?? "normal";
  if (p === "high") return <span className="inline-block size-2 rounded-full bg-red-400" title="High priority" />;
  return null;
}

export function PrepMemoView({ tasks }: { tasks: PrepTask[] }) {
  if (tasks.length === 0) {
    return (
      <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <header>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
          <h1 className="text-2xl tracking-tight">Prep Memo</h1>
        </header>
        <Empty className="min-h-[200px] border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardList />
            </EmptyMedia>
            <EmptyTitle>No prep tasks</EmptyTitle>
            <EmptyDescription>Import a prep schedule to populate this workspace.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
        <h1 className="text-2xl tracking-tight">Prep Memo</h1>
        <p className="text-muted-foreground mt-1 text-sm">{tasks.length} prep tasks</p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b bg-muted/30 text-left text-muted-foreground text-xs uppercase tracking-wider">
              <th className="w-10 px-3 py-2.5 font-medium" />
              <th className="px-3 py-2.5 font-medium">Time</th>
              <th className="px-3 py-2.5 font-medium">Task</th>
              <th className="px-3 py-2.5 font-medium">Assignee</th>
              <th className="px-3 py-2.5 font-medium">Notes</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.map((t) => {
              const time = t.due_at ? format(parseISO(t.due_at), "HH:mm") : "—";
              const date = t.due_at ? format(parseISO(t.due_at), "MMM d") : "";
              return (
                <tr key={t.id} className="hover:bg-muted/20">
                  <td className="px-3 py-2.5 text-center">
                    <PriorityDot priority={t.priority} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs tabular-nums">
                    <span className="text-muted-foreground">{date}</span> {time}
                  </td>
                  <td className="max-w-[350px] truncate px-3 py-2.5 font-medium">{t.title}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{t.assignee_name ?? "—"}</td>
                  <td className="max-w-[280px] truncate px-3 py-2.5 text-muted-foreground text-xs">{t.notes ?? ""}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <StatusPill status={t.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
