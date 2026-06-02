"use client";

import { useTransition } from "react";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getSourceDocumentDownloadUrl } from "@/server/ingestion-actions";

export function DownloadOriginalButton({ sourceDocumentId }: { sourceDocumentId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await getSourceDocumentDownloadUrl(sourceDocumentId);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          window.open(result.url, "_blank", "noopener,noreferrer");
        });
      }}
    >
      <Download className="size-4" />
      Download original
    </Button>
  );
}
