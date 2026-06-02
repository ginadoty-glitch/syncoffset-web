"use client";

import { useTransition } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { IngestionStatus } from "@/lib/ingestion/ingestion-status";
import { approveSourceDocument, rejectSourceDocument } from "@/server/ingestion-actions";

type Props = {
  sourceDocumentId: string;
  ingestionStatus: IngestionStatus;
};

export function IngestionQueueActions({ sourceDocumentId, ingestionStatus }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<{ ok: boolean; error?: string }>, success: string) => {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error ?? "Action failed.");
        return;
      }
      toast.success(success);
      router.refresh();
    });
  };

  const canApprove = ingestionStatus === "review";
  const canReject = ingestionStatus === "review";

  return (
    <div className="flex flex-wrap gap-1.5">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/ingestion/${sourceDocumentId}`}>Open</Link>
      </Button>
      <Button
        variant="default"
        size="sm"
        disabled={pending || !canApprove}
        onClick={() => run(() => approveSourceDocument(sourceDocumentId), "Approved")}
      >
        Approve
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={pending || !canReject}
        onClick={() => run(() => rejectSourceDocument(sourceDocumentId), "Rejected")}
      >
        Reject
      </Button>
    </div>
  );
}
