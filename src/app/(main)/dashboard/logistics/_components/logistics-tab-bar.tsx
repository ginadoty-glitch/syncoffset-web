"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
  { label: "Overview", href: "/dashboard/logistics" },
  { label: "Transport Orders", href: "/dashboard/logistics/transport-orders" },
  { label: "Trips", href: "/dashboard/logistics/trips" },
  { label: "Maps", href: "/dashboard/logistics/maps" },
  { label: "Shipment Tracking", href: "/dashboard/logistics/shipment-tracking" },
  { label: "Work Requests", href: "/dashboard/logistics/work-requests" },
  { label: "Wrap Packs", href: "/dashboard/logistics/wrap-packs" },
  { label: "L&D Reports", href: "/dashboard/logistics/ld-reports" },
] as const;

export function LogisticsTabBar() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex gap-0 overflow-x-auto px-4">
        {tabs.map((tab) => {
          const isActive = tab.href === "/dashboard/logistics" ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
