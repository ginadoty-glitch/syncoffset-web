/**
 * SyncOffset Asset Authority — generated asset documentation package
 *
 * Asset Report, Inventory Package, Prep/Strike/Return packages — contracts only.
 * Distinct from creative `department-package` and source ingestion packages.
 *
 * Constitutional object: kind "asset-package"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { AssetPackageKind, AssetPackageStatus } from "./asset-status";

export type AssetPackage = AuditableCoreObject & {
  readonly kind: "asset-package";
  readonly status: AssetPackageStatus;
  readonly packageKind: AssetPackageKind;
  readonly packageName: string;
  readonly assetId: ObjectId;
  readonly setId: ObjectId;
  readonly setNumber: string;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
  readonly mediaIds: ReadonlyArray<ObjectId>;
  readonly issuedBy?: string;
  readonly notes?: string;
};
