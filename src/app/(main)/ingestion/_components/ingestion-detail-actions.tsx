"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { IngestionStatus } from "@/lib/ingestion/ingestion-status";
import { approveSourceDocument, rejectSourceDocument } from "@/server/ingestion-actions";

export function IngestionDetailActions({
  sourceDocumentId,
  ingestionStatus,
}: {
  sourceDocumentId: string;
  ingestionStatus: IngestionStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, msg: string) => {
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) {
        toast.error(result.error ?? "Failed");
        return;
      }
      toast.success(msg);
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={pending || ingestionStatus !== "review"}
        onClick={() => run(() => approveSourceDocument(sourceDocumentId), "Approved")}
      >
        Approve
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
