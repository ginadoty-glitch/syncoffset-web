/**
 * SyncOffset Communication Authority — lifecycle vocabulary (registry only)
 * @see docs/SYNCOFFSET_COMMUNICATION_AUTHORITY.md
 */

export type CommunicationStatus = "draft" | "queued" | "distributed" | "delivered" | "read" | "archived";

export type CommunicationStatusDefinition = {
  readonly statusId: CommunicationStatus;
  readonly label: string;
};

export const COMMUNICATION_STATUS_REGISTRY: Record<CommunicationStatus, CommunicationStatusDefinition> = {
  draft: { statusId: "draft", label: "Draft" },
  queued: { statusId: "queued", label: "Queued" },
  distributed: { statusId: "distributed", label: "Distributed" },
  delivered: { statusId: "delivered", label: "Delivered" },
  read: { statusId: "read", label: "Read" },
  archived: { statusId: "archived", label: "Archived" },
};
