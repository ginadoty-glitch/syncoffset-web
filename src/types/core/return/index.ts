/**
 * SyncOffset Return Authority Layer — barrel export
 *
 * ReturnRecord — recovery / strike / closeout (kind "return")
 * ReturnLine — individual returned item
 * ReturnPackage — generated return documentation
 */

export type { ReturnLine } from "./return-line";
export type { ReturnPackage } from "./return-package";
export type { ReturnRecord } from "./return-record";
export {
  RETURN_CANONICAL_RELATIONSHIP_PATHS,
  RETURN_RELATIONSHIP_SCHEMA_REGISTRY,
  RETURN_RELATIONSHIP_TARGETS,
} from "./return-relationship-contracts";
export type {
  ReturnPackageKind,
  ReturnPackageKindDefinition,
  ReturnPackageStatus,
  ReturnStatus,
  ReturnStatusDefinition,
} from "./return-status";
export { RETURN_PACKAGE_KIND_REGISTRY, RETURN_STATUS_REGISTRY } from "./return-status";
