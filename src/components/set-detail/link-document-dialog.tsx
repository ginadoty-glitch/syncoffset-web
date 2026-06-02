"use client";

import { useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DocumentListOption } from "@/lib/documents/document-set-queries";
import { fetchDocumentsForLinking, linkDocumentToSet } from "@/server/document-set-actions";

type SetOption = {
  id: string;
  setNumber: string;
  setName: string;
};

type Props = {
  defaultSetId: string;
  sets: SetOption[];
};

export function LinkDocumentDialog({ defaultSetId, sets }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [documents, setDocuments] = useState<DocumentListOption[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [setId, setSetId] = useState(defaultSetId);

  useEffect(() => {
    setSetId(defaultSetId);
  }, [defaultSetId]);

  useEffect(() => {
    if (!open) return;
    setLoadingDocs(true);
    fetchDocumentsForLinking()
      .then((rows) => {
        setDocuments(rows);
        setDocumentId((prev) => prev || rows[0]?.id || "");
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load documents"))
      .finally(() => setLoadingDocs(false));
  }, [open]);

  const onSubmit = () => {
    if (!documentId || !setId) {
      toast.error("Select a document and a set.");
      return;
    }
    startTransition(async () => {
      const result = await linkDocumentToSet(documentId, setId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Document linked to set");
      setOpen(false);
      router.refresh();
    });
  };

  const unlinkedCount = documents.filter((d) => !d.setId).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-1.5">
          Link Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Link document to set</DialogTitle>
          <DialogDescription>
            Manual assignment only. Sets <code className="text-xs">documents.set_id</code> and{" "}
            <code className="text-xs">set_number</code> — no extraction or auto-matching.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="link-document">Document</Label>
            <Select value={documentId} onValueChange={setDocumentId} disabled={loadingDocs || documents.length === 0}>
              <SelectTrigger id="link-document">
                <SelectValue placeholder={loadingDocs ? "Loading…" : "Select document"} />
              </SelectTrigger>
              <SelectContent>
                {documents.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.title}
                    {doc.setId ? " (reassign)" : ""} — {doc.documentNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!loadingDocs && documents.length === 0 && (
              <p className="text-muted-foreground text-xs">
                No documents in this production. Upload via Ingestion first.
              </p>
            )}
            {!loadingDocs && unlinkedCount > 0 && (
              <p className="text-muted-foreground text-xs">{unlinkedCount} document(s) without a set.</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="link-set">Set</Label>
            <Select value={setId} onValueChange={setSetId} disabled={sets.length === 0}>
              <SelectTrigger id="link-set">
                <SelectValue placeholder="Select set" />
              </SelectTrigger>
              <SelectContent>
                {sets.map((set) => (
                  <SelectItem key={set.id} value={set.id}>
                    {set.setNumber} — {set.setName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={pending || !documentId || !setId}>
            {pending ? "Saving…" : "Link to set"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
