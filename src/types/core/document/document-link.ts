/**
 * SyncOffset Document Authority — association to constitutional authorities (no ownership)
 *
 * Rule 2 — documents support any authority; links do not embed ownership.
 * Constitutional object: kind "document-link"
 *
 * @see docs/SYNCOFFSET_DOCUMENT_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CoreObjectKind } from "../kinds";

export type DocumentLink = AuditableCoreObject & {
  readonly kind: "document-link";
  readonly documentId: ObjectId;
  readonly targetKind: CoreObjectKind;
  readonly targetId: ObjectId;
  readonly role: string;
  readonly notes?: string;
};
