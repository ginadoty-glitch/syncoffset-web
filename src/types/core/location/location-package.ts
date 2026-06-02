/**
 * SyncOffset Location Authority — location package (approved location documentation)
 *
 * Scout reports, deal memos, photos index, and related approved docs — not permits (separate kind).
 * Distinct from source `location-package` ingestion kind and creative `department-package`.
 *
 * Constitutional object: kind "location-package"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { LocationPackageStatus } from "./location-status";

export type LocationPackage = AuditableCoreObject & {
  readonly kind: "location-package";
  readonly status: LocationPackageStatus;
  readonly locationId: ObjectId;
  readonly packageName: string;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly mediaAssetIds: ReadonlyArray<ObjectId>;
  readonly sceneIds: ReadonlyArray<ObjectId>;
  readonly approvedBy?: string;
  readonly notes?: string;
};
