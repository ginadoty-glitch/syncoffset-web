/**
 * SyncOffset Relationship Graph — query contracts (interfaces only)
 *
 * No graph service implementation. Defines future query shapes for graph traversal.
 *
 * @see docs/SYNCOFFSET_RELATIONSHIP_GRAPH.md
 */

import type { ObjectId } from "../../operations/shared";
import type { GeneratedOutputKind } from "../generated/generated-output-kind";
import type { CoreObjectKind } from "../kinds";
import type { SourceDocumentKind } from "../source/source-document-kind";
import type { RelationshipTraversal } from "./relationship-direction";
import type { PlatformRelationship, RelationshipEndpoint } from "./relationship-edge";
import type { RelationshipKind } from "./relationship-kind";

/** Base fields shared by all relationship queries. */
export type RelationshipQueryBase = {
  readonly productionId: ObjectId;
  readonly traversal?: RelationshipTraversal;
  readonly kinds?: ReadonlyArray<RelationshipKind>;
  readonly limit?: number;
  readonly depth?: number;
};

export type RelationshipQueryResult = {
  readonly queryType: RelationshipQuery["type"];
  readonly anchor: RelationshipEndpoint;
  readonly edges: ReadonlyArray<PlatformRelationship>;
  readonly endpoints: ReadonlyArray<RelationshipEndpoint>;
};

/**
 * Future graph service — implement when persistence layer exists.
 * No default implementation in this package.
 */
export type RelationshipQueryService = {
  execute(query: RelationshipQuery): Promise<RelationshipQueryResult>;
};

// ─── Canonical query contracts (problem statement) ─────────────────────────────

/** Find all ShootDays linked to a Location. */
export type ShootDaysByLocationQuery = RelationshipQueryBase & {
  readonly type: "shoot-days-by-location";
  readonly locationId: ObjectId;
  readonly kinds?: ReadonlyArray<Extract<RelationshipKind, "occurs-at" | "scheduled-on" | "references">>;
};

/** Find all Scenes linked to a ShootDay. */
export type ScenesByShootDayQuery = RelationshipQueryBase & {
  readonly type: "scenes-by-shoot-day";
  readonly shootDayId: ObjectId;
  readonly kinds?: ReadonlyArray<Extract<RelationshipKind, "scheduled-on" | "references">>;
};

/** Find all GeneratedOutputs for a constitutional Callsheet (preferred). */
export type GeneratedOutputsByCallsheetQuery = RelationshipQueryBase & {
  readonly type: "generated-outputs-by-callsheet";
  readonly callsheetId: ObjectId;
  readonly outputKinds?: ReadonlyArray<GeneratedOutputKind>;
  readonly kinds?: ReadonlyArray<Extract<RelationshipKind, "generated-from" | "references">>;
};

/**
 * @deprecated Prefer `GeneratedOutputsByCallsheetQuery` — source-document id for ingested file only.
 * @see docs/SYNCOFFSET_NAMING_REGISTRY.md — callsheet-revision disambiguation
 */
export type GeneratedOutputsByCallsheetRevisionQuery = RelationshipQueryBase & {
  readonly type: "generated-outputs-by-callsheet-revision";
  readonly callsheetRevisionSourceDocumentId: ObjectId;
  readonly outputKinds?: ReadonlyArray<GeneratedOutputKind>;
  readonly kinds?: ReadonlyArray<Extract<RelationshipKind, "generated-from" | "derived-from">>;
};

/** Find all Media (media core objects) attached to a Location. */
export type MediaAssetsByLocationQuery = RelationshipQueryBase & {
  readonly type: "media-by-location";
  readonly locationId: ObjectId;
  readonly kinds?: ReadonlyArray<Extract<RelationshipKind, "attached-to" | "occurs-at">>;
};

/** Find all CompanyMoves affecting a ShootDay. */
export type CompanyMovesByShootDayQuery = RelationshipQueryBase & {
  readonly type: "company-moves-by-shoot-day";
  readonly shootDayId: ObjectId;
  readonly kinds?: ReadonlyArray<Extract<RelationshipKind, "scheduled-on" | "impacts" | "depends-on">>;
};

// ─── Additional graph queries (registry-aligned) ───────────────────────────────

export type LocationsByShootDayQuery = RelationshipQueryBase & {
  readonly type: "locations-by-shoot-day";
  readonly shootDayId: ObjectId;
};

export type CastBySceneQuery = RelationshipQueryBase & {
  readonly type: "cast-by-scene";
  readonly sceneId: ObjectId;
  readonly targetKind?: Extract<CoreObjectKind, "cast-member" | "background-performer">;
};

export type AssetsBySceneQuery = RelationshipQueryBase & {
  readonly type: "assets-by-scene";
  readonly sceneId: ObjectId;
};

export type PermitsByLocationQuery = RelationshipQueryBase & {
  readonly type: "permits-by-location";
  readonly locationId: ObjectId;
};

export type GeneratedOutputsBySourceDocumentQuery = RelationshipQueryBase & {
  readonly type: "generated-outputs-by-source-document";
  readonly sourceDocumentId: ObjectId;
  readonly sourceDocumentKind?: SourceDocumentKind;
  readonly outputKinds?: ReadonlyArray<GeneratedOutputKind>;
};

export type AuthorityRecordsByGeneratedOutputQuery = RelationshipQueryBase & {
  readonly type: "authority-records-by-generated-output";
  readonly generatedOutputId: ObjectId;
  readonly authorityKinds?: ReadonlyArray<CoreObjectKind>;
};

export type ScenesByLocationQuery = RelationshipQueryBase & {
  readonly type: "scenes-by-location";
  readonly locationId: ObjectId;
};

export type MediaByShootDayQuery = RelationshipQueryBase & {
  readonly type: "media-by-shoot-day";
  readonly shootDayId: ObjectId;
};

/** Discriminated union of all supported query contracts. */
export type RelationshipQuery =
  | ShootDaysByLocationQuery
  | ScenesByShootDayQuery
  | GeneratedOutputsByCallsheetQuery
  | GeneratedOutputsByCallsheetRevisionQuery
  | MediaAssetsByLocationQuery
  | CompanyMovesByShootDayQuery
  | LocationsByShootDayQuery
  | CastBySceneQuery
  | AssetsBySceneQuery
  | PermitsByLocationQuery
  | GeneratedOutputsBySourceDocumentQuery
  | AuthorityRecordsByGeneratedOutputQuery
  | ScenesByLocationQuery
  | MediaByShootDayQuery;

export function isRelationshipQueryType(value: RelationshipQuery["type"]): value is RelationshipQuery["type"] {
  const types: RelationshipQuery["type"][] = [
    "shoot-days-by-location",
    "scenes-by-shoot-day",
    "generated-outputs-by-callsheet",
    "generated-outputs-by-callsheet-revision",
    "media-by-location",
    "company-moves-by-shoot-day",
    "locations-by-shoot-day",
    "cast-by-scene",
    "assets-by-scene",
    "permits-by-location",
    "generated-outputs-by-source-document",
    "authority-records-by-generated-output",
    "scenes-by-location",
    "media-by-shoot-day",
  ];
  return types.includes(value);
}
