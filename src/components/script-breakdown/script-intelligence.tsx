"use client";

import { useMemo, useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import type { ScriptHubSceneRow } from "@/lib/script-hub/types";
import { cn } from "@/lib/utils";

type SceneData = Pick<
  ScriptHubSceneRow,
  "scene_number" | "scene_heading" | "location_name" | "time_of_day" | "sort_order" | "breakdown_draft"
>;

function intExtFromHeading(heading: string): string | null {
  const m = heading.match(/^(?:\*+\s*)?(INT\.?\/?EXT\.?|EXT\.?\/?INT\.?|INT\.?|EXT\.?)\s/i);
  if (!m) return null;
  const tag = m[1].replace(/\./g, "").toUpperCase();
  if (tag.includes("/")) return "INT/EXT";
  return tag.startsWith("INT") ? "INT" : tag.startsWith("EXT") ? "EXT" : null;
}

function classifyTime(tod: string | null): "day" | "night" | "continuous" | "other" {
  const t = (tod ?? "").toUpperCase().trim();
  if (t === "DAY" || t === "MORNING" || t === "AFTERNOON" || t === "DAWN" || t === "SUNRISE") return "day";
  if (t === "NIGHT" || t === "DUSK" || t === "EVENING") return "night";
  if (t === "CONTINUOUS" || t === "SAME" || t === "SAME TIME" || t === "MOMENTS LATER" || t === "LATER")
    return "continuous";
  return "other";
}

function computeIntelligence(scenes: SceneData[]) {
  const sorted = [...scenes].sort((a, b) => a.sort_order - b.sort_order);

  let intCount = 0;
  let extCount = 0;
  let intExtCount = 0;
  let dayCount = 0;
  let nightCount = 0;
  let continuousCount = 0;

  const locationCounts = new Map<string, number>();
  const locationIE = new Map<string, Set<string>>();
  const allCharacters = new Map<string, number>();

  for (const s of sorted) {
    const ie =
      ((s.breakdown_draft as Record<string, unknown>)?.int_ext as string) ?? intExtFromHeading(s.scene_heading);
    const ieNorm = (ie ?? "").toUpperCase();
    if (ieNorm.includes("/")) intExtCount++;
    else if (ieNorm.startsWith("INT")) intCount++;
    else if (ieNorm.startsWith("EXT")) extCount++;

    const timeClass = classifyTime(s.time_of_day);
    if (timeClass === "day") dayCount++;
    else if (timeClass === "night") nightCount++;
    else if (timeClass === "continuous") continuousCount++;

    if (s.location_name) {
      locationCounts.set(s.location_name, (locationCounts.get(s.location_name) ?? 0) + 1);
      if (!locationIE.has(s.location_name)) locationIE.set(s.location_name, new Set());
      if (ieNorm)
        locationIE
          .get(s.location_name)
          ?.add(ieNorm.includes("/") ? "INT/EXT" : ieNorm.startsWith("INT") ? "INT" : "EXT");
    }

    const bd = s.breakdown_draft as Record<string, unknown> | null;
    const chars = bd?.characters;
    if (Array.isArray(chars)) {
      for (const c of chars) {
        const name = typeof c === "string" ? c : String(c);
        allCharacters.set(name, (allCharacters.get(name) ?? 0) + 1);
      }
    }
  }

  // Company moves
  let companyMoves = 0;
  let prevLoc: string | null = null;
  for (const s of sorted) {
    if (s.location_name && s.location_name !== prevLoc) {
      if (prevLoc !== null) companyMoves++;
      prevLoc = s.location_name;
    }
  }

  // Location clusters
  const clusters: { location: string; count: number; startScene: string }[] = [];
  let curLoc: string | null = null;
  let curCount = 0;
  let curStart = "";
  for (const s of sorted) {
    if (s.location_name === curLoc) {
      curCount++;
    } else {
      if (curLoc && curCount > 1) clusters.push({ location: curLoc, count: curCount, startScene: curStart });
      curLoc = s.location_name;
      curCount = 1;
      curStart = s.scene_number ?? "";
    }
  }
  if (curLoc && curCount > 1) clusters.push({ location: curLoc, count: curCount, startScene: curStart });
  clusters.sort((a, b) => b.count - a.count);

  const locationsSorted = [...locationCounts.entries()].sort((a, b) => b[1] - a[1]);
  const singleUseLocations = locationsSorted.filter(([, c]) => c === 1);
  const repeatLocations = locationsSorted.filter(([, c]) => c >= 3);
  const interiorLocations = [...locationIE.entries()]
    .filter(([, ies]) => ies.has("INT") && !ies.has("EXT"))
    .map(([loc]) => loc);
  const exteriorLocations = [...locationIE.entries()]
    .filter(([, ies]) => ies.has("EXT") && !ies.has("INT"))
    .map(([loc]) => loc);

  const charactersSorted = [...allCharacters.entries()].sort((a, b) => b[1] - a[1]);

  return {
    total: scenes.length,
    intCount,
    extCount,
    intExtCount,
    dayCount,
    nightCount,
    continuousCount,
    otherTime: scenes.length - dayCount - nightCount - continuousCount,
    uniqueLocations: locationCounts.size,
    locationsSorted,
    singleUseLocations,
    repeatLocations,
    interiorLocations,
    exteriorLocations,
    companyMoves,
    clusters,
    charactersSorted,
    locationIE,
  };
}

function StatCell({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2">
      <span className="font-mono font-semibold text-2xl tabular-nums">{value}</span>
      <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
      {sub && <span className="text-[10px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

function Section({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left font-medium text-sm hover:bg-muted/30"
      >
        {open ? (
          <ChevronDown className="size-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground" />
        )}
        {title}
      </button>
      {open && <div className="border-t px-4 py-3">{children}</div>}
    </div>
  );
}

function MiniTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground text-xs uppercase tracking-wider">
            {headers.map((h) => (
              <th key={h} className="px-2 py-1.5 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((row, i) => (
            <tr key={`row-${row[0]}-${i}`} className="hover:bg-muted/20">
              {row.map((cell, j) => (
                <td
                  key={`cell-${i}-${j}`}
                  className={cn("px-2 py-1.5", j === 0 ? "font-medium" : "text-muted-foreground tabular-nums")}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ScriptIntelligence({ scenes }: { scenes: SceneData[] }) {
  const intel = useMemo(() => computeIntelligence(scenes), [scenes]);

  return (
    <div className="flex flex-col gap-4">
      {/* Summary strip */}
      <div className="flex flex-wrap gap-px overflow-hidden rounded-lg border bg-border">
        <div className="flex flex-1 flex-wrap bg-background">
          <StatCell label="Scenes" value={intel.total} />
          <StatCell label="Locations" value={intel.uniqueLocations} />
          <StatCell label="Day" value={intel.dayCount} />
          <StatCell label="Night" value={intel.nightCount} />
          <StatCell label="Interior" value={intel.intCount} />
          <StatCell label="Exterior" value={intel.extCount} />
          <StatCell label="Int/Ext" value={intel.intExtCount} />
          <StatCell label="Continuous" value={intel.continuousCount} sub={`${intel.otherTime} other`} />
          <StatCell
            label="Characters"
            value={intel.charactersSorted.length || "—"}
            sub={intel.charactersSorted.length === 0 ? "not yet extracted" : undefined}
          />
          <StatCell label="Company Moves" value={intel.companyMoves} sub="estimated" />
        </div>
      </div>

      {/* Expandable sections */}
      <Section
        title={`Locations · ${intel.uniqueLocations} unique · ${intel.singleUseLocations.length} single-use`}
        defaultOpen
      >
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              All Locations by Scene Count
            </h4>
            <MiniTable
              headers={["Location", "Scenes", "I/E"]}
              rows={intel.locationsSorted.map(([loc, count]) => [
                loc,
                count,
                [...(intel.locationIE.get(loc) ?? [])].join(" / "),
              ])}
            />
          </div>
        </div>
      </Section>

      <Section title={`Cast · ${intel.charactersSorted.length || "No"} characters extracted`}>
        {intel.charactersSorted.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Character names were not extracted during script import. This is a parser limitation — the screenplay text
            was processed for scenes, locations, and INT/EXT but character identification requires a parser update.
          </p>
        ) : (
          <MiniTable
            headers={["Character", "Scenes"]}
            rows={intel.charactersSorted.map(([name, count]) => [name, count])}
          />
        )}
      </Section>

      <Section
        title={`Art Department · ${intel.repeatLocations.length} repeat sets · ${intel.interiorLocations.length} interior locations`}
      >
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Repeat Sets (3+ scenes — likely builds)
            </h4>
            {intel.repeatLocations.length > 0 ? (
              <MiniTable
                headers={["Location", "Scenes", "I/E"]}
                rows={intel.repeatLocations.map(([loc, count]) => [
                  loc,
                  count,
                  [...(intel.locationIE.get(loc) ?? [])].join(" / "),
                ])}
              />
            ) : (
              <p className="text-muted-foreground text-sm">No locations with 3+ scenes.</p>
            )}
          </div>

          <div>
            <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Interior Locations (potential stage/build)
            </h4>
            {intel.interiorLocations.length > 0 ? (
              <MiniTable
                headers={["Location", "Scenes"]}
                rows={intel.interiorLocations.map((loc) => [
                  loc,
                  intel.locationsSorted.find(([l]) => l === loc)?.[1] ?? 0,
                ])}
              />
            ) : (
              <p className="text-muted-foreground text-sm">No exclusively interior locations found.</p>
            )}
          </div>

          <div>
            <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Hero Sets (largest consecutive clusters)
            </h4>
            <MiniTable
              headers={["Location", "Consecutive Scenes", "Starts At"]}
              rows={intel.clusters.slice(0, 10).map((c) => [c.location, c.count, `Sc. ${c.startScene}`])}
            />
          </div>

          <div>
            <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Single-Use Locations ({intel.singleUseLocations.length})
            </h4>
            {intel.singleUseLocations.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {intel.singleUseLocations.map(([loc]) => (
                  <span key={loc} className="rounded border bg-muted/30 px-2 py-0.5 text-muted-foreground text-xs">
                    {loc}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">All locations appear in multiple scenes.</p>
            )}
          </div>
        </div>
      </Section>

      <Section title={`Logistics · ${intel.companyMoves} estimated moves · ${intel.clusters.length} location clusters`}>
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Company Move Estimate
            </h4>
            <p className="text-sm">
              <span className="font-mono font-semibold">{intel.companyMoves}</span> location transitions across{" "}
              {intel.total} scenes.
              {intel.companyMoves > intel.total * 0.6 && (
                <span className="ml-1 text-amber-500">High move frequency — scheduling optimization recommended.</span>
              )}
            </p>
          </div>

          <div>
            <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Location Clusters (consecutive scenes — reduced moves)
            </h4>
            <MiniTable
              headers={["Location", "Consecutive", "Starts At"]}
              rows={intel.clusters.slice(0, 15).map((c) => [c.location, c.count, `Sc. ${c.startScene}`])}
            />
          </div>

          <div>
            <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Exterior vs Interior Split
            </h4>
            <p className="text-sm">
              <span className="font-mono">{intel.extCount + intel.intExtCount}</span> exterior/mixed scenes vs{" "}
              <span className="font-mono">{intel.intCount}</span> interior.
              {intel.extCount > intel.intCount * 3 && (
                <span className="ml-1 text-muted-foreground">
                  Heavily exterior — weather contingency planning advised.
                </span>
              )}
            </p>
          </div>

          <div>
            <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Day vs Night Split
            </h4>
            <p className="text-sm">
              <span className="font-mono">{intel.dayCount}</span> day ·{" "}
              <span className="font-mono">{intel.nightCount}</span> night ·{" "}
              <span className="font-mono">{intel.continuousCount}</span> continuous/same.
              {intel.continuousCount > intel.dayCount + intel.nightCount && (
                <span className="ml-1 text-muted-foreground">
                  {" "}
                  Many continuous scenes — actual day/night split depends on scheduling order.
                </span>
              )}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
