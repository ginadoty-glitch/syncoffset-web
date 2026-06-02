/**
 * SyncOffset Document Authority — lifecycle vocabulary (registry only)
 * @see docs/SYNCOFFSET_DOCUMENT_AUTHORITY.md
 */

export type DocumentStatus = "draft" | "review" | "approved" | "issued" | "superseded" | "archived";

export type DocumentStatusDefinition = {
  readonly statusId: DocumentStatus;
  readonly label: string;
};

export const DOCUMENT_STATUS_REGISTRY: Record<DocumentStatus, DocumentStatusDefinition> = {
  draft: { statusId: "draft", label: "Draft" },
  review: { statusId: "review", label: "Review" },
  approved: { statusId: "approved", label: "Approved" },
  issued: { statusId: "issued", label: "Issued" },
  superseded: { statusId: "superseded", label: "Superseded" },
  archived: { statusId: "archived", label: "Archived" },
};
