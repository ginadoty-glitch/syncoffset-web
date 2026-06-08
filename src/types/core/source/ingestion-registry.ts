/**
 * SyncOffset Source Ingestion Registry
 *
 * Describes source document kinds, immutability, extraction targets, and source systems.
 * No extraction logic — metadata only (Article IV foundation).
 *
 * ShootDay remains the future calendar authority object (Article VII).
 * Extraction may propose shoot-day records; calendar service owns mutations.
 */

import type { CoreObjectKind } from "../kinds";
import type { SourceSystem } from "./provenance";
import type { SourceDocumentKind } from "./source-document-kind";

/** Core objects that ingestion may materialize from a source (future extraction). */
export type ExtractionTargetKind = Extract<
  CoreObjectKind,
  | "shoot-day"
  | "prep-day"
  | "wrap-day"
  | "company-move"
  | "scene"
  | "element"
  | "breakdown-element"
  | "script"
  | "script-revision"
  | "revision-change"
  | "department"
  | "location"
  | "permit"
  | "cast-member"
  | "crew-member"
  | "background-performer"
  | "asset"
  | "vendor"
  | "document"
  | "media"
>;

export type SourceIngestionRegistryEntry = {
  readonly sourceDocumentKind: SourceDocumentKind;
  readonly label: string;
  readonly isImmutable: true;
  readonly supportedSourceSystems: ReadonlyArray<SourceSystem>;
  readonly extractionTargets: ReadonlyArray<ExtractionTargetKind>;
  readonly notes?: string;
};

export const SOURCE_INGESTION_REGISTRY: Record<SourceDocumentKind, SourceIngestionRegistryEntry> = {
  "script-revision": {
    sourceDocumentKind: "script-revision",
    label: "Script Revision",
    isImmutable: true,
    supportedSourceSystems: ["scriptation", "pdf", "manual-upload"],
    extractionTargets: ["script", "script-revision", "scene", "element", "breakdown-element", "revision-change"],
    notes: "Original script pages; revisions are new documents, not overwrites.",
  },
  "shoot-schedule": {
    sourceDocumentKind: "shoot-schedule",
    label: "Shoot Schedule",
    isImmutable: true,
    supportedSourceSystems: [
      "movie-magic-scheduling",
      "ep-scheduling",
      "scenechronize",
      "studiobinder",
      "excel",
      "pdf",
      "manual-upload",
    ],
    extractionTargets: ["shoot-day", "company-move", "cast-member", "crew-member"],
    notes: "ShootDay is calendar authority — extracted records link, calendar service commits.",
  },
  "one-liner": {
    sourceDocumentKind: "one-liner",
    label: "One-Liner",
    isImmutable: true,
    supportedSourceSystems: ["movie-magic-scheduling", "ep-scheduling", "excel", "pdf", "manual-upload"],
    extractionTargets: ["shoot-day", "scene", "location", "company-move"],
  },
  "callsheet-revision": {
    sourceDocumentKind: "callsheet-revision",
    label: "Callsheet Revision",
    isImmutable: true,
    supportedSourceSystems: ["studiobinder", "scenechronize", "pdf", "excel", "manual-upload"],
    extractionTargets: ["shoot-day", "document", "crew-member", "cast-member", "location"],
    notes: "Distinct from operations CallsheetRevision — this is the immutable source file.",
  },
  "breakdown-package": {
    sourceDocumentKind: "breakdown-package",
    label: "Script Breakdown",
    isImmutable: true,
    supportedSourceSystems: ["scriptation", "movie-magic-scheduling", "excel", "pdf", "manual-upload"],
    extractionTargets: ["scene", "element", "breakdown-element", "asset"],
  },
  "location-package": {
    sourceDocumentKind: "location-package",
    label: "Location Package",
    isImmutable: true,
    supportedSourceSystems: ["pdf", "excel", "manual-upload"],
    extractionTargets: ["location", "document", "media"],
  },
  "crew-list": {
    sourceDocumentKind: "crew-list",
    label: "Crew List",
    isImmutable: true,
    supportedSourceSystems: ["excel", "pdf", "scenechronize", "manual-upload"],
    extractionTargets: ["crew-member", "department"],
  },
  "cast-list": {
    sourceDocumentKind: "cast-list",
    label: "Cast List",
    isImmutable: true,
    supportedSourceSystems: ["excel", "pdf", "scenechronize", "manual-upload"],
    extractionTargets: ["cast-member", "background-performer"],
  },
  dood: {
    sourceDocumentKind: "dood",
    label: "Day Out of Days",
    isImmutable: true,
    supportedSourceSystems: ["movie-magic-scheduling", "ep-scheduling", "excel", "pdf", "manual-upload"],
    extractionTargets: ["shoot-day", "cast-member", "background-performer"],
  },
  "vendor-document": {
    sourceDocumentKind: "vendor-document",
    label: "Vendor Document",
    isImmutable: true,
    supportedSourceSystems: ["pdf", "excel", "manual-upload"],
    extractionTargets: ["vendor", "document"],
  },
  permit: {
    sourceDocumentKind: "permit",
    label: "Permit",
    isImmutable: true,
    supportedSourceSystems: ["pdf", "manual-upload"],
    extractionTargets: ["permit", "location"],
  },
  "reference-media": {
    sourceDocumentKind: "reference-media",
    label: "Reference Media",
    isImmutable: true,
    supportedSourceSystems: ["manual-upload", "pdf"],
    extractionTargets: ["media", "scene", "location", "asset"],
  },
};
