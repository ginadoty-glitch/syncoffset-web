/**
 * SyncOffset Communication Authority — barrel export
 *
 * Communication — platform-independent production communication record
 * DistributionList — department / show / vendor distribution groups
 * CommunicationPackage — documentation outputs only
 */

export type { Communication } from "./communication";
export type {
  CommunicationChannel,
  DepartmentMailboxSlug,
  MailboxEndpointKind,
} from "./communication-channel";
export {
  COMMUNICATION_CHANNEL_REGISTRY,
  DEPARTMENT_MAILBOX_REGISTRY,
  MAILBOX_ENDPOINT_KIND_REGISTRY,
} from "./communication-channel";
export type { CommunicationPackage, CommunicationPackageKind } from "./communication-package";
export { COMMUNICATION_PACKAGE_KIND_REGISTRY } from "./communication-package";
export {
  COMMUNICATION_CANONICAL_RELATIONSHIP_PATHS,
  COMMUNICATION_RELATIONSHIP_SCHEMA_REGISTRY,
  COMMUNICATION_RELATIONSHIP_TARGETS,
} from "./communication-relationship-contracts";
export type { CommunicationStatus } from "./communication-status";
export { COMMUNICATION_STATUS_REGISTRY } from "./communication-status";
export type { DistributionList } from "./distribution-list";
