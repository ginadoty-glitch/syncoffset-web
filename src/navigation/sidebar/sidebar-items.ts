import {
  BookOpen,
  Calendar,
  ClipboardList,
  FileUp,
  FolderArchive,
  LayoutDashboard,
  type LucideIcon,
  MapPin,
  ReceiptText,
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
        title: "Locations",
        url: "/dashboard/coming-soon",
        icon: MapPin,
        comingSoon: true,
      },
      {
        title: "Crew",
        url: "/dashboard/coming-soon",
        icon: Users,
        comingSoon: true,
      },
      {
        title: "Operations",
        url: "/dashboard/coming-soon",
        icon: ClipboardList,
        comingSoon: true,
      },
    ],
  },
  {
    id: 4,
    label: "Finance",
    items: [
      {
        title: "Live Budget",
        url: "/dashboard/coming-soon",
        icon: TrendingUp,
        comingSoon: true,
      },
      {
        title: "Check Requests",
        url: "/dashboard/coming-soon",
        icon: ReceiptText,
        comingSoon: true,
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
