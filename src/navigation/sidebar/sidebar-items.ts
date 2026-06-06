import {
  AlertTriangle,
  Bell,
  BookOpen,
  Building2,
  Calculator,
  Calendar,
  CalendarDays,
  ClipboardList,
  Coins,
  CreditCard,
  Database,
  DollarSign,
  FileText,
  Film,
  Image,
  Key,
  Landmark,
  LayoutDashboard,
  List,
  ListTree,
  type LucideIcon,
  Mail,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  Package,
  Palette,
  Receipt,
  ReceiptText,
  Route,
  ScrollText,
  Settings,
  Shield,
  TrendingUp,
  Truck,
  Upload,
  Users,
  Video,
  Wrench,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

/**
 * Canon desktop information architecture.
 *
 * Eight groups ordered per the approved desktop canon.
 * Existing functional routes retain `isNew` to signal data-backed status.
 * Shell-only workspaces have no flags — they are permanent architecture
 * awaiting implementation.
 */
export const sidebarItems: NavGroup[] = [
  // ─── PRODUCTION ────────────────────────────────────────────────
  {
    id: 1,
    label: "Production",
    items: [
      { title: "Script", url: "/dashboard/script-hub", icon: ScrollText, isNew: true },
      { title: "Script Revisions", url: "/dashboard/script-revisions", icon: FileText },
      { title: "Script Breakdown", url: "/dashboard/script-breakdown", icon: ListTree },
      { title: "Prep Memo", url: "/dashboard/prep-memo", icon: ClipboardList },
      { title: "Production Calendar", url: "/dashboard/production-calendar", icon: Calendar, isNew: true },
      { title: "Locations", url: "/dashboard/locations", icon: MapPin, isNew: true },
      { title: "Tech Packs", url: "/dashboard/tech-packs", icon: Wrench },
      { title: "Shooting Schedule", url: "/dashboard/shooting-schedule", icon: CalendarDays },
      { title: "One-Line Schedule", url: "/dashboard/one-line-schedule", icon: List },
      { title: "Cast Lists", url: "/dashboard/cast-lists", icon: Users },
      { title: "Cast DOODs", url: "/dashboard/cast-doods", icon: Calendar },
      { title: "Stunt Performer Lists", url: "/dashboard/stunt-performer-lists", icon: Shield },
      { title: "BG Performer Breakdowns", url: "/dashboard/bg-performer-breakdowns", icon: Users },
    ],
  },

  // ─── LOGISTICS ─────────────────────────────────────────────────
  // All items are tabs/views within the Logistics workspace (/dashboard/logistics).
  {
    id: 2,
    label: "Logistics",
    items: [
      { title: "Transport Orders", url: "/dashboard/logistics/transport-orders", icon: Truck },
      { title: "Trips", url: "/dashboard/logistics/trips", icon: Route },
      { title: "Maps", url: "/dashboard/logistics/maps", icon: MapIcon },
      { title: "Shipment Tracking", url: "/dashboard/logistics/shipment-tracking", icon: Package },
      { title: "Work Requests", url: "/dashboard/logistics/work-requests", icon: ClipboardList },
      { title: "Wrap Packs", url: "/dashboard/logistics/wrap-packs", icon: Package },
      { title: "L&D Reports", url: "/dashboard/logistics/ld-reports", icon: AlertTriangle },
    ],
  },

  // ─── BROKERAGE ─────────────────────────────────────────────────
  {
    id: 3,
    label: "Brokerage",
    items: [
      { title: "Commercial Invoices", url: "/dashboard/commercial-invoices", icon: FileText },
      { title: "Hand Carries", url: "/dashboard/hand-carries", icon: Package },
      { title: "CARM", url: "/dashboard/carm", icon: Shield },
      { title: "Broker Charges", url: "/dashboard/broker-charges", icon: Receipt },
    ],
  },

  // ─── ACCOUNTING ────────────────────────────────────────────────
  {
    id: 4,
    label: "Accounting",
    items: [
      { title: "Prelim Budget", url: "/dashboard/prelim-budget", icon: Calculator },
      { title: "Budget", url: "/dashboard/budget", icon: DollarSign },
      { title: "Revised Budget", url: "/dashboard/revised-budget", icon: DollarSign },
      { title: "Cost Report", url: "/dashboard/cost-report", icon: TrendingUp },
      { title: "P-Cards", url: "/dashboard/p-cards", icon: CreditCard },
      { title: "Petty Cash", url: "/dashboard/petty-cash", icon: Coins },
      { title: "POs", url: "/dashboard/pos", icon: FileText },
      { title: "Check Requests", url: "/dashboard/check-requests", icon: ReceiptText, isNew: true },
      { title: "NFTs", url: "/dashboard/nfts", icon: FileText },
      { title: "Vendor Lists", url: "/dashboard/vendor-lists", icon: Building2 },
      { title: "Set Lists", url: "/dashboard/set-lists", icon: List },
      { title: "Rental Agreements", url: "/dashboard/rental-agreements", icon: Key },
      { title: "Deposits", url: "/dashboard/deposits", icon: Landmark },
      { title: "Budget Alerts", url: "/dashboard/budget-alerts", icon: Bell },
      { title: "Asset List", url: "/dashboard/asset-list", icon: Database },
    ],
  },

  // ─── SETS ──────────────────────────────────────────────────────
  {
    id: 5,
    label: "Sets",
    items: [
      { title: "Set Files", url: "/dashboard/sets", icon: LayoutDashboard, isNew: true },
      { title: "Lookbooks", url: "/dashboard/lookbooks", icon: BookOpen },
      { title: "Design Boards", url: "/dashboard/design-boards", icon: Palette },
      { title: "Mood Boards", url: "/dashboard/mood-boards", icon: Image },
      { title: "Mockups", url: "/dashboard/mockups", icon: Palette },
      { title: "References", url: "/dashboard/references", icon: BookOpen },
    ],
  },

  // ─── MEDIA ─────────────────────────────────────────────────────
  {
    id: 6,
    label: "Media",
    items: [
      { title: "Dailies", url: "/dashboard/dailies", icon: Film },
      { title: "Auditions", url: "/dashboard/auditions", icon: Video },
      { title: "Uploads", url: "/dashboard/uploads", icon: Upload },
      { title: "Photo Library", url: "/dashboard/photo-library", icon: Image },
      { title: "Video Library", url: "/dashboard/video-library", icon: Film },
    ],
  },

  // ─── COMMUNICATIONS ───────────────────────────────────────────
  {
    id: 7,
    label: "Communications",
    items: [
      { title: "Chat", url: "/dashboard/chat", icon: MessageSquare },
      { title: "Email", url: "/dashboard/email", icon: Mail },
    ],
  },

  // ─── SYSTEM ────────────────────────────────────────────────────
  {
    id: 8,
    label: "System",
    items: [
      { title: "Crew", url: "/dashboard/crew", icon: Users, isNew: true },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
  },
];
