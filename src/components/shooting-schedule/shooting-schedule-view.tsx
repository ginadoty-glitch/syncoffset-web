"use client";

import Link from "next/link";

import { format, parseISO } from "date-fns";
import { CalendarDays, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

type ScheduleDay = {
  id: string;
  strip_position: number;
  shoot_day: string;
  day_type: string | null;
  title: string;
  notes: string | null;
};

export function ShootingScheduleView({ days }: { days: ScheduleDay[] }) {
  if (days.length === 0) {
    return (
      <Empty className="min-h-[200px] border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarDays />
          </EmptyMedia>
          <EmptyTitle>No schedule imported</EmptyTitle>
          <EmptyDescription>
            Upload a shooting schedule (PDF, CSV, or XLSX) to populate this workspace.
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/ingestion/upload?kind=shoot-schedule">
            <Upload className="mr-2 size-4" />
            Upload Schedule
          </Link>
        </Button>
      </Empty>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-border border-b bg-muted/30 text-left text-muted-foreground text-xs uppercase tracking-wider">
            <th className="px-3 py-2.5 font-medium">Day</th>
            <th className="px-3 py-2.5 font-medium">Date</th>
            <th className="px-3 py-2.5 font-medium">Type</th>
            <th className="px-3 py-2.5 font-medium">Location · Description</th>
            <th className="px-3 py-2.5 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {days.map((d) => {
            const dateStr = d.shoot_day ? format(parseISO(d.shoot_day), "EEE, MMM d, yyyy") : "—";
            return (
              <tr key={d.id} className="hover:bg-muted/20">
                <td className="whitespace-nowrap px-3 py-2.5 font-mono font-semibold tabular-nums">
                  {d.strip_position + 1}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">{dateStr}</td>
                <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs">{d.day_type ?? "—"}</td>
                <td className="max-w-[400px] truncate px-3 py-2.5">{d.title}</td>
                <td className="max-w-[300px] truncate px-3 py-2.5 text-muted-foreground text-xs">{d.notes ?? ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
