import {
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  FileCheck2,
  FolderArchive,
  LayoutDashboard,
  type LucideIcon,
  Mail,
  MapPin,
  MessageSquareDot,
  Package,
  PauseOctagon,
  ReceiptText,
  Settings,
  TrendingUp,
  Truck,
  Users,
  Zap,
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

export const sidebarItems: NavGroup[] = [
  {
    id: 2,
    label: "Logistics",
    items: [
      {
        title: "Overview",
        url: "/dashboard/logistics",
        icon: LayoutDashboard,
      },
      {
        title: "Transport Orders",
        url: "/dashboard/logistics/transport-orders",
        icon: Truck,
      },
      {
        title: "Shipments",
        url: "/dashboard/logistics/shipments",
        icon: Package,
      },
      {
        title: "Brokerage Docs",
        url: "/dashboard/logistics/brokerage",
        icon: FileCheck2,
      },
      {
        title: "Rush Orders",
        url: "/dashboard/logistics/rush",
        icon: Zap,
      },
      {
        title: "Holdbacks",
        url: "/dashboard/logistics/holdbacks",
        icon: PauseOctagon,
      },
    ],
  },
  {
    id: 6,
    label: "Communications",
    items: [
      {
        title: "Chat",
        url: "/dashboard/communications/chat",
        icon: MessageSquareDot,
      },
      {
        title: "Email",
        url: "/dashboard/communications/email",
        icon: Mail,
      },
      {
        title: "Notifications",
        url: "/dashboard/communications/notifications",
        icon: Bell,
      },
    ],
  },
  {
    id: 3,
    label: "Production",
    items: [
      {
        title: "Schedule",
        url: "/dashboard/coming-soon",
        icon: Calendar,
        comingSoon: true,
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
