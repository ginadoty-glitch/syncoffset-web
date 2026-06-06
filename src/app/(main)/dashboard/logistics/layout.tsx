import type { ReactNode } from "react";

import { LogisticsTabBar } from "./_components/logistics-tab-bar";

export default function LogisticsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] flex-col overflow-hidden">
      <LogisticsTabBar />
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
