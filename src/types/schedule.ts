/**
 * Schedule types — ported from expo/types/index.ts and expo/services/oneLinerScheduleParse.ts.
 * These are the canonical data contracts shared between mobile and web parsers.
 */

export interface ShootDay {
  id: string;
  blockId: string;
  dayNumber: number;
  /** Epoch ms */
  date: number;
  location: string;
  zone?: string;
  scenes: string[];
  intExt?: "INT" | "EXT" | "INT/EXT";
  setName?: string;
  isUpdate?: boolean;
  notes?: string;
  productionDocumentSourceId?: string;
  unitLabel?: string;
  companyMove?: boolean;
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
