/**
 * SyncOffset Relationship Graph — constitutional schema merge (single source of truth)
 *
 * RELATIONSHIP_SCHEMA_REGISTRY is derived exclusively from authority
 * *_RELATIONSHIP_SCHEMA_REGISTRY exports. Do not duplicate edges inline.
 *
 * @see docs/SYNCOFFSET_IMPLEMENTATION_SPRINT.md Phase 1
 */

import { ACCOUNTING_RELATIONSHIP_SCHEMA_REGISTRY } from "../accounting/accounting-relationship-contracts";
import { ASSET_RELATIONSHIP_SCHEMA_REGISTRY } from "../asset/asset-relationship-contracts";
import { BG_RELATIONSHIP_SCHEMA_REGISTRY } from "../background/bg-relationship-contracts";
import { BROKERAGE_RELATIONSHIP_SCHEMA_REGISTRY } from "../brokerage/brokerage-relationship-contracts";
import { CALLSHEET_RELATIONSHIP_SCHEMA_REGISTRY } from "../callsheet/callsheet-relationship-contracts";
import { CAST_RELATIONSHIP_SCHEMA_REGISTRY } from "../cast/cast-relationship-contracts";
import { COMMUNICATION_RELATIONSHIP_SCHEMA_REGISTRY } from "../communication/communication-relationship-contracts";
import { CREATIVE_RELATIONSHIP_SCHEMA_REGISTRY } from "../creative/creative-relationship-contracts";
import { CREW_RELATIONSHIP_SCHEMA_REGISTRY } from "../crew/crew-relationship-contracts";
import { DOCUMENT_RELATIONSHIP_SCHEMA_REGISTRY } from "../document/document-relationship-contracts";
import { INVENTORY_RELATIONSHIP_SCHEMA_REGISTRY } from "../inventory/inventory-relationship-contracts";
import { LOCATION_RELATIONSHIP_SCHEMA_REGISTRY } from "../location/location-relationship-contracts";
import { PRODUCTION_CALENDAR_RELATIONSHIP_SCHEMA_REGISTRY } from "../production-calendar/production-calendar-relationship-contracts";
import { PURCHASE_RELATIONSHIP_SCHEMA_REGISTRY } from "../purchase/purchase-relationship-contracts";
import { RETURN_RELATIONSHIP_SCHEMA_REGISTRY } from "../return/return-relationship-contracts";
import { SCENE_RELATIONSHIP_SCHEMA_REGISTRY } from "../scene/scene-relationship-contracts";
import { SCRIPT_RELATIONSHIP_SCHEMA_REGISTRY } from "../script/script-relationship-contracts";
import { SHIPMENT_RELATIONSHIP_SCHEMA_REGISTRY } from "../shipment/shipment-relationship-contracts";
import { SHOOTDAY_RELATIONSHIP_SCHEMA_REGISTRY } from "../shootday/shootday-relationship-contracts";
import { SHOOTING_SCHEDULE_RELATIONSHIP_SCHEMA_REGISTRY } from "../shooting-schedule/shooting-schedule-relationship-contracts";
import { VENDOR_RELATIONSHIP_SCHEMA_REGISTRY } from "../vendor/vendor-relationship-contracts";
import { WORK_ORDER_RELATIONSHIP_SCHEMA_REGISTRY } from "../work-order/work-order-relationship-contracts";
import type { RelationshipSchemaEntry } from "./relationship-schema-entry";

const AUTHORITY_RELATIONSHIP_SCHEMA_REGISTRIES: ReadonlyArray<ReadonlyArray<RelationshipSchemaEntry>> = [
  ACCOUNTING_RELATIONSHIP_SCHEMA_REGISTRY,
  ASSET_RELATIONSHIP_SCHEMA_REGISTRY,
  BG_RELATIONSHIP_SCHEMA_REGISTRY,
  BROKERAGE_RELATIONSHIP_SCHEMA_REGISTRY,
  CALLSHEET_RELATIONSHIP_SCHEMA_REGISTRY,
  CAST_RELATIONSHIP_SCHEMA_REGISTRY,
  COMMUNICATION_RELATIONSHIP_SCHEMA_REGISTRY,
  CREATIVE_RELATIONSHIP_SCHEMA_REGISTRY,
  CREW_RELATIONSHIP_SCHEMA_REGISTRY,
  DOCUMENT_RELATIONSHIP_SCHEMA_REGISTRY,
  INVENTORY_RELATIONSHIP_SCHEMA_REGISTRY,
  LOCATION_RELATIONSHIP_SCHEMA_REGISTRY,
  PRODUCTION_CALENDAR_RELATIONSHIP_SCHEMA_REGISTRY,
  PURCHASE_RELATIONSHIP_SCHEMA_REGISTRY,
  RETURN_RELATIONSHIP_SCHEMA_REGISTRY,
  SCENE_RELATIONSHIP_SCHEMA_REGISTRY,
  SCRIPT_RELATIONSHIP_SCHEMA_REGISTRY,
  SHIPMENT_RELATIONSHIP_SCHEMA_REGISTRY,
  SHOOTDAY_RELATIONSHIP_SCHEMA_REGISTRY,
  SHOOTING_SCHEDULE_RELATIONSHIP_SCHEMA_REGISTRY,
  VENDOR_RELATIONSHIP_SCHEMA_REGISTRY,
  WORK_ORDER_RELATIONSHIP_SCHEMA_REGISTRY,
];

function relationshipSchemaKey(entry: RelationshipSchemaEntry): string {
  return `${entry.kind}|${entry.fromKind}|${entry.toKind}`;
}

/** Merge authority registries with deterministic de-duplication (first label wins). */
export function mergeRelationshipSchemaRegistries(
  registries: ReadonlyArray<ReadonlyArray<RelationshipSchemaEntry>>,
): ReadonlyArray<RelationshipSchemaEntry> {
  const merged = new Map<string, RelationshipSchemaEntry>();
  for (const registry of registries) {
    for (const entry of registry) {
      const key = relationshipSchemaKey(entry);
      if (!merged.has(key)) {
        merged.set(key, entry);
      }
    }
  }
  return [...merged.values()];
}

/** Platform-wide constitutional relationship schema — single source of truth. */
export const CONSTITUTIONAL_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> =
  mergeRelationshipSchemaRegistries(AUTHORITY_RELATIONSHIP_SCHEMA_REGISTRIES);
