/**
 * Chat mock data — film production operations channels.
 *
 * Frontend-only. No backend wiring. Structured to mirror the operational
 * language of Logistics: every message can carry an operational ref
 * (transport order, CI, location) and a priority signal.
 */

export type ChannelId = "transportation" | "production-office" | "locations" | "set-dec" | "props";

export type MessagePriority = "rush" | "alert" | "info";

export interface ChatChannel {
  id: ChannelId;
  label: string;
  topic: string;
  unread: number;
  members: number;
  lastActivity: string;
  /** Highest open signal on the channel, drives the row accent. */
  signal?: MessagePriority;
}

export interface ChatMessage {
  id: string;
  channelId: ChannelId;
  author: string;
  role: string;
  initials: string;
  time: string;
  text: string;
  /** Linked operational reference, e.g. TO-318 / CI-2026-0142. */
  ref?: string;
  priority?: MessagePriority;
  pinned?: boolean;
}

export type Presence = "on-shift" | "standby" | "wrapped";

export interface DirectMessage {
  id: string;
  name: string;
  role: string;
  initials: string;
  presence: Presence;
  unread: number;
  preview: string;
  time: string;
}

export interface ChannelMember {
  name: string;
  role: string;
  initials: string;
  presence: Presence;
}

export const channels: ChatChannel[] = [
  {
    id: "transportation",
    label: "Transportation",
    topic: "Dispatch coordination · driver assignments · live movement",
    unread: 4,
    members: 9,
    lastActivity: "1m",
    signal: "rush",
  },
  {
    id: "production-office",
    label: "Production Office",
    topic: "Call sheets · revisions · departmental coordination",
    unread: 2,
    members: 14,
    lastActivity: "6m",
    signal: "alert",
  },
  {
    id: "locations",
    label: "Locations",
    topic: "Site access · permits · base camp · neighbor relations",
    unread: 0,
    members: 7,
    lastActivity: "18m",
    signal: "alert",
  },
  {
    id: "set-dec",
    label: "Set Dec",
    topic: "Dressing moves · returns · vendor pickups",
    unread: 1,
    members: 6,
    lastActivity: "32m",
  },
  {
    id: "props",
    label: "Props",
    topic: "Hero props · weapons handling · continuity holds",
    unread: 0,
    members: 5,
    lastActivity: "1h",
  },
];

export const directMessages: DirectMessage[] = [
  {
    id: "dm-1",
    name: "Dana Cole",
    role: "Transport Coordinator",
    initials: "DC",
    presence: "on-shift",
    unread: 2,
    preview: "Re-staging the 5-ton, gate 2 is blocked",
    time: "2m",
  },
  {
    id: "dm-2",
    name: "Marco Reyes",
    role: "Dispatcher",
    initials: "MR",
    presence: "on-shift",
    unread: 0,
    preview: "Luis is fueled, holding on CI",
    time: "9m",
  },
  {
    id: "dm-3",
    name: "Priya Anand",
    role: "Customs Broker",
    initials: "PA",
    presence: "standby",
    unread: 1,
    preview: "Carnet docs back from the line",
    time: "27m",
  },
  {
    id: "dm-4",
    name: "Sky Nguyen",
    role: "UPM",
    initials: "SN",
    presence: "on-shift",
    unread: 0,
    preview: "Approved the overtime for D12",
    time: "44m",
  },
  {
    id: "dm-5",
    name: "Tom Reyes",
    role: "Location Manager",
    initials: "TR",
    presence: "wrapped",
    unread: 0,
    preview: "Neighbor signed off, we're clear",
    time: "3h",
  },
];

export const channelMembers: Record<ChannelId, ChannelMember[]> = {
  transportation: [
    { name: "Dana Cole", role: "Transport Coordinator", initials: "DC", presence: "on-shift" },
    { name: "Marco Reyes", role: "Dispatcher", initials: "MR", presence: "on-shift" },
    { name: "Luis Ferreira", role: "Driver · 5-ton", initials: "LF", presence: "on-shift" },
    { name: "Gina Doty", role: "Studio Admin", initials: "GD", presence: "on-shift" },
    { name: "Priya Anand", role: "Customs Broker", initials: "PA", presence: "standby" },
    { name: "Sky Nguyen", role: "UPM", initials: "SN", presence: "on-shift" },
  ],
  "production-office": [
    { name: "Sky Nguyen", role: "UPM", initials: "SN", presence: "on-shift" },
    { name: "Hannah Brooks", role: "Production Coordinator", initials: "HB", presence: "on-shift" },
    { name: "Gina Doty", role: "Studio Admin", initials: "GD", presence: "on-shift" },
    { name: "Andre Lewis", role: "1st AD", initials: "AL", presence: "standby" },
  ],
  locations: [
    { name: "Tom Reyes", role: "Location Manager", initials: "TR", presence: "on-shift" },
    { name: "Elena Ross", role: "Assistant LM", initials: "ER", presence: "on-shift" },
    { name: "Dana Cole", role: "Transport Coordinator", initials: "DC", presence: "standby" },
  ],
  "set-dec": [
    { name: "Frances Cole", role: "Set Decorator", initials: "FC", presence: "on-shift" },
    { name: "Paul Renner", role: "Lead Dresser", initials: "PR", presence: "on-shift" },
    { name: "Dana Cole", role: "Transport Coordinator", initials: "DC", presence: "standby" },
  ],
  props: [
    { name: "David Hassan", role: "Property Master", initials: "DH", presence: "on-shift" },
    { name: "Erin Shaw", role: "Assistant Props", initials: "ES", presence: "standby" },
  ],
};

export const messages: ChatMessage[] = [
  // ── Transportation ──────────────────────────────────────────────────────────
  {
    id: "m-t1",
    channelId: "transportation",
    author: "Dana Cole",
    role: "Transport Coordinator",
    initials: "DC",
    time: "13:58",
    text: "Heads up — broker docs for the camera package are still outstanding. Holding TO-318 at Pier 14 until the CI clears.",
    ref: "TO-318",
    priority: "alert",
    pinned: true,
  },
  {
    id: "m-t2",
    channelId: "transportation",
    author: "Marco Reyes",
    role: "Dispatcher",
    initials: "MR",
    time: "14:02",
    text: "Copy. Luis is fueled and staged, monitoring radio CH-3. He can roll the second we get clearance.",
  },
  {
    id: "m-t3",
    channelId: "transportation",
    author: "Priya Anand",
    role: "Customs Broker",
    initials: "PA",
    time: "14:11",
    text: "Carnet 2026-0142 is back from the line — signed and stamped. Forwarding the cleared packet to dispatch now.",
    ref: "CI-2026-0142",
    priority: "info",
  },
  {
    id: "m-t4",
    channelId: "transportation",
    author: "Dana Cole",
    role: "Transport Coordinator",
    initials: "DC",
    time: "14:13",
    text: "That's the one we needed. Marco — release TO-318. Destination is Stage 6 loading dock, not the mill.",
    ref: "TO-318",
    priority: "rush",
  },
  {
    id: "m-t5",
    channelId: "transportation",
    author: "Luis Ferreira",
    role: "Driver · 5-ton",
    initials: "LF",
    time: "14:15",
    text: "Rolling from Pier 14. ETA Stage 6 about 22 minutes with the bridge traffic.",
  },
  {
    id: "m-t6",
    channelId: "transportation",
    author: "Sky Nguyen",
    role: "UPM",
    initials: "SN",
    time: "14:21",
    text: "Good work clearing that fast. Keep the 10-ton on standby — we may need a rush run to set dec before lunch.",
    priority: "alert",
  },
  // ── Production Office ───────────────────────────────────────────────────────
  {
    id: "m-p1",
    channelId: "production-office",
    author: "Hannah Brooks",
    role: "Production Coordinator",
    initials: "HB",
    time: "13:40",
    text: "Call sheet Rev C is out for D12. Company move pushed to 15:30 — please re-time all transport accordingly.",
    ref: "CS-D12-RevC",
    priority: "alert",
    pinned: true,
  },
  {
    id: "m-p2",
    channelId: "production-office",
    author: "Andre Lewis",
    role: "1st AD",
    initials: "AL",
    time: "13:46",
    text: "We're running long on scene 47. Realistically the move is closer to 16:00. Will confirm at second meal.",
  },
  {
    id: "m-p3",
    channelId: "production-office",
    author: "Sky Nguyen",
    role: "UPM",
    initials: "SN",
    time: "13:52",
    text: "Approved the additional driver for the company move. Charge to D12 transport line.",
    priority: "info",
  },
  // ── Locations ───────────────────────────────────────────────────────────────
  {
    id: "m-l1",
    channelId: "locations",
    author: "Tom Reyes",
    role: "Location Manager",
    initials: "TR",
    time: "13:20",
    text: "Lankershim is closed northbound for the parade until 14:00 — reroute all base camp moves via Vineland.",
    priority: "alert",
    pinned: true,
  },
  {
    id: "m-l2",
    channelId: "locations",
    author: "Elena Ross",
    role: "Assistant LM",
    initials: "ER",
    time: "13:28",
    text: "Neighbor at the Craftsman signed the noise waiver. We're clear to run generators past 22:00.",
  },
  // ── Set Dec ─────────────────────────────────────────────────────────────────
  {
    id: "m-s1",
    channelId: "set-dec",
    author: "Frances Cole",
    role: "Set Decorator",
    initials: "FC",
    time: "12:55",
    text: "Vendor pickup at Omega Drapery is ready — two rolls plus the chandelier. Needs a padded van, not the stake bed.",
    priority: "info",
  },
  {
    id: "m-s2",
    channelId: "set-dec",
    author: "Paul Renner",
    role: "Lead Dresser",
    initials: "PR",
    time: "13:05",
    text: "Returns from the Penthouse set are boxed and labeled. Hold for the wrap run, no rush.",
  },
  // ── Props ───────────────────────────────────────────────────────────────────
  {
    id: "m-pr1",
    channelId: "props",
    author: "David Hassan",
    role: "Property Master",
    initials: "DH",
    time: "12:30",
    text: "Hero weapons stay in my custody for the transfer — armorer rides with the vehicle. No exceptions on continuity holds.",
    priority: "alert",
    pinned: true,
  },
  {
    id: "m-pr2",
    channelId: "props",
    author: "Erin Shaw",
    role: "Assistant Props",
    initials: "ES",
    time: "12:38",
    text: "Understood. I'll prep the lockbox and the chain-of-custody sheet for sign-off.",
  },
];

/** Pinned operational references surfaced in the context rail per channel. */
export const channelLinkedRefs: Record<ChannelId, string[]> = {
  transportation: ["TO-318", "TO-322", "CI-2026-0142"],
  "production-office": ["CS-D12-RevC"],
  locations: ["LOC-14", "PERMIT-228"],
  "set-dec": ["SD-PICKUP-09"],
  props: ["PROP-HOLD-03"],
};
