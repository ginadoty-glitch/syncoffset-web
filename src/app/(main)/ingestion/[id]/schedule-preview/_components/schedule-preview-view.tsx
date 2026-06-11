"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publishScheduleRevision } from "@/server/schedule-actions";

type ScheduleDay = {
  id: string;
  strip_position: number;
  shoot_day: string;
  day_type: string | null;
  title: string;
  notes: string | null;
};

type Revision = {
  id: string;
  revision_name: string;
  revision_scope: string;
  imported_at: string;
};

const SHADOW_JSON_PREFIX = "SYNCO_SHADOW_JSON:v1:";

function extractDayInfo(day: ScheduleDay): {
  dayNumber: number;
  scenes: string[];
  unitLabel: string | null;
} {
  const defaultInfo = { dayNumber: day.strip_position + 1, scenes: [], unitLabel: null };
  if (!day.notes) return defaultInfo;
  const idx = day.notes.indexOf(SHADOW_JSON_PREFIX);
  if (idx < 0) return defaultInfo;
  try {
    const json = day.notes.slice(idx + SHADOW_JSON_PREFIX.length).trim();
    const meta = JSON.parse(json) as {
      dayNumber?: number;
      scenes?: string[];
      unitLabel?: string | null;
    };
    return {
      dayNumber: meta.dayNumber ?? day.strip_position + 1,
      scenes: meta.scenes ?? [],
      unitLabel: meta.unitLabel ?? null,
    };
  } catch {
    return defaultInfo;
  }
}

function classifyDayType(day: ScheduleDay): string {
  const title = (day.title ?? "").toLowerCase();
  const notes = (day.notes ?? "").toLowerCase();
  const combined = `${title} ${notes}`;

  if (/\bprep\b/.test(combined)) return "Prep";
  if (/\btravel\b/.test(combined)) return "Travel";
  if (/\bwrap\b/.test(combined)) return "Wrap";
  if (/\bholiday\b/.test(combined)) return "Holiday";
  if (/\bdark\b/.test(combined)) return "Dark";
  if (/\bscout\b/.test(combined)) return "Scout";
  if (day.day_type) return "Shoot";
  return "Shoot";
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export function SchedulePreviewView({
  revision,
  days,
  sourceDocumentId,
  sourceDocumentKind,
}: {
  revision: Revision;
  days: ScheduleDay[];
  sourceDocumentId: string;
  sourceDocumentKind?: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const typeCounts: Record<string, number> = {};
  const locations = new Set<string>();
  const units = new Set<string>();

  for (const day of days) {
    const dayType = classifyDayType(day);
    typeCounts[dayType] = (typeCounts[dayType] ?? 0) + 1;
    const loc = day.title.split(" · ")[0]?.trim();
    if (loc) locations.add(loc);
    const info = extractDayInfo(day);
    if (info.unitLabel) units.add(info.unitLabel);
  }

  const isPrepSchedule = sourceDocumentKind === "prep-schedule";
  const isPublishable =
    !isPrepSchedule && (revision.revision_scope === "shared_draft" || revision.revision_scope === "local_shadow");

  const handlePublish = () => {
    startTransition(async () => {
      const result = await publishScheduleRevision(revision.id);
      if (!result.ok) {
        toast.error("error" in result ? result.error : "Publish failed");
        return;
      }
      toast.success("Schedule published to Production Calendar");
      router.push("/dashboard/production-calendar");
    });
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push(`/ingestion/${sourceDocumentId}`)}>
            ← Back to document
          </Button>
          <h1 className="mt-2 text-xl tracking-tight">Schedule Import Preview</h1>
          <p className="text-muted-foreground text-sm">
            {revision.revision_name} · {days.length} day(s) parsed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono text-[10px] uppercase">
            {revision.revision_scope}
          </Badge>
          {isPublishable && (
            <Button size="sm" disabled={pending} onClick={handlePublish}>
              {pending ? "Publishing…" : "Publish to Calendar"}
            </Button>
          )}
          {isPrepSchedule && (
            <span className="max-w-[260px] text-right text-muted-foreground text-xs">
              Prep Schedule · preview only — does not replace the shooting schedule
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(typeCounts)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([type, count]) => (
            <Card key={type}>
              <CardContent className="flex flex-col items-center py-4">
                <span className="font-bold text-2xl">{count}</span>
                <span className="text-muted-foreground text-xs uppercase tracking-wide">{type} days</span>
              </CardContent>
            </Card>
          ))}
        <Card>
          <CardContent className="flex flex-col items-center py-4">
            <span className="font-bold text-2xl">{locations.size}</span>
            <span className="text-muted-foreground text-xs uppercase tracking-wide">Locations</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center py-4">
            <span className="font-bold text-2xl">{units.size || "—"}</span>
            <span className="text-muted-foreground text-xs uppercase tracking-wide">Units</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parsed Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-2 py-1.5 font-medium">Day</th>
                  <th className="px-2 py-1.5 font-medium">Date</th>
                  <th className="px-2 py-1.5 font-medium">Type</th>
                  <th className="px-2 py-1.5 font-medium">Location</th>
                  <th className="px-2 py-1.5 font-medium">Scenes</th>
                  <th className="px-2 py-1.5 font-medium">Unit</th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => {
                  const info = extractDayInfo(day);
                  const dayType = classifyDayType(day);
                  const location = day.title.split(" · ")[0]?.trim() ?? day.title;
                  return (
                    <tr key={day.id} className="border-[var(--border)]/50 border-b">
                      <td className="px-2 py-1.5 font-mono text-xs">{info.dayNumber}</td>
                      <td className="px-2 py-1.5 text-xs">{formatDate(day.shoot_day)}</td>
                      <td className="px-2 py-1.5">
                        <Badge variant="outline" className="text-[10px]">
                          {dayType}
                        </Badge>
                      </td>
                      <td className="max-w-[200px] truncate px-2 py-1.5 text-xs">{location}</td>
                      <td className="max-w-[120px] truncate px-2 py-1.5 font-mono text-[10px]">
                        {info.scenes.length > 0 ? info.scenes.join(", ") : "—"}
                      </td>
                      <td className="px-2 py-1.5 text-xs">{info.unitLabel ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
