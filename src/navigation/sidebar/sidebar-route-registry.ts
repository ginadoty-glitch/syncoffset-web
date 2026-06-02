/**
 * Route truthfulness registry (SYNCOFFSET_NO_MOCK_RULE).
 * Routes listed here remain on disk but are not linked from production navigation.
 */

export type RouteClassification = "PRODUCTION READY" | "PARTIALLY IMPLEMENTED" | "PLACEHOLDER" | "MOCK" | "DEPRECATED";

export type RouteDataSource = "Supabase" | "AsyncStorage" | "Mock" | "Seed" | "Context" | "None";

export type HiddenRouteEntry = {
  path: string;
  classification: RouteClassification;
  dataSource: RouteDataSource;
  note?: string;
};

/** MOCK + Studio Admin demos — excluded from sidebar, search, and production shortcuts. */
export const hiddenMockRoutes: readonly HiddenRouteEntry[] = [
  {
    path: "/dashboard/logistics",
    classification: "MOCK",
    dataSource: "Mock",
    note: "shipment-data.ts, operational-data.ts",
  },
  { path: "/dashboard/logistics/brokerage", classification: "MOCK", dataSource: "Mock", note: "brokerage-data.ts" },
  { path: "/dashboard/logistics/transport-orders", classification: "PLACEHOLDER", dataSource: "None" },
  { path: "/dashboard/logistics/shipments", classification: "PLACEHOLDER", dataSource: "None" },
  { path: "/dashboard/logistics/rush", classification: "PLACEHOLDER", dataSource: "None" },
  { path: "/dashboard/logistics/holdbacks", classification: "PLACEHOLDER", dataSource: "None" },
  { path: "/dashboard/communications/chat", classification: "MOCK", dataSource: "Mock", note: "chat-data.ts" },
  { path: "/dashboard/communications/email", classification: "MOCK", dataSource: "Mock", note: "email-data.ts" },
  {
    path: "/dashboard/communications/notifications",
    classification: "MOCK",
    dataSource: "Mock",
    note: "notifications-data.ts",
  },
  { path: "/dashboard/default", classification: "MOCK", dataSource: "Mock", note: "Studio Admin demo" },
  { path: "/dashboard/default-v1", classification: "MOCK", dataSource: "Mock", note: "Studio Admin demo" },
  { path: "/dashboard/crm", classification: "MOCK", dataSource: "Mock", note: "Studio Admin demo" },
  {
    path: "/dashboard/finance",
    classification: "MOCK",
    dataSource: "Mock",
    note: "Studio Admin personal finance template",
  },
  { path: "/dashboard/finance-v1", classification: "MOCK", dataSource: "Mock", note: "Studio Admin demo" },
  { path: "/dashboard/ecommerce", classification: "MOCK", dataSource: "Mock", note: "Studio Admin demo" },
  { path: "/dashboard/analytics", classification: "MOCK", dataSource: "Mock", note: "Studio Admin demo" },
  { path: "/dashboard/productivity", classification: "MOCK", dataSource: "Mock", note: "Studio Admin demo" },
  { path: "/dashboard/users", classification: "MOCK", dataSource: "Mock", note: "Studio Admin demo" },
  { path: "/dashboard/academy", classification: "MOCK", dataSource: "Mock", note: "Studio Admin demo" },
  { path: "/dashboard/mail", classification: "MOCK", dataSource: "Mock", note: "iframe to /mail" },
  { path: "/mail", classification: "MOCK", dataSource: "Mock", note: "mail/_components/data.tsx" },
] as const;

export const productionHomePath = "/dashboard/sets";
