/**
 * Email mock data — production office correspondence.
 *
 * Frontend-only. Folders map to operational buckets used on a show:
 * Inbox / Sent / Drafts plus two production-specific lanes —
 * Brokerage (customs/broker threads) and Approvals (sign-off requests).
 */

export type FolderId = "inbox" | "sent" | "drafts" | "brokerage" | "approvals";

export type EmailLabel = "Brokerage" | "Approval" | "Rush" | "Clearance" | "Transport" | "Locations";

export interface EmailAttachment {
  name: string;
  kind: "pdf" | "doc" | "img" | "sheet";
  size: string;
}

export interface EmailParticipant {
  name: string;
  role: string;
  initials: string;
  email: string;
}

export interface EmailMessage {
  id: string;
  folder: FolderId;
  from: EmailParticipant;
  to: string;
  subject: string;
  preview: string;
  body: string[];
  time: string;
  date: string;
  read: boolean;
  starred: boolean;
  priority?: "rush" | "attention";
  labels: EmailLabel[];
  attachments: EmailAttachment[];
  ref?: string;
}

export const folders: { id: FolderId; label: string }[] = [
  { id: "inbox", label: "Inbox" },
  { id: "sent", label: "Sent" },
  { id: "drafts", label: "Drafts" },
  { id: "brokerage", label: "Brokerage" },
  { id: "approvals", label: "Approvals" },
];

export const emails: EmailMessage[] = [
  {
    id: "e-1",
    folder: "inbox",
    from: { name: "Priya Anand", role: "Customs Broker", initials: "PA", email: "priya@summitcustoms.com" },
    to: "dispatch@syncoffset.com",
    subject: "RE: Carnet 2026-0142 — camera package cleared",
    preview: "The line released the carnet this morning. Cleared packet attached, you're good to roll on TO-318.",
    body: [
      "Hi Dana,",
      "Good news — the line released Carnet 2026-0142 this morning and the camera package is fully cleared for import. I've attached the stamped packet and the clearance record for your files.",
      "Please make sure the signed CI travels with the vehicle. If anyone at the dock asks, the reference is CI-2026-0142.",
      "Let me know once it's delivered and I'll close the file.",
      "— Priya",
    ],
    time: "14:11",
    date: "Today",
    read: false,
    starred: true,
    priority: "rush",
    labels: ["Brokerage", "Clearance"],
    attachments: [
      { name: "Carnet-2026-0142-cleared.pdf", kind: "pdf", size: "412 KB" },
      { name: "Clearance-Record-0142.pdf", kind: "pdf", size: "88 KB" },
    ],
    ref: "CI-2026-0142",
  },
  {
    id: "e-2",
    folder: "inbox",
    from: { name: "Hannah Brooks", role: "Production Coordinator", initials: "HB", email: "hannah@syncoffset.com" },
    to: "all-transport@syncoffset.com",
    subject: "Call Sheet D12 — Revision C (company move re-timed)",
    preview: "Rev C is out. Company move pushed to 15:30. Please re-time all transport and confirm receipt.",
    body: [
      "Team,",
      "Revision C for Day 12 is attached. The headline change: the company move from the Craftsman to Stage 6 is now scheduled for 15:30, not 14:00.",
      "Transport — please re-time all base camp and equipment moves accordingly and confirm receipt so I can update the distribution log.",
      "Thanks,",
      "Hannah",
    ],
    time: "13:40",
    date: "Today",
    read: false,
    starred: false,
    priority: "attention",
    labels: ["Transport"],
    attachments: [{ name: "CallSheet-D12-RevC.pdf", kind: "pdf", size: "1.2 MB" }],
    ref: "CS-D12-RevC",
  },
  {
    id: "e-3",
    folder: "inbox",
    from: { name: "Tom Reyes", role: "Location Manager", initials: "TR", email: "tom@syncoffset.com" },
    to: "dispatch@syncoffset.com",
    subject: "Lankershim closure — reroute base camp via Vineland",
    preview: "Northbound Lankershim is closed for the parade until 14:00. Route all moves through Vineland.",
    body: [
      "Heads up dispatch —",
      "Northbound Lankershim is closed for a street parade until 14:00. Any base camp or equipment moves heading to the location need to reroute via Vineland.",
      "I've flagged it with Locations PA on the ground; she'll wave vehicles through the side gate.",
      "Tom",
    ],
    time: "13:20",
    date: "Today",
    read: true,
    starred: false,
    labels: ["Locations"],
    attachments: [],
    ref: "LOC-14",
  },
  {
    id: "e-4",
    folder: "inbox",
    from: { name: "Atlas Freight", role: "Carrier Ops", initials: "AF", email: "ops@atlasfreight.com" },
    to: "dispatch@syncoffset.com",
    subject: "Pickup confirmation — Omega Drapery set dec rolls",
    preview: "Padded van assigned for the Omega Drapery pickup. Two rolls plus chandelier, 16:00 window.",
    body: [
      "Confirming the padded van for the Omega Drapery pickup at 16:00 — two rolls plus the chandelier, handled fragile.",
      "Driver will call ahead 15 minutes out. Please have the dock clear.",
    ],
    time: "12:58",
    date: "Today",
    read: true,
    starred: false,
    labels: ["Transport"],
    attachments: [],
    ref: "SD-PICKUP-09",
  },
  {
    id: "e-5",
    folder: "approvals",
    from: { name: "Dana Cole", role: "Transport Coordinator", initials: "DC", email: "dana@syncoffset.com" },
    to: "sky@syncoffset.com",
    subject: "Approval needed: additional driver for D12 company move",
    preview: "Requesting sign-off for one additional driver to cover the 15:30 company move. Est. 4 hrs OT.",
    body: [
      "Sky,",
      "With the company move re-timed to 15:30 and scene 47 running long, I need one additional driver to keep the equipment move on schedule.",
      "Estimated four hours, charged to the D12 transport line. Requesting your approval to book.",
      "Dana",
    ],
    time: "13:48",
    date: "Today",
    read: false,
    starred: false,
    priority: "attention",
    labels: ["Approval", "Transport"],
    attachments: [],
    ref: "TO-322",
  },
  {
    id: "e-6",
    folder: "approvals",
    from: { name: "Sky Nguyen", role: "UPM", initials: "SN", email: "sky@syncoffset.com" },
    to: "dana@syncoffset.com",
    subject: "RE: Overtime authorization — D12 transport",
    preview: "Approved. Book the additional driver and the 10-ton on standby. Keep me posted on the move.",
    body: [
      "Approved — book the additional driver and keep the 10-ton on standby for the rush run.",
      "Send me the final transport call once Locations confirms the move time.",
      "Sky",
    ],
    time: "13:52",
    date: "Today",
    read: true,
    starred: false,
    labels: ["Approval"],
    attachments: [],
    ref: "TO-322",
  },
  {
    id: "e-7",
    folder: "brokerage",
    from: { name: "Priya Anand", role: "Customs Broker", initials: "PA", email: "priya@summitcustoms.com" },
    to: "dispatch@syncoffset.com",
    subject: "Hand carry — DOP travels with lens kit Thursday",
    preview: "For the Thursday hand carry, I'll need the DOP's passport details and the lens kit valuation by EOD.",
    body: [
      "Hi Dana,",
      "For the Thursday hand carry of the lens kit, I'll need the DOP's passport details and an itemized valuation for the customs declaration by end of day.",
      "Once I have those I'll prepare the hand carry packet and brief the DOP on what to present at the gate.",
      "— Priya",
    ],
    time: "11:30",
    date: "Today",
    read: true,
    starred: true,
    labels: ["Brokerage"],
    attachments: [{ name: "HandCarry-Checklist.pdf", kind: "pdf", size: "64 KB" }],
    ref: "HC-2026-0007",
  },
  {
    id: "e-8",
    folder: "brokerage",
    from: { name: "Bayline Customs", role: "Clearance Desk", initials: "BC", email: "clearance@baylinecustoms.com" },
    to: "dispatch@syncoffset.com",
    subject: "Documentation request — vehicle picture car import",
    preview: "We need the commercial invoice and proof of temporary import for the picture car before it ships.",
    body: [
      "To proceed with the picture car import we require the commercial invoice and proof of temporary import.",
      "Without these the unit will be held at the bonded warehouse. Please forward at your earliest convenience.",
    ],
    time: "Yesterday",
    date: "Yesterday",
    read: true,
    starred: false,
    priority: "attention",
    labels: ["Brokerage", "Clearance"],
    attachments: [],
    ref: "CI-2026-0151",
  },
  {
    id: "e-9",
    folder: "sent",
    from: { name: "Gina Doty", role: "Studio Admin", initials: "GD", email: "gina@syncoffset.com" },
    to: "priya@summitcustoms.com",
    subject: "RE: Carnet 2026-0142 — camera package cleared",
    preview: "Received, thank you Priya. CI is printed and travelling with the vehicle now.",
    body: [
      "Received, thank you Priya.",
      "The signed CI is printed and travelling with the vehicle now. Will confirm delivery at Stage 6.",
      "Gina",
    ],
    time: "14:16",
    date: "Today",
    read: true,
    starred: false,
    labels: ["Brokerage"],
    attachments: [],
    ref: "CI-2026-0142",
  },
  {
    id: "e-10",
    folder: "drafts",
    from: { name: "Gina Doty", role: "Studio Admin", initials: "GD", email: "gina@syncoffset.com" },
    to: "all-transport@syncoffset.com",
    subject: "Draft: Wrap transport schedule — Week 4",
    preview: "Outline of the wrap-week return runs and vendor drop-offs. Still pending the final wrap date…",
    body: [
      "DRAFT — not yet sent.",
      "Outline of the wrap-week return runs and vendor drop-offs. Still pending the final wrap date from the production office before this goes out.",
    ],
    time: "10:02",
    date: "Today",
    read: true,
    starred: false,
    labels: ["Transport"],
    attachments: [],
  },
];

export const folderCounts: Record<FolderId, { total: number; unread: number }> = folders.reduce(
  (acc, folder) => {
    const inFolder = emails.filter((e) => e.folder === folder.id);
    acc[folder.id] = { total: inFolder.length, unread: inFolder.filter((e) => !e.read).length };
    return acc;
  },
  {} as Record<FolderId, { total: number; unread: number }>,
);
