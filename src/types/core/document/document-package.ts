/**
 * SyncOffset Document Authority — generated document collections (metadata only)
 *
 * `packageKind` strings may mirror authority package labels — not core object kinds.
 * Constitutional object: kind "document-package"
 *
 * @see docs/SYNCOFFSET_DOCUMENT_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type DocumentPackageKind =
  | "document-package"
  | "distribution-package"
  | "archive-package"
  | "submission-package"
  | "production-package";

export type DocumentPackageKindDefinition = {
  readonly packageKind: DocumentPackageKind;
  readonly label: string;
};

export const DOCUMENT_PACKAGE_KIND_REGISTRY: Record<DocumentPackageKind, DocumentPackageKindDefinition> = {
  "document-package": { packageKind: "document-package", label: "Document Package" },
  "distribution-package": { packageKind: "distribution-package", label: "Distribution Package" },
  "archive-package": { packageKind: "archive-package", label: "Archive Package" },
  "submission-package": { packageKind: "submission-package", label: "Submission Package" },
  "production-package": { packageKind: "production-package", label: "Production Package" },
};

export type DocumentPackage = AuditableCoreObject & {
  readonly kind: "document-package";
  readonly documentId: ObjectId;
  readonly packageKind: DocumentPackageKind;
  readonly generatedAt: Timestamp;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
