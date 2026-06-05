import {
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  FileUp,
  FolderArchive,
  LayoutDashboard,
  type LucideIcon,
  MapPin,
  ReceiptText,
  ScrollText,
  Settings,
  TrendingUp,
  Users,
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
 * Production navigation (TestFlight / field). MOCK routes are preserved on disk but
 * excluded — see `hiddenMockRoutes` in `./sidebar-route-registry.ts`.
 */
export const sidebarItems: NavGroup[] = [
  {
    id: 3,
    label: "Production",
    items: [
      {
        title: "Sets",
        url: "/dashboard/sets",
        icon: LayoutDashboard,
        isNew: true,
      },
      {
        title: "Production Calendar",
        url: "/dashboard/production-calendar",
        icon: Calendar,
        isNew: true,
      },
      {
        title: "Script",
        url: "/dashboard/script-hub",
        icon: ScrollText,
        isNew: true,
      },
      {
        title: "Documents",
        url: "/dashboard/production-documents",
        icon: FileText,
        isNew: true,
      },
      {
        title: "Locations",
        url: "/dashboard/locations",
        icon: MapPin,
        isNew: true,
      },
      {
        title: "Crew",
        url: "/dashboard/crew",
        icon: Users,
        isNew: true,
      },
      {
        title: "Operations",
        url: "/dashboard/operations",
        icon: ClipboardList,
        isNew: true,
      },
    ],
  },
  {
    id: 4,
    label: "Finance",
    items: [
      {
        title: "Live Budget",
        url: "/dashboard/live-budget",
        icon: TrendingUp,
        isNew: true,
      },
      {
        title: "Check Requests",
        url: "/dashboard/check-requests",
        icon: ReceiptText,
        isNew: true,
      },
    ],
  },
  {
    id: 7,
    label: "Ingestion",
    items: [
      {
        title: "Review Queue",
        url: "/ingestion",
        icon: FileUp,
      },
      {
        title: "Upload",
        url: "/ingestion/upload",
        icon: FileUp,
      },
    ],
  },
  {
    id: 5,
    label: "System",
    items: [
      {
        title: "Wrap Archive",
        url: "/dashboard/coming-soon",
        icon: FolderArchive,
        comingSoon: true,
      },
      {
        title: "References",
        url: "/dashboard/coming-soon",
        icon: BookOpen,
        comingSoon: true,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
      },
    ],
  },
];
