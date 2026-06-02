/**
 * SyncOffset Location Authority — physical filming or production location
 *
 * Constitutional object: kind "location"
 * Permits, maps, and scheduling engines are out of scope for this layer.
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { LocationStatus, LocationTypeId } from "./location-status";

export type LocationAddress = {
  readonly line1?: string;
  readonly line2?: string;
  readonly city?: string;
  readonly region?: string;
  readonly postalCode?: string;
  readonly country?: string;
};

export type Location = AuditableCoreObject & {
  readonly kind: "location";
  readonly status: LocationStatus;
  readonly locationName: string;
  readonly locationType: LocationTypeId;
  readonly customTypeLabel?: string;
  readonly address?: LocationAddress;
  readonly locationRequirementIds: ReadonlyArray<ObjectId>;
  readonly locationPackageIds: ReadonlyArray<ObjectId>;
  readonly locationAssignmentIds: ReadonlyArray<ObjectId>;
  readonly vendorIds: ReadonlyArray<ObjectId>;
  readonly assetIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
