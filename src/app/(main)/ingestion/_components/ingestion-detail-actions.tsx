"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { IngestionStatus } from "@/lib/ingestion/ingestion-status";
import { approveSourceDocument, rejectSourceDocument, reprocessScript } from "@/server/ingestion-actions";

const SCHEDULE_KINDS = new Set(["shoot-schedule", "one-liner", "dood"]);
const SCRIPT_KINDS = new Set(["script-revision"]);

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

  const isScript = sourceDocumentKind ? SCRIPT_KINDS.has(sourceDocumentKind) : false;
  const canReprocess = isScript && ingestionStatus === "approved";

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
      {canReprocess && (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await reprocessScript(sourceDocumentId);
              if (!result.ok) {
                toast.error(`Reprocess failed: ${result.error}`);
                return;
              }
              toast.success(
                `Script processed — ${result.sceneCount} scenes · ${result.locationCount} locations · ${result.castCount} characters`,
              );
              router.refresh();
            });
          }}
        >
          {pending ? "Reprocessing…" : "Reprocess Script"}
        </Button>
      )}
    </div>
  );
}
