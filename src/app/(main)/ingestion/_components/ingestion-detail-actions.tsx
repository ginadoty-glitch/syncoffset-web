"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { IngestionStatus } from "@/lib/ingestion/ingestion-status";
import { approveSourceDocument, rejectSourceDocument } from "@/server/ingestion-actions";

const SCHEDULE_KINDS = new Set(["shoot-schedule", "one-liner", "dood"]);

export function IngestionDetailActions({
  sourceDocumentId,
  ingestionStatus,
  sourceDocumentKind,
}: {
  sourceDocumentId: string;
  ingestionStatus: IngestionStatus;
  sourceDocumentKind?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, msg: string, redirectTo?: string) => {
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) {
        toast.error(result.error ?? "Failed");
        return;
      }
      toast.success(msg);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    });
  };

  const approveRedirect =
    sourceDocumentKind && SCHEDULE_KINDS.has(sourceDocumentKind)
      ? `/ingestion/${sourceDocumentId}/schedule-preview`
      : undefined;

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={pending || ingestionStatus !== "review"}
        onClick={() =>
          run(
            () => approveSourceDocument(sourceDocumentId),
            approveRedirect ? "Approved — opening schedule preview" : "Approved",
            approveRedirect,
          )
        }
      >
        {pending ? "Processing…" : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending || ingestionStatus !== "review"}
        onClick={() => run(() => rejectSourceDocument(sourceDocumentId), "Rejected")}
      >
        Reject
      </Button>
    </div>
  );
}
