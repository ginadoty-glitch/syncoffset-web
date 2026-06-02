import Link from "next/link";

import { LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import type { ProductionSetListResult } from "@/lib/sets/list-production-sets";

import { SetListCard } from "./set-list-card";

export function SetsIndex({ data }: { data: ProductionSetListResult }) {
  if (data.loadError) {
    return (
      <Empty className="min-h-[40vh] border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LayoutGrid />
          </EmptyMedia>
          <EmptyTitle>Sets unavailable</EmptyTitle>
          <EmptyDescription>{data.loadError}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (data.sets.length === 0) {
    return (
      <Empty className="min-h-[40vh] border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LayoutGrid />
          </EmptyMedia>
          <EmptyTitle>No sets in this production</EmptyTitle>
          <EmptyDescription>
            Insert rows into <code className="text-xs">production_sets</code> for your configured production ID. No
            sample or mock sets are shown.
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" size="sm" asChild>
          <Link href="/ingestion">Review ingestion queue</Link>
        </Button>
      </Empty>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.sets.map((set) => (
        <SetListCard key={set.id} set={set} />
      ))}
    </div>
  );
}
