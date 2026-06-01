/**
 * SyncOffset Source Ingestion — typed immutable source documents
 *
 * Each interface extends ImmutableSourceDocument with kind-specific anchors.
 * Extraction services (future) map these to CoreObjectKind targets via ingestion registry.
 */

import type { ObjectId } from "../../operations/shared";
import type { ImmutableSourceDocument } from "./immutable-source-document";
import type { SourceDocumentKind } from "./source-document-kind";

// ─── Script & scheduling sources ───────────────────────────────────────────────

export type ScriptRevisionSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "script-revision";
  readonly scriptId: ObjectId;
  readonly revisionNumber: number;
  readonly pageCount?: number;
};

export type ShootScheduleSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "shoot-schedule";
  readonly scheduleLabel?: string;
  readonly unitId?: ObjectId;
};

export type OneLinerSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "one-liner";
  readonly episodeId?: ObjectId;
};

export type CallsheetRevisionSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "callsheet-revision";
  readonly shootDayId?: ObjectId;
  readonly revisionNumber: number;
  readonly dayLabel?: string;
};

export type BreakdownPackageSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "breakdown-package";
  readonly scriptRevisionId?: ObjectId;
};

export type DoodSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "dood";
  readonly episodeId?: ObjectId;
  readonly seasonId?: ObjectId;
};

// ─── People lists ──────────────────────────────────────────────────────────────

export type CrewListSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "crew-list";
  readonly departmentId?: ObjectId;
  readonly effectiveDate?: string;
};

export type CastListSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "cast-list";
  readonly episodeId?: ObjectId;
};

// ─── Locations, vendors, permits, media ────────────────────────────────────────

export type LocationPackageSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "location-package";
  readonly locationId?: ObjectId;
};

export type PermitSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "permit";
  readonly locationId?: ObjectId;
  readonly permitNumber?: string;
  readonly expiresAt?: string;
};

export type VendorDocumentSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "vendor-document";
  readonly vendorId?: ObjectId;
  readonly documentSubtype?: "contract" | "invoice" | "quote" | "insurance" | "other";
};

export type ReferenceMediaSourceDocument = ImmutableSourceDocument & {
  readonly sourceDocumentKind: "reference-media";
  readonly mediaSubtype: "photo" | "video" | "audio" | "reference-image" | "daily";
  readonly linkedSceneId?: ObjectId;
  readonly linkedShootDayId?: ObjectId;
};

/** Discriminated union of all constitutional source document types. */
export type SourceDocument =
  | ScriptRevisionSourceDocument
  | ShootScheduleSourceDocument
  | OneLinerSourceDocument
  | CallsheetRevisionSourceDocument
  | BreakdownPackageSourceDocument
  | LocationPackageSourceDocument
  | CrewListSourceDocument
  | CastListSourceDocument
  | DoodSourceDocument
  | VendorDocumentSourceDocument
  | PermitSourceDocument
  | ReferenceMediaSourceDocument;

/** Maps each SourceDocumentKind to its TypeScript interface name (registry aid). */
export type SourceDocumentByKind = {
  readonly "script-revision": ScriptRevisionSourceDocument;
  readonly "shoot-schedule": ShootScheduleSourceDocument;
  readonly "one-liner": OneLinerSourceDocument;
  readonly "callsheet-revision": CallsheetRevisionSourceDocument;
  readonly "breakdown-package": BreakdownPackageSourceDocument;
  readonly "location-package": LocationPackageSourceDocument;
  readonly "crew-list": CrewListSourceDocument;
  readonly "cast-list": CastListSourceDocument;
  readonly dood: DoodSourceDocument;
  readonly "vendor-document": VendorDocumentSourceDocument;
  readonly permit: PermitSourceDocument;
  readonly "reference-media": ReferenceMediaSourceDocument;
};

export function isSourceDocumentKind(value: string): value is SourceDocumentKind {
  const kinds: SourceDocumentKind[] = [
    "script-revision",
    "shoot-schedule",
    "one-liner",
    "callsheet-revision",
    "breakdown-package",
    "location-package",
    "crew-list",
    "cast-list",
    "dood",
    "vendor-document",
    "permit",
    "reference-media",
  ];
  return kinds.includes(value as SourceDocumentKind);
}
