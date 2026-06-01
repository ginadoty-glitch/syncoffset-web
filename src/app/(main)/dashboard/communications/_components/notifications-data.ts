/**
 * Notifications mock data — production operations alert feed.
 *
 * Frontend-only. Categories map to the operational signals a coordinator
 * watches during a shoot day. Severity drives the accent, aligned with the
 * Logistics palette (critical=red, attention=amber, info=blue, resolved=green).
 */

export type NotificationCategory =
  | "rush-orders"
  | "clearance-delays"
  | "driver-updates"
  | "brokerage-responses"
  | "production-alerts";

export type Severity = "critical" | "attention" | "info" | "resolved";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  severity: Severity;
  title: string;
  detail: string;
  time: string;
  ref?: string;
  read: boolean;
  actionRequired?: boolean;
}

export const categoryMeta: Record<NotificationCategory, { label: string }> = {
  "rush-orders": { label: "Rush Orders" },
  "clearance-delays": { label: "Clearance Delays" },
  "driver-updates": { label: "Driver Updates" },
  "brokerage-responses": { label: "Brokerage Responses" },
  "production-alerts": { label: "Production Alerts" },
};

export const categoryOrder: NotificationCategory[] = [
  "rush-orders",
  "clearance-delays",
  "driver-updates",
  "brokerage-responses",
  "production-alerts",
];

export const notifications: NotificationItem[] = [
  {
    id: "n-1",
    category: "rush-orders",
    severity: "critical",
    title: "Rush run requested — set dec to Stage 6",
    detail:
      "UPM flagged a rush run for the Omega Drapery rolls before lunch. 10-ton on standby, needs a driver assigned.",
    time: "2m",
    ref: "TO-322",
    read: false,
    actionRequired: true,
  },
  {
    id: "n-2",
    category: "rush-orders",
    severity: "attention",
    title: "TO-318 released from Pier 14",
    detail: "Camera package cleared customs and is rolling to Stage 6 loading dock. ETA 22 minutes.",
    time: "14m",
    ref: "TO-318",
    read: false,
  },
  {
    id: "n-3",
    category: "clearance-delays",
    severity: "critical",
    title: "Picture car held at bonded warehouse",
    detail: "Bayline Customs is holding the picture car pending the commercial invoice and proof of temporary import.",
    time: "1h",
    ref: "CI-2026-0151",
    read: false,
    actionRequired: true,
  },
  {
    id: "n-4",
    category: "clearance-delays",
    severity: "resolved",
    title: "Carnet 2026-0142 cleared",
    detail: "Camera package carnet released by the line. Cleared packet forwarded to dispatch.",
    time: "3h",
    ref: "CI-2026-0142",
    read: true,
  },
  {
    id: "n-5",
    category: "driver-updates",
    severity: "info",
    title: "Luis Ferreira — staged and fueled",
    detail: "5-ton fueled and staged at Pier 14, monitoring radio CH-3. Ready to roll on clearance.",
    time: "32m",
    read: true,
  },
  {
    id: "n-6",
    category: "driver-updates",
    severity: "attention",
    title: "Reroute in effect — Lankershim closure",
    detail: "All base camp moves rerouted via Vineland until 14:00 for the street parade. Drivers notified on CH-2.",
    time: "48m",
    ref: "LOC-14",
    read: true,
  },
  {
    id: "n-7",
    category: "driver-updates",
    severity: "resolved",
    title: "10-ton returned to base camp",
    detail: "Wrap returns from the Penthouse set delivered and checked in. Vehicle back at base camp.",
    time: "2h",
    read: true,
  },
  {
    id: "n-8",
    category: "brokerage-responses",
    severity: "attention",
    title: "Hand carry docs requested for Thursday",
    detail: "Broker needs the DOP passport details and lens kit valuation by EOD to prep the hand carry packet.",
    time: "1h",
    ref: "HC-2026-0007",
    read: false,
    actionRequired: true,
  },
  {
    id: "n-9",
    category: "brokerage-responses",
    severity: "info",
    title: "Broker confirmed clearance packet receipt",
    detail: "Summit Customs acknowledged the cleared packet for the camera package and closed the file.",
    time: "2h",
    ref: "CI-2026-0142",
    read: true,
  },
  {
    id: "n-10",
    category: "production-alerts",
    severity: "attention",
    title: "Call Sheet D12 — Revision C issued",
    detail: "Company move pushed to 15:30. All transport must re-time and confirm receipt with the production office.",
    time: "54m",
    ref: "CS-D12-RevC",
    read: false,
    actionRequired: true,
  },
  {
    id: "n-11",
    category: "production-alerts",
    severity: "info",
    title: "Scene 47 running long",
    detail: "1st AD estimates the company move slips closer to 16:00. Confirmation expected at second meal.",
    time: "1h",
    read: true,
  },
  {
    id: "n-12",
    category: "production-alerts",
    severity: "resolved",
    title: "Noise waiver signed — Craftsman location",
    detail: "Neighbor signed the noise waiver. Generators cleared to run past 22:00.",
    time: "3h",
    ref: "PERMIT-228",
    read: true,
  },
];
