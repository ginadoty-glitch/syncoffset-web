"use client";

import * as React from "react";

import Link from "next/link";

import { Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALLOWED_UPLOAD_EXTENSIONS } from "@/lib/ingestion/upload-mime";
import { cn } from "@/lib/utils";
import { uploadSourceDocument } from "@/server/ingestion-actions";
import { SOURCE_INGESTION_REGISTRY } from "@/types/core/source/ingestion-registry";
import type { SourceDocumentKind } from "@/types/core/source/source-document-kind";

const SOURCE_KINDS = Object.keys(SOURCE_INGESTION_REGISTRY) as SourceDocumentKind[];

const acceptAttr = ALLOWED_UPLOAD_EXTENSIONS.join(",");

export function UploadForm() {
  const [sourceDocumentKind, setSourceDocumentKind] = React.useState<SourceDocumentKind>("script-revision");
  const [uploadedBy, setUploadedBy] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const pickFile = (next: File | null) => {
    if (!next) {
      setFile(null);
      return;
    }
    setFile(next);
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const dropped = event.dataTransfer.files[0];
    if (dropped) pickFile(dropped);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast.error("Choose a file first.");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("sourceDocumentKind", sourceDocumentKind);
    if (uploadedBy.trim()) formData.set("uploadedBy", uploadedBy.trim());

    setPending(true);
    const result = await uploadSourceDocument(formData);
    setPending(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("File uploaded — document chain created", {
      description: `Source ${result.sourceDocumentId.slice(0, 8)}… · Document ${result.documentId.slice(0, 8)}…${result.documentCreated ? " (new)" : " (revision)"}`,
    });
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Upload source document</CardTitle>
        <CardDescription>
          PDF, XLSX, CSV, PNG, or JPG. Creates a <code className="rounded bg-muted px-1 text-xs">source_documents</code>{" "}
          row with status <code className="rounded bg-muted px-1 text-xs">uploaded</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sourceDocumentKind">Source kind</Label>
            <Select value={sourceDocumentKind} onValueChange={(v) => setSourceDocumentKind(v as SourceDocumentKind)}>
              <SelectTrigger id="sourceDocumentKind">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_KINDS.map((kind) => (
                  <SelectItem key={kind} value={kind}>
                    {SOURCE_INGESTION_REGISTRY[kind].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="uploadedBy">Uploaded by (optional)</Label>
            <Input
              id="uploadedBy"
              placeholder="name@production.com"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
            />
          </div>

          <button
            type="button"
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-12 transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30",
            )}
          >
            <Upload className="size-8 text-muted-foreground" />
            <p className="font-medium text-sm">Drag and drop a file here</p>
            <p className="text-muted-foreground text-xs">or click to choose</p>
            {file && <p className="mt-2 font-mono text-xs">{file.name}</p>}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept={acceptAttr}
            className="sr-only"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={pending || !file}>
              {pending ? "Uploading…" : "Upload"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/ingestion">View queue</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
