/**
 * SyncOffset Document Authority — logical production document (first-class object)
 *
 * Every uploaded file ultimately resolves to a Document + DocumentRevision (Rules 1–3).
 * Not an attachment — constitutional production record.
 *
 * Constitutional object: kind "document"
 * Distinct from Article I ingestion kind "source-document" (ImmutableSourceDocument).
 *
 * @see docs/SYNCOFFSET_DOCUMENT_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { DocumentCategory } from "./document-category";
import type { DocumentStatus } from "./document-status";

export type Document = AuditableCoreObject & {
  readonly kind: "document";
  readonly documentNumber: string;
  readonly title: string;
  readonly categoryId: DocumentCategory;
  readonly statusId: DocumentStatus;
  readonly notes: string;
  readonly setId?: ObjectId;
  readonly setNumber?: string;
  readonly sceneId?: ObjectId;
  readonly documentRevisionIds: ReadonlyArray<ObjectId>;
  readonly documentPackageIds: ReadonlyArray<ObjectId>;
  readonly documentLinkIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
