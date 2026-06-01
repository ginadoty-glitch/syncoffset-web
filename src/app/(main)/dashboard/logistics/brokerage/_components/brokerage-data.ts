/**
 * Brokerage Docs mock data — film production customs & brokerage hub.
 *
 * Frontend-only. No database integration. Records intentionally cross-reference
 * the same operational world used across Logistics and Communications
 * (TO-318, the camera package, the picture car, the Thursday lens-kit hand carry)
 * so the module reads like a live document custody surface.
 */

export type DocType =
  | "commercial-invoice"
  | "hand-carry"
  | "carnet"
  | "customs-package"
  | "broker-correspondence"
  | "clearance-record";

export type DocStatus = "draft" | "sent" | "awaiting-clearance" | "held" | "cleared" | "amended" | "archived";

/** Operational signal — drives the row/detail accent, mirrors Logistics tiers. */
export type Signal = "blocker" | "attention" | "info" | "clear";

export interface Broker {
  name: string;
  company: string;
  email: string;
  country: string;
}

export interface DocAttachment {
  name: string;
  kind: "pdf" | "doc" | "img" | "xls";
  size: string;
}

export interface BrokerageEvent {
  time: string;
  actor: string;
  action: string;
  note?: string;
  type: "created" | "sent" | "clearance" | "amended" | "attachment" | "correspondence" | "archived";
}

export interface DocField {
  label: string;
  value: string;
}

export interface BrokerageDoc {
  id: string;
  type: DocType;
  title: string;
  status: DocStatus;
  signal: Signal;
  priority?: boolean;
  broker: Broker;
  origin: { country: string; code: string };
  destination: { country: string; code: string };
  linkedOrder?: string;
  shipment?: string;
  valueDisplay?: string;
  goods: string;
  /** Carnet / hand-carry expiry or validity window where relevant. */
  expiry?: string;
  /** Days until expiry — negative = expired, undefined = N/A. */
  expiresInDays?: number;
  createdBy: string;
  created: string;
  updated: string;
  summary: string;
  fields: DocField[];
  attachments: DocAttachment[];
  history: BrokerageEvent[];
}

export const brokerageDocs: BrokerageDoc[] = [
  {
    id: "CI-2026-0151",
    type: "commercial-invoice",
    title: "Picture car — 1968 Mustang fastback",
    status: "held",
    signal: "blocker",
    priority: true,
    broker: {
      name: "Bayline Customs",
      company: "Bayline Customs Brokers",
      email: "clearance@baylinecustoms.com",
      country: "US",
    },
    origin: { country: "United Kingdom", code: "GB" },
    destination: { country: "United States", code: "US" },
    linkedOrder: "TO-329",
    shipment: "SHP-1187",
    valueDisplay: "$92,000 USD",
    goods: "Hero picture vehicle, temporary import",
    createdBy: "Dana Cole",
    created: "27 May 2026",
    updated: "1h",
    summary:
      "Picture car is held at the bonded warehouse pending the commercial invoice and proof of temporary import. Bayline cannot release the unit to set until both documents are on file. Flagged to production — this gates the Day 14 driving sequence.",
    fields: [
      { label: "Importer of Record", value: "SyncOffset Productions LLC" },
      { label: "Incoterms", value: "DAP — Stage 6" },
      { label: "HS Code", value: "8703.23 (temporary)" },
      { label: "Bond", value: "Pending — TIB required" },
      { label: "Entry Port", value: "LAX Bonded · Warehouse 4" },
    ],
    attachments: [{ name: "Picture-Car-Spec-Sheet.pdf", kind: "pdf", size: "210 KB" }],
    history: [
      { time: "27 May · 09:14", actor: "Dana Cole", action: "Created commercial invoice draft", type: "created" },
      {
        time: "27 May · 16:40",
        actor: "Bayline Customs",
        action: "Returned for missing TIB proof",
        type: "correspondence",
        note: "Hold placed at bonded warehouse.",
      },
      {
        time: "Today · 13:02",
        actor: "Bayline Customs",
        action: "Documentation request escalated",
        type: "correspondence",
      },
    ],
  },
  {
    id: "HC-2026-0007",
    type: "hand-carry",
    title: "DOP lens kit — Thursday hand carry",
    status: "awaiting-clearance",
    signal: "attention",
    priority: true,
    broker: { name: "Priya Anand", company: "Summit Customs Brokers", email: "priya@summitcustoms.com", country: "US" },
    origin: { country: "United States", code: "US" },
    destination: { country: "Canada", code: "CA" },
    linkedOrder: "TO-318",
    shipment: "SHP-1162",
    valueDisplay: "$62,000 USD",
    goods: "Anamorphic prime set + matte box, carried by DOP",
    expiry: "Departs Thu 06:40 — YVR",
    createdBy: "Gina Doty",
    created: "Today",
    updated: "1h",
    summary:
      "Hand carry packet for the DOP travelling Thursday with the anamorphic prime set. Broker needs passport details and an itemized valuation by end of day to finalize the declaration and brief the DOP on what to present at the gate.",
    fields: [
      { label: "Carrier", value: "M. Halloran (DOP)" },
      { label: "Passport on file", value: "Pending — requested" },
      { label: "Flight", value: "AC 558 · LAX→YVR · 06:40" },
      { label: "Items", value: "6 primes, 1 matte box, 1 follow focus" },
      { label: "Declared Value", value: "$62,000 USD" },
    ],
    attachments: [{ name: "HandCarry-Checklist.pdf", kind: "pdf", size: "64 KB" }],
    history: [
      { time: "Today · 11:30", actor: "Priya Anand", action: "Requested passport + valuation", type: "correspondence" },
      { time: "Today · 11:48", actor: "Gina Doty", action: "Created hand carry packet", type: "created" },
    ],
  },
  {
    id: "CI-2026-0142",
    type: "commercial-invoice",
    title: "Camera package — A & B cameras",
    status: "cleared",
    signal: "clear",
    broker: { name: "Priya Anand", company: "Summit Customs Brokers", email: "priya@summitcustoms.com", country: "US" },
    origin: { country: "Canada", code: "CA" },
    destination: { country: "United States", code: "US" },
    linkedOrder: "TO-318",
    shipment: "SHP-1158",
    valueDisplay: "$148,500 USD",
    goods: "A & B camera bodies, lenses, support",
    createdBy: "Gina Doty",
    created: "26 May 2026",
    updated: "3h",
    summary:
      "Commercial invoice for the A & B camera package. Cleared customs this morning under Carnet 2026-0142; signed CI is travelling with the vehicle to the Stage 6 loading dock. File ready to close on delivery confirmation.",
    fields: [
      { label: "Importer of Record", value: "SyncOffset Productions LLC" },
      { label: "Incoterms", value: "DAP — Stage 6" },
      { label: "HS Code", value: "9007.10" },
      { label: "Country of Origin", value: "Canada" },
      { label: "Linked Carnet", value: "CARNET-2026-0142" },
    ],
    attachments: [
      { name: "CI-2026-0142-signed.pdf", kind: "pdf", size: "318 KB" },
      { name: "Packing-List.xls", kind: "xls", size: "44 KB" },
    ],
    history: [
      { time: "26 May · 14:05", actor: "Gina Doty", action: "Created and signed CI", type: "created" },
      { time: "26 May · 14:22", actor: "Gina Doty", action: "Emailed broker", type: "sent" },
      {
        time: "Today · 11:11",
        actor: "Priya Anand",
        action: "Cleared by the line",
        type: "clearance",
        note: "Carnet released, packet forwarded.",
      },
    ],
  },
  {
    id: "CARNET-2026-0142",
    type: "carnet",
    title: "Grip & electric package — ATA Carnet",
    status: "cleared",
    signal: "attention",
    broker: { name: "Priya Anand", company: "Summit Customs Brokers", email: "priya@summitcustoms.com", country: "US" },
    origin: { country: "United States", code: "US" },
    destination: { country: "Canada", code: "CA" },
    linkedOrder: "TO-318",
    valueDisplay: "$240,000 USD",
    goods: "Grip & electric package, distro, cabling",
    expiry: "Expires 20 Jun 2026",
    expiresInDays: 21,
    createdBy: "Gina Doty",
    created: "02 May 2026",
    updated: "1d",
    summary:
      "ATA Carnet covering the grip & electric package for the cross-border shoot. Currently cleared and in use, but the carnet validity window closes in 21 days — all covered gear must re-enter or be re-papered before expiry to avoid duty exposure.",
    fields: [
      { label: "Carnet No.", value: "US-2026-0142-ATA" },
      { label: "Issued By", value: "US Council for Intl. Business" },
      { label: "Validity", value: "02 May – 20 Jun 2026" },
      { label: "Countries", value: "US · CA" },
      { label: "Goods Category", value: "Professional equipment" },
    ],
    attachments: [{ name: "Carnet-2026-0142.pdf", kind: "pdf", size: "402 KB" }],
    history: [
      { time: "02 May · 10:00", actor: "Gina Doty", action: "Carnet issued", type: "created" },
      { time: "26 May · 11:11", actor: "Priya Anand", action: "Counterfoil stamped — import", type: "clearance" },
    ],
  },
  {
    id: "CUST-2026-0033",
    type: "customs-package",
    title: "Full unit import — Day 1 shipment",
    status: "sent",
    signal: "info",
    broker: {
      name: "Bayline Customs",
      company: "Bayline Customs Brokers",
      email: "clearance@baylinecustoms.com",
      country: "US",
    },
    origin: { country: "United Kingdom", code: "GB" },
    destination: { country: "United States", code: "US" },
    linkedOrder: "TO-302",
    shipment: "SHP-1141",
    valueDisplay: "$510,000 USD",
    goods: "Consolidated production unit — 3 containers",
    createdBy: "Dana Cole",
    created: "20 May 2026",
    updated: "2d",
    summary:
      "Consolidated customs package for the initial unit shipment — three containers of grip, lighting, and construction materials. Entry filed with Bayline; awaiting examination slot. No holds at present.",
    fields: [
      { label: "Entry No.", value: "ENT-2026-7741" },
      { label: "Entry Port", value: "Long Beach" },
      { label: "Bond", value: "Continuous — on file" },
      { label: "Contents", value: "Grip · lighting · construction" },
      { label: "Broker Ref", value: "BAY-33-7741" },
    ],
    attachments: [
      { name: "Customs-Entry-7741.pdf", kind: "pdf", size: "640 KB" },
      { name: "Container-Manifest.xls", kind: "xls", size: "120 KB" },
    ],
    history: [
      { time: "20 May · 08:30", actor: "Dana Cole", action: "Assembled customs package", type: "created" },
      { time: "20 May · 15:10", actor: "Dana Cole", action: "Filed entry with broker", type: "sent" },
    ],
  },
  {
    id: "CORR-2026-0091",
    type: "broker-correspondence",
    title: "Bonded warehouse hold — picture car",
    status: "sent",
    signal: "attention",
    broker: {
      name: "Bayline Customs",
      company: "Bayline Customs Brokers",
      email: "clearance@baylinecustoms.com",
      country: "US",
    },
    origin: { country: "United States", code: "US" },
    destination: { country: "United States", code: "US" },
    linkedOrder: "TO-329",
    goods: "Thread re: picture car documentation",
    createdBy: "Bayline Customs",
    created: "Yesterday",
    updated: "1h",
    summary:
      "Active broker thread regarding the held picture car. Bayline requires the commercial invoice and proof of temporary import before release. Three messages exchanged; awaiting our document upload.",
    fields: [
      { label: "Subject", value: "Documentation request — picture car" },
      { label: "Re", value: "CI-2026-0151" },
      { label: "Thread", value: "3 messages" },
      { label: "Last reply", value: "Bayline Customs · 1h ago" },
    ],
    attachments: [],
    history: [
      {
        time: "Yesterday · 16:40",
        actor: "Bayline Customs",
        action: "Opened thread — missing docs",
        type: "correspondence",
      },
      { time: "Today · 13:02", actor: "Bayline Customs", action: "Escalated — unit on hold", type: "correspondence" },
    ],
  },
  {
    id: "CLR-2026-0142",
    type: "clearance-record",
    title: "Clearance record — camera package",
    status: "cleared",
    signal: "clear",
    broker: { name: "Priya Anand", company: "Summit Customs Brokers", email: "priya@summitcustoms.com", country: "US" },
    origin: { country: "Canada", code: "CA" },
    destination: { country: "United States", code: "US" },
    linkedOrder: "TO-318",
    valueDisplay: "$148,500 USD",
    goods: "Clearance confirmation — A & B cameras",
    createdBy: "Priya Anand",
    created: "Today",
    updated: "3h",
    summary:
      "Clearance record confirming the camera package was released by the line under Carnet 2026-0142. Cleared packet and stamped counterfoil on file. Linked to CI-2026-0142 for audit.",
    fields: [
      { label: "Cleared Ref", value: "CLR-2026-0142" },
      { label: "Cleared By", value: "Summit Customs Brokers" },
      { label: "Date Cleared", value: "Today · 11:11" },
      { label: "Linked CI", value: "CI-2026-0142" },
      { label: "Method", value: "ATA Carnet" },
    ],
    attachments: [{ name: "Clearance-Record-0142.pdf", kind: "pdf", size: "88 KB" }],
    history: [
      { time: "Today · 11:11", actor: "Priya Anand", action: "Recorded clearance", type: "clearance" },
      { time: "Today · 11:14", actor: "Priya Anand", action: "Attached cleared packet", type: "attachment" },
    ],
  },
  {
    id: "CI-2026-0149",
    type: "commercial-invoice",
    title: "Set dec — Omega Drapery vendor rolls",
    status: "draft",
    signal: "info",
    broker: { name: "Priya Anand", company: "Summit Customs Brokers", email: "priya@summitcustoms.com", country: "US" },
    origin: { country: "United States", code: "US" },
    destination: { country: "United States", code: "US" },
    linkedOrder: "TO-322",
    valueDisplay: "$8,400 USD",
    goods: "Drapery rolls + chandelier, vendor pickup",
    createdBy: "Frances Cole",
    created: "Today",
    updated: "5h",
    summary:
      "Draft commercial invoice for the Omega Drapery vendor pickup. Domestic move — no clearance required, but a CI is being prepared for the rental valuation and insurance rider. Not yet sent.",
    fields: [
      { label: "Vendor", value: "Omega Drapery" },
      { label: "Items", value: "2 rolls, 1 chandelier" },
      { label: "Purpose", value: "Rental valuation / insurance" },
      { label: "Declared Value", value: "$8,400 USD" },
    ],
    attachments: [],
    history: [{ time: "Today · 08:55", actor: "Frances Cole", action: "Started draft", type: "created" }],
  },
  {
    id: "CARNET-2026-0151",
    type: "carnet",
    title: "Picture vehicle — temporary import carnet",
    status: "awaiting-clearance",
    signal: "attention",
    priority: true,
    broker: {
      name: "Bayline Customs",
      company: "Bayline Customs Brokers",
      email: "clearance@baylinecustoms.com",
      country: "US",
    },
    origin: { country: "United Kingdom", code: "GB" },
    destination: { country: "United States", code: "US" },
    linkedOrder: "TO-329",
    valueDisplay: "$92,000 USD",
    goods: "1968 Mustang fastback — temporary admission",
    expiry: "Expires 09 Jun 2026",
    expiresInDays: 10,
    createdBy: "Dana Cole",
    created: "24 May 2026",
    updated: "1h",
    summary:
      "Temporary import carnet for the picture vehicle, paired with CI-2026-0151. Awaiting clearance at the bonded warehouse and expiry window closes in 10 days — needs resolution before the Day 14 driving sequence.",
    fields: [
      { label: "Carnet No.", value: "GB-2026-0151-ATA" },
      { label: "Issued By", value: "London Chamber of Commerce" },
      { label: "Validity", value: "24 May – 09 Jun 2026" },
      { label: "Countries", value: "GB · US" },
      { label: "Goods Category", value: "Picture vehicle" },
    ],
    attachments: [{ name: "Carnet-2026-0151.pdf", kind: "pdf", size: "356 KB" }],
    history: [
      { time: "24 May · 09:00", actor: "Dana Cole", action: "Carnet issued", type: "created" },
      { time: "Today · 13:02", actor: "Bayline Customs", action: "Awaiting examination", type: "correspondence" },
    ],
  },
];
