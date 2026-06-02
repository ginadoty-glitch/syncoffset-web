/**
 * SyncOffset Communication Authority — channel and mailbox vocabulary (registry only)
 *
 * Constitutional object is Communication — not Outlook, Gmail, or SMS (Rule 1).
 * Department mailboxes are production entities (Rule 3).
 *
 * @see docs/SYNCOFFSET_COMMUNICATION_AUTHORITY.md
 */

export type CommunicationChannel = "email" | "sms" | "push" | "chat" | "phone" | "printed";

export type CommunicationChannelDefinition = {
  readonly channelId: CommunicationChannel;
  readonly label: string;
  readonly description: string;
};

export const COMMUNICATION_CHANNEL_REGISTRY: Record<CommunicationChannel, CommunicationChannelDefinition> = {
  email: {
    channelId: "email",
    label: "Email",
    description:
      "May use Outlook, Exchange, Gmail, Apple Mail, or production office mailboxes — platform is not authority.",
  },
  sms: { channelId: "sms", label: "SMS", description: "SMS gateway delivery — not the constitutional object." },
  push: {
    channelId: "push",
    label: "Push",
    description: "Push notification delivery — not the constitutional object.",
  },
  chat: { channelId: "chat", label: "Chat", description: "Chat system delivery — not the constitutional object." },
  phone: { channelId: "phone", label: "Phone", description: "Phone call or voicemail notice." },
  printed: { channelId: "printed", label: "Printed", description: "Printed notice or handout." },
};

/** Production mailbox endpoint — not a personal account (Rule 3). */
export type MailboxEndpointKind = "department-mailbox" | "personal-mailbox";

export type MailboxEndpointKindDefinition = {
  readonly kind: MailboxEndpointKind;
  readonly label: string;
};

export const MAILBOX_ENDPOINT_KIND_REGISTRY: Record<MailboxEndpointKind, MailboxEndpointKindDefinition> = {
  "department-mailbox": {
    kind: "department-mailbox",
    label: "Department Mailbox",
  },
  "personal-mailbox": {
    kind: "personal-mailbox",
    label: "Personal Mailbox",
  },
};

/** Example department production mailboxes — constitutional endpoints, not platform accounts. */
export type DepartmentMailboxSlug =
  | "art"
  | "props"
  | "setdec"
  | "construction"
  | "locations"
  | "transport"
  | "production";

export type DepartmentMailboxDefinition = {
  readonly slug: DepartmentMailboxSlug;
  readonly label: string;
  readonly exampleAddress: string;
};

export const DEPARTMENT_MAILBOX_REGISTRY: Record<DepartmentMailboxSlug, DepartmentMailboxDefinition> = {
  art: { slug: "art", label: "Art Department", exampleAddress: "art@" },
  props: { slug: "props", label: "Props Department", exampleAddress: "props@" },
  setdec: { slug: "setdec", label: "Set Decoration", exampleAddress: "setdec@" },
  construction: { slug: "construction", label: "Construction", exampleAddress: "construction@" },
  locations: { slug: "locations", label: "Locations", exampleAddress: "locations@" },
  transport: { slug: "transport", label: "Transportation", exampleAddress: "transport@" },
  production: { slug: "production", label: "Production Office", exampleAddress: "production@" },
};
