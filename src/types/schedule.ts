/**
 * Schedule types — ported from expo/types/index.ts and expo/services/oneLinerScheduleParse.ts.
 * These are the canonical data contracts shared between mobile and web parsers.
 */

export interface ShootDaySetup {
  setName: string;
  subSets?: string[];
  intExt: "INT" | "EXT" | "INT/EXT" | "E/I";
  dayNight?: "D" | "N" | "D/N";
  /** Lighting continuity reference: D1, D2, D3, N1, N2, etc. */
  dNumber?: string;
  scenes: string[];
  setupNote?: string;
  /** Camera/transition notes: "PUSH TO:", "CAMERA MOVES INSIDE" */
  cameraNote?: string;
  sortOrder: number;
}

export interface ShootDayUnit {
  unitLabel: string;
  setupIndexes?: number[] | null;
}

export interface ShootDayMarker {
  label: string;
  markerType: "milestone" | "meeting" | "obligation" | "note";
  time?: string;
}

export type ShootDayEventType =
  | "production_meeting"
  | "logistics_meeting"
  | "tech_scout"
  | "location_scout"
  | "costume_fitting"
  | "props_show_and_tell"
  | "show_and_tell"
  | "rehearsal"
  | "pre_light"
  | "vfx_element_shoot"
  | "camera_test"
  | "stunt_rehearsal"
  | "safety_meeting"
  | "other";

export interface ShootDayEvent {
  eventType: ShootDayEventType;
  title: string;
  startTime?: string;
  attendees?: string[];
  location?: string;
  zoomUrl?: string;
  notes?: string;
}

/** DAY WORK / NIGHT WORK / DUSK FOR DAWN segmentation within a shoot day */
export interface WorkPeriod {
  label: string;
  setupIndexes: number[];
}

export interface ShootDay {
  id: string;
  blockId: string;
  dayNumber: number;
  /** Epoch ms */
  date: number;
  location: string;
  secondaryLocation?: string;
  zone?: string;
  /** Explicit calendar day type (prep, tech-scout, travel…) — bypasses INT/EXT inference in the mirror. */
  calendarDayType?: string;

  setups: ShootDaySetup[];
  units: ShootDayUnit[];
  markers?: ShootDayMarker[];
  events?: ShootDayEvent[];

  companyMove?: boolean;
  companyMoveDestination?: string;

  /** Total pages for the day: "5 4/8", "3 1/8" */
  totalPages?: string;
  /** Whether this is a split shoot day (day + night at same location) */
  splitDay?: boolean;
  /** DAY WORK / NIGHT WORK / DUSK FOR DAWN segments */
  workPeriods?: WorkPeriod[];
  /** Pre-light instructions for upcoming setups */
  preLightNotes?: string[];
  /** VFX element shoot markers */
  vfxElements?: string[];
  /** Scenes explicitly marked as omitted */
  omittedScenes?: string[];

  notes?: string;
  productionDocumentSourceId?: string;
  isUpdate?: boolean;

  /** @deprecated — use setups[].scenes */
  scenes: string[];
  /** @deprecated — use setups[].intExt */
  intExt?: "INT" | "EXT" | "INT/EXT";
  /** @deprecated — use setups[0].setName */
  setName?: string;
  /** @deprecated — use units[0].unitLabel */
  unitLabel?: string;

  mealBreakNote?: string;
  crewCallNote?: string;
  locationMapUrl?: string;
  meetingTitle?: string;
  meetingJoinUrl?: string;
  meetingTimezone?: string;
  meetingDetails?: string;
}

export type OneLinerFieldConfidence = "certain" | "inferred" | "uncertain" | "missing";

export type ParsedOneLinerRow = {
  rowIndex: number;
  shootDay: ShootDay;
  confidence: {
    date: OneLinerFieldConfidence;
    location: OneLinerFieldConfidence;
    scenes: OneLinerFieldConfidence;
    intExt: OneLinerFieldConfidence;
    unit: OneLinerFieldConfidence;
    overall: OneLinerFieldConfidence;
  };
  rawCells: Record<string, string>;
};

export type OneLinerUnresolvedRow = {
  rowIndex: number;
  reason: string;
  raw: Record<string, string>;
};

export type OneLinerParseQuality = "full" | "partial" | "minimal";

export type OneLinerParseResult = {
  rows: ParsedOneLinerRow[];
  unresolvedRows: OneLinerUnresolvedRow[];
  warnings: string[];
  revisionLabel: string | null;
  episodeIdentifier: string | null;
  detectedColumns: string[];
  sourceFormat: "csv" | "xlsx" | "pdf";
  parseQuality: OneLinerParseQuality;
};
