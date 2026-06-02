/**
 * SyncOffset Document Authority — barrel export
 *
 * Document — logical production document (first-class, not an attachment)
 * DocumentRevision — immutable revision history
 * DocumentPackage — generated collections
 * DocumentLink — references to authorities without ownership
 */

export type { Document } from "./document";
export type { DocumentCategory } from "./document-category";
export { DOCUMENT_CATEGORY_REGISTRY } from "./document-category";
export type { DocumentLink } from "./document-link";
export type { DocumentPackage, DocumentPackageKind } from "./document-package";
export { DOCUMENT_PACKAGE_KIND_REGISTRY } from "./document-package";
export {
  DOCUMENT_CANONICAL_RELATIONSHIP_PATHS,
  DOCUMENT_RELATIONSHIP_SCHEMA_REGISTRY,
  DOCUMENT_RELATIONSHIP_TARGETS,
} from "./document-relationship-contracts";
export type { DocumentRevision } from "./document-revision";
export type { DocumentStatus } from "./document-status";
export { DOCUMENT_STATUS_REGISTRY } from "./document-status";
