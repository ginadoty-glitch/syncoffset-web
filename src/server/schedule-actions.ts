"use server";

import { revalidatePath } from "next/cache";

import { getDefaultProductionId } from "@/lib/ingestion/production";
import { parseStorageRef } from "@/lib/ingestion/storage-download";
import { mirrorScheduleRevision } from "@/lib/schedule/mirror-schedule-revision";
import { fingerprintShootDays, parsedRowsToShootDays, parseScheduleBuffer } from "@/lib/schedule/parse-schedule";
import { createServiceClient } from "@/lib/supabase/server";

import type { IngestionActionResult } from "./ingestion-actions";

export type ScheduleParseResult =
  | { ok: true; revisionId: string; dayCount: number; warnings: string[] }
  | { ok: false; error: string };

/**
 * Parse an approved source document and create a schedule revision.
 * Called automatically on approve for shoot-schedule / one-liner kinds,
 * or manually from the detail page.
 */
export async function parseAndMirrorSchedule(sourceDocumentId: string): Promise<ScheduleParseResult> {
  const supabase = createServiceClient();

  const { data: doc, error: docErr } = await supabase
    .from("source_documents")
    .select("id, production_id, source_document_kind, source_file, immutable")
    .eq("id", sourceDocumentId)
    .maybeSingle();

  if (docErr || !doc) {
    return { ok: false, error: "Source document not found." };
  }

  const sourceFile = doc.source_file as { storageRef: string; originalFileName: string; mimeType: string };
  const { bucket, objectPath } = parseStorageRef(sourceFile.storageRef);

  const { data: fileData, error: dlErr } = await supabase.storage.from(bucket).download(objectPath);
  if (dlErr || !fileData) {
    return { ok: false, error: `File download failed: ${dlErr?.message ?? "No data"}` };
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());
  const showId = doc.production_id as string;

  const parseResult = await parseScheduleBuffer({
    buffer,
    mimeType: sourceFile.mimeType,
    fileName: sourceFile.originalFileName,
    defaultBlockId: `block-${showId.slice(0, 8)}`,
    productionDocumentId: null,
  });

  const shootDays = parsedRowsToShootDays(parseResult.rows);
  if (shootDays.length === 0) {
    return {
      ok: false,
      error: `Parser found 0 shoot days. ${parseResult.warnings.join(" ")}`.trim(),
    };
  }

  const fingerprint = fingerprintShootDays(shootDays);

  const revisionSource = doc.source_document_kind === "one-liner" ? "csv" : "unknown";

  const mirrorResult = await mirrorScheduleRevision(supabase, {
    showId,
    shootDays,
    revisionSource,
    sourceFingerprint: fingerprint,
    sourceDocumentId: null,
    externalSourceDocumentKey: sourceDocumentId,
    replaceStripboard: true,
    importedBy: "ingestion@syncoffset.local",
    notes: `Web ingestion import · ${sourceFile.originalFileName} · ${parseResult.rows.length} days parsed`,
  });

  if (!mirrorResult.ok) {
    return { ok: false, error: mirrorResult.error };
  }

  // Sync extracted scenes into scene_registry
  try {
    const { syncScenesFromRevision } = await import("@/lib/schedule/scene-registry");
    const sceneResult = await syncScenesFromRevision(supabase, showId, mirrorResult.revisionId);
    if (sceneResult.created > 0 || sceneResult.updated > 0) {
      parseResult.warnings.push(
        `scene_registry: ${sceneResult.created} created, ${sceneResult.updated} updated, ${sceneResult.omitted} omitted`,
      );
    }
  } catch {
    parseResult.warnings.push("scene_registry sync skipped (table may not exist).");
  }

  revalidatePath(`/ingestion/${sourceDocumentId}`);
  revalidatePath("/dashboard/one-line-schedule");

  return {
    ok: true,
    revisionId: mirrorResult.revisionId,
    dayCount: shootDays.length,
    warnings: parseResult.warnings,
  };
}

/**
 * Publish a schedule revision to the Production Calendar.
 * Calls the existing publish_production_schedule_revision RPC.
 */
export async function publishScheduleRevision(revisionId: string): Promise<IngestionActionResult> {
  const supabase = createServiceClient();
  const showId = await getDefaultProductionId();

  // Publish supersedes ALL published revisions for the show (single chain).
  // Prep Schedules must never replace the Shooting Schedule / One-Liner.
  const { data: revisionRow } = await supabase
    .from("production_schedule_revisions")
    .select("external_source_document_key")
    .eq("id", revisionId)
    .maybeSingle();

  if (revisionRow?.external_source_document_key) {
    const { data: sourceDoc } = await supabase
      .from("source_documents")
      .select("source_document_kind")
      .eq("id", revisionRow.external_source_document_key)
      .maybeSingle();

    if (sourceDoc?.source_document_kind === "prep-schedule") {
      return {
        ok: false,
        error:
          "Prep Schedules stay in preview — publishing would replace the shooting schedule on the Production Calendar.",
      };
    }
  }

  const { data, error } = await supabase.rpc("publish_production_schedule_revision", {
    p_show_id: showId,
    p_revision_id: revisionId,
    p_published_by: "ingestion@syncoffset.local",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const body = data as { ok?: boolean; error?: string } | null;
  if (!body?.ok) {
    const msg = typeof body?.error === "string" ? body.error : "Publish failed";
    return { ok: false, error: msg };
  }

  revalidatePath("/dashboard/production-calendar");
  revalidatePath("/ingestion");

  return { ok: true };
}

/**
 * Load schedule preview data for a source document.
 * Binds to the revision created from this specific document.
 */
export async function loadSchedulePreview(sourceDocumentId: string): Promise<{
  revision: { id: string; revision_name: string; revision_scope: string; imported_at: string } | null;
  sourceDocumentKind: string | null;
  days: Array<{
    id: string;
    strip_position: number;
    shoot_day: string;
    day_type: string | null;
    title: string;
    notes: string | null;
  }>;
} | null> {
  const supabase = createServiceClient();
  const showId = await getDefaultProductionId();

  const { data: revisions } = await supabase
    .from("production_schedule_revisions")
    .select("id, revision_name, revision_scope, imported_at")
    .eq("show_id", showId)
    .eq("external_source_document_key", sourceDocumentId)
    .order("imported_at", { ascending: false })
    .limit(1);

  const revision = revisions?.[0] ?? null;
  if (!revision) return null;

  const [{ data: days }, { data: sourceDoc }] = await Promise.all([
    supabase
      .from("production_schedule_days")
      .select("id, strip_position, shoot_day, day_type, title, notes")
      .eq("revision_id", revision.id)
      .order("strip_position", { ascending: true }),
    supabase.from("source_documents").select("source_document_kind").eq("id", sourceDocumentId).maybeSingle(),
  ]);

  return {
    revision,
    sourceDocumentKind: (sourceDoc?.source_document_kind as string | null) ?? null,
    days: days ?? [],
  };
}
