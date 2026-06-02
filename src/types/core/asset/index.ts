/**
 * SyncOffset Asset Authority Layer — barrel export
 *
 * Asset — production item on a set
 * AssetInstance — tracked unit of an asset
 * AssetAssignment — deployment to scene / day / location
 * AssetPackage — generated asset documentation
 */

export type { Asset } from "./asset";
export type { AssetAssignment } from "./asset-assignment";
export type { AssetCategoryDefinition, AssetCategoryId } from "./asset-category";
export { ASSET_CATEGORY_REGISTRY } from "./asset-category";
export type { AssetInstance } from "./asset-instance";
export type { AssetPackage } from "./asset-package";
export {
  ASSET_CANONICAL_RELATIONSHIP_PATHS,
  ASSET_RELATIONSHIP_SCHEMA_REGISTRY,
  ASSET_RELATIONSHIP_TARGETS,
} from "./asset-relationship-contracts";
export type {
  AssetAssignmentStatus,
  AssetInstanceStatus,
  AssetPackageKind,
  AssetPackageKindDefinition,
  AssetPackageStatus,
  AssetStatus,
  AssetStatusDefinition,
} from "./asset-status";
export {
  ASSET_PACKAGE_KIND_REGISTRY,
  ASSET_STATUS_REGISTRY,
} from "./asset-status";
