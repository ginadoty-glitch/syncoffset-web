"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export function ProductionCalendarPrintFrame({ monthLabel }: { monthLabel: string }) {
  useEffect(() => {
    document.documentElement.classList.add("production-calendar-print-mode");
    return () => {
      document.documentElement.classList.remove("production-calendar-print-mode");
    };
  }, []);

  return (
    <div className="production-calendar-screen-only mb-4 flex items-center justify-between gap-3 border-b border-border pb-3 print:hidden">
      <div>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Print preview</p>
        <p className="font-semibold text-sm uppercase">{monthLabel} · 24×36 landscape</p>
      </div>
      <Button size="sm" onClick={() => window.print()}>
        Print calendar
      </Button>
    </div>
  );
}
