/**
 * SyncOffset Core Object Layer — barrel export.
 *
 * Constitutional hierarchy:
 *   kinds.ts, base.ts, registry.ts  — core object registry
 *   source/                         — immutable source ingestion (Article I, IV)
 *   generated/                      — derived outputs (Article VI)
 *   relationships/                  — graph edges, queries, paths (Article III)
 *   services/                       — ShootDay authority contracts (Article VII)
 *   background/                     — BG requirement, performer, assignment (Cast & Crew W06)
 *   creative/                       — director notes, packages, tech packs (Media Hub W05)
 *   script/                         — script revision, scene, breakdown (W02 root)
 *   cast/                           — character, cast requirement, member, assignment (W06)
 *   crew/                           — department, crew requirement, member, assignment (W06)
 *
 * Operational contracts: src/types/operations/
 */

export * from "./background";
export type { AuditableCoreObject, CoreObjectStatus, CoreRelationship } from "./base";
export * from "./cast";
export * from "./creative";
export * from "./crew";
export * from "./generated";
export type { CoreObjectKind } from "./kinds";
export { CORE_OBJECT_REGISTRY, type CoreObjectRegistryEntry } from "./registry";
export * from "./relationships";
export * from "./script";
export * from "./services";
export * from "./source";
