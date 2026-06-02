import type { ReactNode } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function IngestionLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-[calc(100vh-var(--dashboard-header-height,3rem))] flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3 md:px-6">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm tracking-tight">Source Ingestion</span>
          <span className="text-muted-foreground text-xs">Constitution + persistence — read-only review queue</span>
        </div>
        <Separator orientation="vertical" className="mx-1 h-8" />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ingestion">Review Queue</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ingestion/upload">Upload</Link>
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/sets">Back to Sets</Link>
        </Button>
      </div>
      <div className="flex-1 p-4 md:p-6">{children}</div>
    </div>
  );
}
