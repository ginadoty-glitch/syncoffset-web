import Link from "next/link";

import { Button } from "@/components/ui/button";
import { listSourceDocumentsForQueue } from "@/lib/ingestion/queries";

import { IngestionQueueTable } from "./_components/ingestion-queue-table";

export const dynamic = "force-dynamic";

export default async function IngestionReviewQueuePage() {
  let items: Awaited<ReturnType<typeof listSourceDocumentsForQueue>> = [];
  let loadError: string | null = null;

  try {
    items = await listSourceDocumentsForQueue();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Failed to load review queue.";
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl tracking-tight">Upload History</h1>
          <p className="text-muted-foreground text-sm">
            Track, approve, and manage uploaded production documents.
          </p>
        </div>
        <Button asChild>
          <Link href="/ingestion/upload">Upload file</Link>
        </Button>
      </div>

      {loadError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive text-sm">
          {loadError}
          <p className="mt-2 text-muted-foreground text-xs">
            Configure Supabase env vars and apply migrations in{" "}
            <code className="rounded bg-muted px-1">supabase/migrations/</code>.
          </p>
        </div>
      ) : (
        <IngestionQueueTable items={items} />
      )}
    </div>
  );
}
