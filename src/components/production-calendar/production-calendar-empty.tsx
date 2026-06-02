import { CalendarDays } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export function ProductionCalendarEmpty({
  message,
  showMigrationHint,
}: {
  message: string;
  showMigrationHint?: boolean;
}) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarDays />
        </EmptyMedia>
        <EmptyTitle>No production days this month</EmptyTitle>
        <EmptyDescription>
          {message}
          {showMigrationHint ? (
            <>
              {" "}
              Apply <code className="rounded bg-muted px-1 text-xs">20260520100000_production_schedule_shadow.sql</code>
              ,{" "}
              <code className="rounded bg-muted px-1 text-xs">20260521100000_schedule_revision_publish_phase2.sql</code>
              , and publish a <code className="rounded bg-muted px-1 text-xs">production_schedule_revisions</code> row
              (scope published) with <code className="rounded bg-muted px-1 text-xs">production_schedule_days</code>.
            </>
          ) : null}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
