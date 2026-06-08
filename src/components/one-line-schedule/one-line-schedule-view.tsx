"use client";

import Link from "next/link";

import { format, parseISO } from "date-fns";
import { List, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import type { ShootDayEvent, ShootDayMarker, ShootDaySetup } from "@/types/schedule";

export type OneLinerRow = {
  id: string;
  dayNumber: number;
  date: string;
  dayType: string;
  location: string;
  secondaryLocation: string | null;
  zone: string;
  totalPages: string | null;
  splitDay: boolean;
  companyMove: boolean;
  companyMoveDestination: string | null;
  unitLabel: string;
  setups: ShootDaySetup[];
  markers: ShootDayMarker[];
  events: ShootDayEvent[];
  notes: string;
  sceneReadiness: Map<string, string>;
};

function ReadinessDot({ readiness }: { readiness: string }) {
  const color =
    readiness === "ready"
      ? "bg-emerald-500"
      : readiness === "partial"
        ? "bg-amber-500"
        : readiness === "blocked"
          ? "bg-red-500"
          : "bg-muted-foreground/30";
  return <span className={cn("inline-block size-2 rounded-full", color)} title={readiness} />;
}

export function OneLineScheduleView({
  rows,
  revisionName,
  totalDays,
  showName,
}: {
  rows: OneLinerRow[];
  revisionName: string;
  totalDays: number;
  showName?: string | null;
}) {
  if (rows.length === 0) {
    return (
      <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            {showName ? <h1 className="font-extrabold text-2xl tracking-tight">{showName}</h1> : null}
            <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
            {showName ? (
              <h2 className="text-xl tracking-tight">One-Line Schedule</h2>
            ) : (
              <h1 className="text-2xl tracking-tight">One-Line Schedule</h1>
            )}
          </div>
          <Button size="sm" asChild>
            <Link href="/ingestion/upload?kind=one-liner">
              <Upload className="mr-2 size-4" />
              Upload One-Liner
            </Link>
          </Button>
        </header>
        <Empty className="min-h-[200px] border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <List />
            </EmptyMedia>
            <EmptyTitle>No schedule imported</EmptyTitle>
            <EmptyDescription>Upload a one-liner to populate this workspace.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          {showName ? <h1 className="font-extrabold text-2xl tracking-tight">{showName}</h1> : null}
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
          {showName ? (
            <h2 className="text-xl tracking-tight">One-Line Schedule</h2>
          ) : (
            <h1 className="text-2xl tracking-tight">One-Line Schedule</h1>
          )}
          <p className="mt-1 text-muted-foreground text-sm">{revisionName || `${totalDays} shoot days`}</p>
        </div>
        <Button size="sm" asChild>
          <Link href="/ingestion/upload?kind=one-liner">
            <Upload className="mr-2 size-4" />
            Upload One-Liner
          </Link>
        </Button>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b bg-muted/30 text-left text-muted-foreground text-xs uppercase tracking-wider">
              <th className="w-12 px-2 py-2.5 text-center font-medium">Day</th>
              <th className="w-20 px-2 py-2.5 font-medium">Date</th>
              <th className="w-14 px-2 py-2.5 font-medium">Pages</th>
              <th className="px-2 py-2.5 font-medium">Scenes · Sets</th>
              <th className="w-32 px-2 py-2.5 font-medium">Location</th>
              <th className="w-24 px-2 py-2.5 font-medium">Unit</th>
              <th className="w-16 px-2 py-2.5 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <OneLinerDayRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OneLinerDayRow({ row }: { row: OneLinerRow }) {
  const dateStr = row.date ? format(parseISO(row.date), "EEE M/d") : "—";

  return (
    <tr className="group align-top hover:bg-muted/20">
      <td className="px-2 py-2 text-center font-bold font-mono tabular-nums">{row.dayNumber}</td>
      <td className="whitespace-nowrap px-2 py-2 font-mono text-xs tabular-nums">{dateStr}</td>
      <td className="whitespace-nowrap px-2 py-2 font-mono text-xs tabular-nums">{row.totalPages ?? "—"}</td>
      <td className="px-2 py-2">
        <div className="flex flex-col gap-0.5">
          {row.setups.map((setup, i) => (
            <SetupLine key={`${row.id}-${i}-${setup.setName}`} setup={setup} readiness={row.sceneReadiness} />
          ))}
        </div>
        {row.markers.length > 0 && (
          <div className="mt-1 flex flex-col gap-0.5">
            {row.markers.map((m) => (
              <span
                key={m.label}
                className={cn(
                  "font-black text-[9px] uppercase tracking-wider",
                  m.markerType === "milestone" ? "text-amber-500" : "text-muted-foreground",
                )}
              >
                {m.label}
              </span>
            ))}
          </div>
        )}
      </td>
      <td className="px-2 py-2 text-xs">
        <span>{row.location}</span>
        {row.companyMove && row.companyMoveDestination ? (
          <span className="mt-0.5 block text-[10px] text-amber-500">→ {row.companyMoveDestination}</span>
        ) : null}
        {row.splitDay ? (
          <span className="mt-0.5 block rounded bg-violet-600/20 px-1 py-px text-center font-bold text-[8px] text-violet-400 uppercase">
            SPLIT
          </span>
        ) : null}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-muted-foreground text-xs">{row.unitLabel || "—"}</td>
      <td className="px-2 py-2 text-center">
        <DayRisk setups={row.setups} readiness={row.sceneReadiness} />
      </td>
    </tr>
  );
}

function SetupLine({ setup, readiness }: { setup: ShootDaySetup; readiness: Map<string, string> }) {
  const sceneNums = setup.scenes.filter((s) => s !== "TBD");
  return (
    <div className="flex items-start gap-1.5 text-xs leading-tight">
      <span className="shrink-0 font-semibold text-muted-foreground">{setup.intExt}</span>
      <span className="font-medium">
        {setup.setName}
        {setup.subSets?.length ? ` · ${setup.subSets.join(", ")}` : ""}
      </span>
      {setup.dayNight ? <span className="shrink-0 text-[10px] text-muted-foreground">({setup.dayNight})</span> : null}
      {setup.dNumber ? <span className="shrink-0 font-mono text-[9px] text-sky-400">{setup.dNumber}</span> : null}
      {sceneNums.length > 0 ? (
        <span className="ml-auto flex shrink-0 items-center gap-1 font-mono text-[10px] text-muted-foreground">
          {sceneNums.map((sn) => {
            const norm = sn.trim().toUpperCase().replace(/\.$/, "");
            const r = readiness.get(norm) ?? "not_started";
            return (
              <span key={sn} className="inline-flex items-center gap-0.5">
                <ReadinessDot readiness={r} />
                {sn}
              </span>
            );
          })}
        </span>
      ) : null}
    </div>
  );
}

function DayRisk({ setups, readiness }: { setups: ShootDaySetup[]; readiness: Map<string, string> }) {
  const allScenes = setups.flatMap((s) => s.scenes.filter((sn) => sn !== "TBD"));
  if (allScenes.length === 0) return <span className="text-[10px] text-muted-foreground">—</span>;

  const statuses = allScenes.map((sn) => {
    const norm = sn.trim().toUpperCase().replace(/\.$/, "");
    return readiness.get(norm) ?? "not_started";
  });

  const hasBlocked = statuses.includes("blocked");
  const hasPartial = statuses.includes("partial") || statuses.includes("not_started");
  const allReady = statuses.every((s) => s === "ready");

  if (hasBlocked) {
    return <span className="rounded bg-red-500/20 px-1.5 py-0.5 font-bold text-[9px] text-red-400 uppercase">RED</span>;
  }
  if (allReady) {
    return (
      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-bold text-[9px] text-emerald-400 uppercase">
        GREEN
      </span>
    );
  }
  if (hasPartial) {
    return (
      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-bold text-[9px] text-amber-400 uppercase">
        YELLOW
      </span>
    );
  }
  return <span className="text-[10px] text-muted-foreground">—</span>;
}
