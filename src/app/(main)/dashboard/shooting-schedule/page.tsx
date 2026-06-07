import Link from "next/link";

import { CalendarDays, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function ShootingSchedulePage() {
  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
          <h1 className="text-2xl tracking-tight">Shooting Schedule</h1>
          <p className="text-muted-foreground text-sm">
            Day-by-day shooting schedule with scene assignments and unit breakdowns.
          </p>
        </div>
        <Button asChild>
          <Link href="/ingestion/upload?kind=shoot-schedule">
            <Upload className="mr-2 size-4" />
            Upload Schedule
          </Link>
        </Button>
      </header>

      <Empty className="min-h-[200px] border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarDays />
          </EmptyMedia>
          <EmptyTitle>No schedule imported</EmptyTitle>
          <EmptyDescription>
            Upload a shooting schedule (PDF, CSV, or XLSX) to populate this workspace.
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/ingestion/upload?kind=shoot-schedule">
            <Upload className="mr-2 size-4" />
            Upload Schedule
          </Link>
        </Button>
      </Empty>
    </div>
  );
}
