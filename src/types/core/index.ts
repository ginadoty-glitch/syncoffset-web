/**
 * SyncOffset Core Object Layer — barrel export.
 *
 * Constitutional hierarchy:
 *   kinds.ts, base.ts, registry.ts  — core object registry
 *   source/                         — immutable source ingestion (Article I, IV)
 *   generated/                      — derived outputs (Article VI)
 *   relationships/                  — graph edges, queries, paths (Article III)
 *   callsheet/                      — callsheet, revision, distribution, package (operations)
 *   production-calendar/            — master planning calendar, days, revisions, packages
 *   shooting-schedule/              — what gets shot; revisions, packages (remediation v1)
 *   shootday/                       — shoot day, assignment, package (execution)
 *   services/                       — @deprecated ShootDay service contracts (Article VII legacy)
 *   background/                     — BG requirement, performer, assignment (Cast & Crew W06)
 *   creative/                       — director notes, packages, tech packs (Media Hub W05)
 *   document/                       — document, revision, package, link (W23)
 *   script/                         — script revision, breakdown (W02 provenance)
 *   scene/                          — scene, set, budget requirement (W02 hub)
 *   cast/                           — character, cast requirement, member, assignment (W06)
 *   crew/                           — department, crew requirement, member, assignment (W06)
 *   vendor/                         — vendor, contact, agreement (W08)
 *   accounting/                     — production cost, department cost, cost report (W21)
 *   communication/                  — communication, distribution list, package (W22)
 *   work-order/                     — work order, task, package (W19)
 *   location/                       — location, requirement, package, assignment (W07)
 *   asset/                          — asset, instance, assignment, package (W04)
 *   inventory/                      — inventory record, movement, audit, package (W22)
 *   purchase/                       — purchase order, line, package (W08)
 *   shipment/                       — shipment, stop, event, package (movement)
 *   brokerage/                      — brokerage record, line, package (customs)
 *   return/                         — return record, line, package (recovery)
 *
 * Operational contracts: src/types/operations/
 */

export * from "./accounting";
export * from "./asset";
export * from "./background";
export type { AuditableCoreObject, CoreObjectStatus, CoreRelationship } from "./base";
export * from "./brokerage";
export * from "./callsheet";
export * from "./cast";
export * from "./communication";
export * from "./creative";
export * from "./crew";
export * from "./document";
export * from "./generated";
export * from "./inventory";
export type { CoreObjectKind } from "./kinds";
export * from "./location";
export * from "./production-calendar";
export * from "./purchase";
export { CORE_OBJECT_REGISTRY, type CoreObjectRegistryEntry } from "./registry";
export * from "./relationships";
export * from "./return";
export * from "./scene";
export * from "./script";
export * from "./services";
export * from "./shipment";
export * from "./shootday";
export * from "./shooting-schedule";
export * from "./source";
export * from "./vendor";
export * from "./work-order";
