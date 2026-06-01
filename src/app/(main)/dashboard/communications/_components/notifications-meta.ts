import { Clock, FileCheck2, type LucideIcon, Megaphone, Truck, Zap } from "lucide-react";

import type { NotificationCategory, Severity } from "./notifications-data";

export const severityMeta: Record<Severity, { tag: string; text: string; border: string; dot: string; bg: string }> = {
  critical: {
    tag: "■ CRIT",
    text: "text-[#d3410c]",
    border: "border-[#d3410c]/55",
    dot: "bg-[#d3410c]",
    bg: "bg-[#d3410c]/[0.04]",
  },
  attention: {
    tag: "▲ ATTN",
    text: "text-[#f2b90e]",
    border: "border-[#f2b90e]/45",
    dot: "bg-[#f2b90e]",
    bg: "",
  },
  info: {
    tag: "→ INFO",
    text: "text-[#bfd4ef]",
    border: "border-[#bfd4ef]/40",
    dot: "bg-[#bfd4ef]",
    bg: "",
  },
  resolved: {
    tag: "✓ DONE",
    text: "text-[#47AE90]",
    border: "border-[#47AE90]/40",
    dot: "bg-[#47AE90]/70",
    bg: "",
  },
};

export const categoryIcon: Record<NotificationCategory, LucideIcon> = {
  "rush-orders": Zap,
  "clearance-delays": Clock,
  "driver-updates": Truck,
  "brokerage-responses": FileCheck2,
  "production-alerts": Megaphone,
};
