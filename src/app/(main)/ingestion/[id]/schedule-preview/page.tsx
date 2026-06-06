import Link from "next/link";

import { Button } from "@/components/ui/button";
import { loadSchedulePreview } from "@/server/schedule-actions";

import { SchedulePreviewView } from "./_components/schedule-preview-view";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SchedulePreviewPage({ params }: PageProps) {
  const { id } = await params;
  const preview = await loadSchedulePreview(id);

  if (!preview?.revision || preview.days.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 py-20 text-center">
        <h2 className="font-medium text-lg">No parsed schedule found</h2>
        <p className="text-muted-foreground text-sm">
          This document has not been parsed into schedule days yet. Approve the document to trigger parsing.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/ingestion/${id}`}>← Back to document</Link>
        </Button>
      </div>
    );
  }

  return <SchedulePreviewView revision={preview.revision} days={preview.days} sourceDocumentId={id} />;
}
