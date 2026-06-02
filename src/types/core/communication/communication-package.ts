/**
 * SyncOffset Communication Authority — documentation package only
 *
 * No delivery logic — documentation exports only.
 * Constitutional object: kind "communication-package"
 *
 * @see docs/SYNCOFFSET_COMMUNICATION_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type CommunicationPackageKind =
  | "email-package"
  | "distribution-package"
  | "notice-package"
  | "production-update-package"
  | "department-update-package";

export type CommunicationPackageKindDefinition = {
  readonly packageKind: CommunicationPackageKind;
  readonly label: string;
};

export const COMMUNICATION_PACKAGE_KIND_REGISTRY: Record<CommunicationPackageKind, CommunicationPackageKindDefinition> =
  {
    "email-package": { packageKind: "email-package", label: "Email Package" },
    "distribution-package": { packageKind: "distribution-package", label: "Distribution Package" },
    "notice-package": { packageKind: "notice-package", label: "Notice Package" },
    "production-update-package": {
      packageKind: "production-update-package",
      label: "Production Update Package",
    },
    "department-update-package": {
      packageKind: "department-update-package",
      label: "Department Update Package",
    },
  };

export type CommunicationPackage = AuditableCoreObject & {
  readonly kind: "communication-package";
  readonly communicationId: ObjectId;
  readonly packageKind: CommunicationPackageKind;
  readonly generatedAt: Timestamp;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
