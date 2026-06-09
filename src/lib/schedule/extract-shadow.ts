/**
 * Shared v2 shadow JSON reader.
 * Consumed by Production Calendar, One-Liner, Shooting Schedule, Callsheet, Prep Schedule.
 */

import type { ShootDayEvent, ShootDayMarker, ShootDaySetup, ShootDayUnit, WorkPeriod } from "@/types/schedule";

const V1_PREFIX = "SYNCO_SHADOW_JSON:v1:";
const V2_PREFIX = "SYNCO_SHADOW_JSON:v2:";

type V1SetEntry = { name: string; intExt?: string; dayNight?: string };

type V1Shadow = {
  scenes?: string[];
  unitLabel?: string | null;
  zone?: string;
  sets?: V1SetEntry[];
  markers?: string[];
  tdbs?: string[];
};

type V2Shadow = {
  v: 2;
  setups: ShootDaySetup[];
  units: ShootDayUnit[];
  markers: ShootDayMarker[];
  events: ShootDayEvent[];
  zone: string | null;
  companyMove: boolean;
  companyMoveDestination: string | null;
  secondaryLocation?: string | null;
  totalPages?: string | null;
  splitDay?: boolean;
  workPeriods?: WorkPeriod[];
  preLightNotes?: string[];
  vfxElements?: string[];
  omittedScenes?: string[];
  blockId?: string;
  localId?: string;
};

export type NormalizedShadow = {
  setups: ShootDaySetup[];
  units: ShootDayUnit[];
  markers: ShootDayMarker[];
  events: ShootDayEvent[];
  zone: string;
  companyMove: boolean;
  companyMoveDestination: string | null;
  totalPages: string | null;
  splitDay: boolean;
  cleanedNotes: string;
  allScenes: string[];
};

export function extractShadow(rawNotes: string | null): NormalizedShadow {
  const empty: NormalizedShadow = {
    setups: [],
    units: [],
    markers: [],
    events: [],
    zone: "unit-a",
    companyMove: false,
    companyMoveDestination: null,
    totalPages: null,
    splitDay: false,
    cleanedNotes: rawNotes?.trim() ?? "",
    allScenes: [],
  };
  if (!rawNotes?.trim()) return empty;

  const v2Idx = rawNotes.indexOf(V2_PREFIX);
  if (v2Idx >= 0) {
    const cleaned = rawNotes.slice(0, v2Idx).trim();
    try {
      const meta = JSON.parse(rawNotes.slice(v2Idx + V2_PREFIX.length).trim()) as V2Shadow;
      const allScenes = meta.setups.flatMap((s) => s.scenes);
      return {
        setups: meta.setups,
        units: meta.units,
        markers: meta.markers,
        events: meta.events ?? [],
        zone: meta.zone?.trim() || "unit-a",
        companyMove: meta.companyMove,
        companyMoveDestination: meta.companyMoveDestination,
        totalPages: meta.totalPages ?? null,
        splitDay: meta.splitDay ?? false,
        cleanedNotes: cleaned,
        allScenes,
      };
    } catch {
      return { ...empty, cleanedNotes: cleaned };
    }
  }

  const v1Idx = rawNotes.indexOf(V1_PREFIX);
  if (v1Idx >= 0) {
    const cleaned = rawNotes.slice(0, v1Idx).trim();
    try {
      const meta = JSON.parse(rawNotes.slice(v1Idx + V1_PREFIX.length).trim()) as V1Shadow;
      const setups: ShootDaySetup[] = (meta.sets ?? []).map((s, i) => ({
        setName: s.name,
        intExt: (s.intExt as ShootDaySetup["intExt"]) || "INT",
        dayNight: (s.dayNight as ShootDaySetup["dayNight"]) || undefined,
        scenes: [],
        sortOrder: i,
      }));
      const units: ShootDayUnit[] = meta.unitLabel ? [{ unitLabel: meta.unitLabel }] : [];
      const markers: ShootDayMarker[] = (meta.markers ?? []).map((m) => ({
        label: m,
        markerType: "milestone" as const,
      }));
      let notesText = cleaned;
      if (meta.tdbs && meta.tdbs.length > 0) {
        notesText = [notesText, ...meta.tdbs].filter(Boolean).join(" · ");
      }
      return {
        setups,
        units,
        markers,
        events: [],
        zone: meta.zone?.trim() || "unit-a",
        companyMove: false,
        companyMoveDestination: null,
        totalPages: null,
        splitDay: false,
        cleanedNotes: notesText,
        allScenes: meta.scenes ?? [],
      };
    } catch {
      return { ...empty, cleanedNotes: cleaned };
    }
  }

  return empty;
}
