"use client";

import * as React from "react";

import Link from "next/link";

import { CheckCircle, Upload, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALLOWED_UPLOAD_EXTENSIONS, mimeTypeForFileName } from "@/lib/ingestion/upload-mime";
import { cn } from "@/lib/utils";
import type { ParseOutcome } from "@/server/ingestion-actions";
import { createSourceDocumentFromStorage, getSignedUploadUrl } from "@/server/ingestion-actions";
import { SOURCE_INGESTION_REGISTRY } from "@/types/core/source/ingestion-registry";
import type { SourceDocumentKind } from "@/types/core/source/source-document-kind";

const SOURCE_KINDS = Object.keys(SOURCE_INGESTION_REGISTRY) as SourceDocumentKind[];

const acceptAttr = ALLOWED_UPLOAD_EXTENSIONS.join(",");

const WORKSPACE_ROUTES: Partial<Record<SourceDocumentKind, { label: string; href: string }>> = {
  "script-revision": { label: "Script Hub", href: "/dashboard/script-hub" },
  "shoot-schedule": { label: "Shooting Schedule", href: "/dashboard/shooting-schedule" },
  "one-liner": { label: "One-Line Schedule", href: "/dashboard/one-line-schedule" },
  dood: { label: "Cast DOODs", href: "/dashboard/cast-doods" },
  "cast-list": { label: "Cast Lists", href: "/dashboard/cast-lists" },
  "breakdown-package": { label: "Script Breakdown", href: "/dashboard/script-breakdown" },
  "crew-list": { label: "Crew", href: "/dashboard/crew" },
  "location-package": { label: "Locations", href: "/dashboard/locations" },
  "reference-media": { label: "Production Documents", href: "/dashboard/production-documents" },
};

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function parseResultDescription(p: ParseOutcome): string {
  if (p.parsed) {
    if (p.parserKind === "script") {
      const parts = [`${p.sceneCount ?? 0} scenes`];
      if (p.locationCount) parts.push(`${p.locationCount} locations`);
      if (p.castCount) parts.push(`${p.castCount} characters`);
      return parts.join(" · ");
    }
    if (p.parserKind === "schedule") return `${p.dayCount ?? 0} shoot days imported`;
    return "Document processed";
  }
  return `Stored — ${p.reason}`;
}

type UploadFormProps = {
  defaultKind?: string;
  contextLabel?: string;
};

export function UploadForm({ defaultKind, contextLabel }: UploadFormProps) {
  const kindIsPreset = SOURCE_KINDS.includes(defaultKind as SourceDocumentKind);
  const initialKind = kindIsPreset ? (defaultKind as SourceDocumentKind) : "script-revision";
  const [sourceDocumentKind, setSourceDocumentKind] = React.useState<SourceDocumentKind>(initialKind);
  const [uploadedBy, setUploadedBy] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [lastOutcome, setLastOutcome] = React.useState<{ kind: SourceDocumentKind; parse: ParseOutcome | null } | null>(
    null,
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const displayLabel = contextLabel ?? SOURCE_INGESTION_REGISTRY[sourceDocumentKind]?.label ?? sourceDocumentKind;

  const pickFile = (next: File | null) => {
    if (!next) {
      setFile(null);
      return;
    }
    setFile(next);
    setLastOutcome(null);
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

    const mimeType = mimeTypeForFileName(file.name);
    if (!mimeType) {
      toast.error("Could not determine file type.");
      return;
    }

    setPending(true);
    setLastOutcome(null);
    try {
      const signed = await getSignedUploadUrl(sourceDocumentKind, file.name);
      if (!signed.ok) {
        toast.error(signed.error);
        return;
      }

      const arrayBuffer = await file.arrayBuffer();

      const uploadResp = await fetch(signed.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": mimeType },
        body: arrayBuffer,
      });

      if (!uploadResp.ok) {
        const body = await uploadResp.text().catch(() => "");
        toast.error(`Storage upload failed (${uploadResp.status}): ${body || uploadResp.statusText}`);
        return;
      }

      const checksumSha256 = await sha256Hex(arrayBuffer);

      const result = await createSourceDocumentFromStorage({
        bucket: signed.bucket,
        objectPath: signed.objectPath,
        fileName: file.name,
        fileSize: file.size,
        mimeType,
        checksumSha256,
        sourceDocumentKind,
        uploadedBy: uploadedBy.trim() || undefined,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setLastOutcome({ kind: sourceDocumentKind, parse: result.parseOutcome });

      if (result.parseOutcome?.parsed) {
        toast.success(`${displayLabel} imported`, {
          description: parseResultDescription(result.parseOutcome),
        });
      } else if (result.parseOutcome && !result.parseOutcome.parsed) {
        toast.warning(`${displayLabel} stored — parser issue`, {
          description: result.parseOutcome.reason,
        });
      } else {
        toast.success(`${displayLabel} uploaded`, {
          description: "Document stored in production files.",
        });
      }

      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e) {
      const message = e instanceof Error ? e.message : "Upload failed — unknown error.";
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  const workspace = WORKSPACE_ROUTES[sourceDocumentKind];

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Upload {displayLabel}</CardTitle>
        <CardDescription>PDF, XLSX, CSV, PNG, or JPG accepted.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {kindIsPreset ? (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Document type</span>
              <span className="font-medium text-sm">{displayLabel}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label htmlFor="sourceDocumentKind">Document type</Label>
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
          )}

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
              {pending ? "Processing…" : "Upload"}
            </Button>
            {workspace && (
              <Button type="button" variant="outline" asChild>
                <Link href={workspace.href}>Back to {workspace.label}</Link>
              </Button>
            )}
          </div>
        </form>

        {lastOutcome && (
          <div
            className={cn(
              "mt-5 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
              lastOutcome.parse?.parsed
                ? "border-emerald-500/30 bg-emerald-500/5"
                : lastOutcome.parse
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-border bg-muted/30",
            )}
          >
            {lastOutcome.parse?.parsed ? (
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            ) : lastOutcome.parse ? (
              <XCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
            ) : null}
            <div className="flex flex-col gap-1">
              <p className="font-medium">
                {lastOutcome.parse?.parsed
                  ? parseResultDescription(lastOutcome.parse)
                  : lastOutcome.parse
                    ? `Document stored — ${lastOutcome.parse.reason}`
                    : "Document stored"}
              </p>

              {/* Script-specific links */}
              {lastOutcome.parse?.parsed && lastOutcome.parse.parserKind === "script" && (
                <div className="flex gap-3 pt-1">
                  <Link href="/dashboard/script-hub" className="text-xs underline underline-offset-2">
                    Open Script →
                  </Link>
                  <Link href="/dashboard/script-breakdown" className="text-xs underline underline-offset-2">
                    Open Breakdown →
                  </Link>
                </div>
              )}

              {/* Schedule-specific links */}
              {lastOutcome.parse?.parsed && lastOutcome.parse.parserKind === "schedule" && (
                <div className="flex gap-3 pt-1">
                  <Link href="/dashboard/shooting-schedule" className="text-xs underline underline-offset-2">
                    Preview Schedule →
                  </Link>
                  <Link href="/dashboard/one-line-schedule" className="text-xs underline underline-offset-2">
                    One-Line Schedule →
                  </Link>
                </div>
              )}

              {/* Fallback workspace link for non-script/schedule types */}
              {workspace && !lastOutcome.parse?.parsed && (
                <Link href={workspace.href} className="text-xs underline underline-offset-2">
                  Open {workspace.label} →
                </Link>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
