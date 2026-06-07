"use server";

import { revalidatePath } from "next/cache";

import { bucketForSourceKind, buildStorageObjectPath, buildStorageRef } from "@/lib/ingestion/bucket-map";
import { completeDocumentChain } from "@/lib/ingestion/document-chain";
import type { IngestionStatus } from "@/lib/ingestion/ingestion-status";
import { assertTransition } from "@/lib/ingestion/ingestion-transitions";
import { getDefaultProductionId } from "@/lib/ingestion/production";
import type { SourceDocumentRow } from "@/lib/ingestion/source-document-row";
import { parseStorageRef } from "@/lib/ingestion/storage-download";
import { isAllowedUploadFile, mimeTypeForFileName } from "@/lib/ingestion/upload-mime";
import { createServiceClient } from "@/lib/supabase/server";
import type { SourceDocumentKind } from "@/types/core/source/source-document-kind";
import { isSourceDocumentKind } from "@/types/core/source/source-documents";

import { createHash, randomUUID } from "node:crypto";

export type UploadSourceDocumentResult =
  | {
      ok: true;
      sourceDocumentId: string;
      storageRef: string;
      documentId: string;
      documentRevisionId: string;
      documentCreated: boolean;
    }
  | { ok: false; error: string };

export type IngestionActionResult = { ok: true } | { ok: false; error: string };

export async function uploadSourceDocument(formData: FormData): Promise<UploadSourceDocumentResult> {
  const file = formData.get("file");
  const kindRaw = formData.get("sourceDocumentKind");
  const uploadedByRaw = formData.get("uploadedBy");

  if (!(file instanceof File)) {
    return { ok: false, error: "No file provided." };
  }

  if (typeof kindRaw !== "string" || !isSourceDocumentKind(kindRaw)) {
    return { ok: false, error: "Invalid source document kind." };
  }

  const sourceDocumentKind = kindRaw as SourceDocumentKind;

  if (!isAllowedUploadFile(file)) {
    return { ok: false, error: "File type not allowed. Use PDF, XLSX, CSV, PNG, or JPG." };
  }

  const mimeType = mimeTypeForFileName(file.name);
  if (!mimeType) {
    return { ok: false, error: "Could not determine MIME type." };
  }

  const uploadedBy =
    typeof uploadedByRaw === "string" && uploadedByRaw.trim().length > 0
      ? uploadedByRaw.trim()
      : "ingestion@syncoffset.local";

  const productionId = getDefaultProductionId();
  const sourceDocumentId = randomUUID();
  const now = new Date().toISOString();
  const bucket = bucketForSourceKind(sourceDocumentKind);
  const objectPath = buildStorageObjectPath(productionId, sourceDocumentId, file.name);
  const storageRef = buildStorageRef(bucket, productionId, sourceDocumentId, file.name);

  const buffer = Buffer.from(await file.arrayBuffer());
  const checksumSha256 = createHash("sha256").update(buffer).digest("hex");

  const supabase = createServiceClient();

  const { error: storageError } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (storageError) {
    return { ok: false, error: `Storage upload failed: ${storageError.message}` };
  }

  const immutable = {
    isImmutable: true as const,
    originalFileName: file.name,
    uploadedAt: now,
    uploadedBy,
    extractionHistoryIds: [] as string[],
  };

  const sourceFile = {
    storageRef,
    originalFileName: file.name,
    mimeType,
    byteSize: file.size,
    checksumSha256,
    receivedAt: now,
  };

  const ingestion = {
    sourceDocumentId,
    sourceSystem: "manual-upload" as const,
    sourceVersion: "1",
    importedAt: now,
    importedBy: uploadedBy,
  };

  const row = {
    id: sourceDocumentId,
    production_id: productionId,
    kind: "source-document",
    status: "draft",
    ingestion_status: "uploaded",
    created_by: uploadedBy,
    created_at: now,
    modified_by: uploadedBy,
    modified_at: now,
    source_document_id: null,
    source_version_id: null,
    relationships: [],
    source_document_kind: sourceDocumentKind,
    immutable,
    source_file: sourceFile,
    version_chain: [],
    supersession: {},
    ingestion,
  };

  const { error: insertError } = await supabase.from("source_documents").insert(row);

  if (insertError) {
    await supabase.storage.from(bucket).remove([objectPath]);
    return { ok: false, error: `Database insert failed: ${insertError.message}` };
  }

  try {
    const chain = await completeDocumentChain(supabase, {
      sourceDocument: row as SourceDocumentRow,
      productionId,
      sourceDocumentKind,
      uploadedBy,
      now,
    });

    revalidateIngestion();

    return {
      ok: true,
      sourceDocumentId,
      storageRef,
      documentId: chain.documentId,
      documentRevisionId: chain.documentRevisionId,
      documentCreated: chain.documentCreated,
    };
  } catch (chainError) {
    await supabase.from("source_documents").delete().eq("id", sourceDocumentId);
    await supabase.storage.from(bucket).remove([objectPath]);
    const message = chainError instanceof Error ? chainError.message : "Document chain failed.";
    return { ok: false, error: message };
  }
}

export async function transitionIngestionStatus(
  sourceDocumentId: string,
  to: IngestionStatus,
): Promise<IngestionActionResult> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("source_documents")
      .select("ingestion_status")
      .eq("id", sourceDocumentId)
      .maybeSingle();

    if (error || !data) {
      return { ok: false, error: "Source document not found." };
    }

    const from = data.ingestion_status as IngestionStatus;
    assertTransition(from, to);

    const { error: updateError } = await supabase
      .from("source_documents")
      .update({ ingestion_status: to, modified_at: new Date().toISOString() })
      .eq("id", sourceDocumentId);

    if (updateError) {
      return { ok: false, error: updateError.message };
    }

    if (to === "approved") {
      await syncDocumentStatusForSource(sourceDocumentId, "approved");
      await triggerScheduleParseIfApplicable(sourceDocumentId);
    }
    if (to === "rejected") {
      await syncDocumentStatusForSource(sourceDocumentId, "draft");
    }

    revalidateIngestion(sourceDocumentId);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Transition failed." };
  }
}

export async function approveSourceDocument(sourceDocumentId: string): Promise<IngestionActionResult> {
  return transitionIngestionStatus(sourceDocumentId, "approved");
}

export async function rejectSourceDocument(sourceDocumentId: string): Promise<IngestionActionResult> {
  return transitionIngestionStatus(sourceDocumentId, "rejected");
}

export async function getSourceDocumentDownloadUrl(
  sourceDocumentId: string,
): Promise<{ ok: true; url: string; fileName: string } | { ok: false; error: string }> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("source_documents")
    .select("source_file")
    .eq("id", sourceDocumentId)
    .maybeSingle();

  if (error || !data?.source_file) {
    return { ok: false, error: "Source document not found." };
  }

  const sourceFile = data.source_file as { storageRef: string; originalFileName: string };
  const { bucket, objectPath } = parseStorageRef(sourceFile.storageRef);

  const { data: signed, error: signError } = await supabase.storage.from(bucket).createSignedUrl(objectPath, 60 * 10);

  if (signError || !signed?.signedUrl) {
    return { ok: false, error: signError?.message ?? "Could not create download URL." };
  }

  return { ok: true, url: signed.signedUrl, fileName: sourceFile.originalFileName };
}

const SCHEDULE_PARSE_KINDS = new Set(["shoot-schedule", "one-liner", "dood"]);

async function triggerScheduleParseIfApplicable(sourceDocumentId: string): Promise<void> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("source_documents")
      .select("source_document_kind")
      .eq("id", sourceDocumentId)
      .maybeSingle();

    if (!data?.source_document_kind) return;
    if (!SCHEDULE_PARSE_KINDS.has(data.source_document_kind as string)) return;

    const { parseAndMirrorSchedule } = await import("./schedule-actions");
    await parseAndMirrorSchedule(sourceDocumentId);
  } catch {
    // Schedule parsing failure must not block document approval
  }
}

async function syncDocumentStatusForSource(sourceDocumentId: string, statusId: "approved" | "draft"): Promise<void> {
  const supabase = createServiceClient();
  const { data: revision } = await supabase
    .from("document_revisions")
    .select("document_id")
    .eq("source_document_id", sourceDocumentId)
    .maybeSingle();

  if (!revision?.document_id) return;

  await supabase
    .from("documents")
    .update({ status_id: statusId, modified_at: new Date().toISOString() })
    .eq("id", revision.document_id);
}

export type SignedUploadUrlResult =
  | { ok: true; signedUrl: string; token: string; bucket: string; objectPath: string; sourceDocumentId: string }
  | { ok: false; error: string };

/**
 * Creates a short-lived signed upload URL so the client can PUT the file
 * directly to Supabase Storage without routing bytes through the serverless
 * function. Payload is tiny — just the file name and kind.
 */
export async function getSignedUploadUrl(sourceDocumentKind: string, fileName: string): Promise<SignedUploadUrlResult> {
  if (!isSourceDocumentKind(sourceDocumentKind)) {
    return { ok: false, error: "Invalid source document kind." };
  }

  const productionId = getDefaultProductionId();
  const sourceDocumentId = randomUUID();
  const bucket = bucketForSourceKind(sourceDocumentKind as SourceDocumentKind);
  const objectPath = buildStorageObjectPath(productionId, sourceDocumentId, fileName);

  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(objectPath);

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not create upload URL." };
  }

  return {
    ok: true,
    signedUrl: data.signedUrl,
    token: data.token,
    bucket,
    objectPath,
    sourceDocumentId,
  };
}

export type CreateSourceDocumentInput = {
  bucket: string;
  objectPath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  checksumSha256: string;
  sourceDocumentKind: SourceDocumentKind;
  uploadedBy?: string;
};

/**
 * Server action for the direct-upload flow: file is already in Supabase
 * Storage (uploaded from the client), so we only create the database records.
 */
export async function createSourceDocumentFromStorage(
  input: CreateSourceDocumentInput,
): Promise<UploadSourceDocumentResult> {
  const { bucket, objectPath, fileName, fileSize, mimeType, checksumSha256, sourceDocumentKind } = input;

  const uploadedBy = input.uploadedBy?.trim() || "ingestion@syncoffset.local";
  const productionId = getDefaultProductionId();
  const sourceDocumentId = randomUUID();
  const now = new Date().toISOString();
  const storageRef = `${bucket}/${objectPath}`;

  const immutable = {
    isImmutable: true as const,
    originalFileName: fileName,
    uploadedAt: now,
    uploadedBy,
    extractionHistoryIds: [] as string[],
  };

  const sourceFile = {
    storageRef,
    originalFileName: fileName,
    mimeType,
    byteSize: fileSize,
    checksumSha256,
    receivedAt: now,
  };

  const ingestion = {
    sourceDocumentId,
    sourceSystem: "manual-upload" as const,
    sourceVersion: "1",
    importedAt: now,
    importedBy: uploadedBy,
  };

  const row = {
    id: sourceDocumentId,
    production_id: productionId,
    kind: "source-document",
    status: "draft",
    ingestion_status: "uploaded",
    created_by: uploadedBy,
    created_at: now,
    modified_by: uploadedBy,
    modified_at: now,
    source_document_id: null,
    source_version_id: null,
    relationships: [],
    source_document_kind: sourceDocumentKind,
    immutable,
    source_file: sourceFile,
    version_chain: [],
    supersession: {},
    ingestion,
  };

  const supabase = createServiceClient();
  const { error: insertError } = await supabase.from("source_documents").insert(row);

  if (insertError) {
    await supabase.storage.from(bucket).remove([objectPath]);
    return { ok: false, error: `Database insert failed: ${insertError.message}` };
  }

  try {
    const chain = await completeDocumentChain(supabase, {
      sourceDocument: row as SourceDocumentRow,
      productionId,
      sourceDocumentKind,
      uploadedBy,
      now,
    });

    revalidateIngestion();

    return {
      ok: true,
      sourceDocumentId,
      storageRef,
      documentId: chain.documentId,
      documentRevisionId: chain.documentRevisionId,
      documentCreated: chain.documentCreated,
    };
  } catch (chainError) {
    await supabase.from("source_documents").delete().eq("id", sourceDocumentId);
    await supabase.storage.from(bucket).remove([objectPath]);
    const message = chainError instanceof Error ? chainError.message : "Document chain failed.";
    return { ok: false, error: message };
  }
}

function revalidateIngestion(sourceDocumentId?: string) {
  revalidatePath("/ingestion");
  revalidatePath("/ingestion/upload");
  if (sourceDocumentId) {
    revalidatePath(`/ingestion/${sourceDocumentId}`);
  }
}
