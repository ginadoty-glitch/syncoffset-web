"use server";

import { revalidatePath } from "next/cache";

import { parseStorageRef } from "@/lib/ingestion/storage-download";
import { extractCharacterNames, parseScriptScenes } from "@/lib/script/parse-script-scenes";
import { extractScriptPdfText } from "@/lib/script/pdf-extract";
import { syncScenesFromScript } from "@/lib/script/sync-scenes-from-script";
import { createServiceClient } from "@/lib/supabase/server";

export type ScriptParseResult =
  | {
      ok: true;
      scriptId: string;
      sceneCount: number;
      locationCount: number;
      castCount: number;
      registryCreated: number;
      registryUpdated: number;
      registrySkipped: number;
      warnings: string[];
    }
  | { ok: false; error: string };

/**
 * Parse an approved script source document: extract text from PDF,
 * split into scenes, write production_scripts + production_script_scenes,
 * then sync to scene_registry.
 */
export async function parseAndMirrorScript(sourceDocumentId: string): Promise<ScriptParseResult> {
  const supabase = createServiceClient();
  const warnings: string[] = [];

  const { data: doc, error: docErr } = await supabase
    .from("source_documents")
    .select("id, production_id, source_document_kind, source_file, immutable")
    .eq("id", sourceDocumentId)
    .maybeSingle();

  if (docErr || !doc) {
    return { ok: false, error: "Source document not found." };
  }

  const sourceFile = doc.source_file as {
    storageRef: string;
    originalFileName: string;
    mimeType: string;
  };
  const showId = doc.production_id as string;

  // 1. Download PDF from storage
  const { bucket, objectPath } = parseStorageRef(sourceFile.storageRef);
  const { data: fileData, error: dlErr } = await supabase.storage.from(bucket).download(objectPath);
  if (dlErr || !fileData) {
    return { ok: false, error: `File download failed: ${dlErr?.message ?? "No data"}` };
  }

  // 2. Extract text from PDF
  const buffer = Buffer.from(await fileData.arrayBuffer());
  const extraction = await extractScriptPdfText(buffer);

  const diagSnippet = (extraction.text ?? "").slice(0, 500).replace(/\n/g, "\\n");
  const diagPrefix = `[method=${extraction.method}][pages=${extraction.pageCount}][chars=${extraction.text?.length ?? 0}]`;

  if (!extraction.text || extraction.text.length < 20) {
    return {
      ok: false,
      error: `${diagPrefix} PDF text extraction yielded ${extraction.text.length} characters. Preview: ${diagSnippet || "(empty)"}`,
    };
  }

  warnings.push(`Extraction: ${extraction.method}, ${extraction.pageCount} pages, ${extraction.text.length} chars.`);

  // 3. Parse scenes from extracted text
  const parsedScenes = parseScriptScenes(extraction.text);
  if (parsedScenes.length === 0) {
    return {
      ok: false,
      error: `${diagPrefix} Scene parser found 0 scenes. Text preview: ${diagSnippet}`,
    };
  }

  if (parsedScenes.length === 1 && !parsedScenes[0]?.sceneNumber) {
    warnings.push("No numbered scene headings detected — single block captured.");
  }

  // 4. Detect revision color from filename
  const fileName = sourceFile.originalFileName;
  const revisionColor = detectRevisionColor(fileName);
  const title = deriveScriptTitle(fileName);

  // 5. Insert production_scripts row
  const now = new Date().toISOString();
  const { data: scriptRow, error: scriptErr } = await supabase
    .from("production_scripts")
    .insert({
      show_id: showId,
      title,
      version_label: revisionColor ?? "Draft",
      source_type: "uploaded",
      import_kind: "full_script",
      revision_color: revisionColor,
      source_document_name: fileName,
      raw_text: extraction.text,
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (scriptErr || !scriptRow) {
    return { ok: false, error: `production_scripts insert failed: ${scriptErr?.message ?? "No row returned"}` };
  }

  const scriptId = scriptRow.id as string;

  // 6. Insert production_script_scenes rows
  // Note: int_ext column may not exist if migration 20260517100000 hasn't been applied.
  // Store int_ext inside breakdown_draft JSON as a safe fallback.
  const sceneRows = parsedScenes.map((scene, idx) => {
    const characters = extractCharacterNames(scene.body);
    const draft: Record<string, unknown> = {};
    if (characters.length > 0) draft.characters = characters;
    if (scene.intExt) draft.int_ext = scene.intExt;
    if (scene.subLocation) draft.sub_location = scene.subLocation;
    return {
      script_id: scriptId,
      scene_number: scene.sceneNumber,
      scene_heading: scene.heading,
      location_name: scene.setName,
      time_of_day: scene.timeOfDay,
      raw_text: scene.body,
      sort_order: idx,
      scene_status: "active",
      breakdown_draft: draft,
    };
  });

  const { error: scenesErr } = await supabase.from("production_script_scenes").insert(sceneRows);
  if (scenesErr) {
    await supabase.from("production_scripts").delete().eq("id", scriptId);
    return { ok: false, error: `production_script_scenes insert failed: ${scenesErr.message}` };
  }

  // 7. Sync to scene_registry
  let registryResult = { created: 0, updated: 0, skipped: 0 };
  try {
    registryResult = await syncScenesFromScript(supabase, showId, scriptId);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    warnings.push(`scene_registry sync partial: ${msg}`);
  }

  const uniqueLocations = new Set(sceneRows.map((r) => r.location_name).filter(Boolean));
  const allCharacters = new Set(
    sceneRows.flatMap((r) => {
      const chars = (r.breakdown_draft as Record<string, unknown>)?.characters;
      return Array.isArray(chars) ? (chars as string[]) : [];
    }),
  );

  revalidatePath("/dashboard/script-hub");
  revalidatePath("/dashboard/one-line-schedule");

  return {
    ok: true,
    scriptId,
    sceneCount: parsedScenes.length,
    locationCount: uniqueLocations.size,
    castCount: allCharacters.size,
    registryCreated: registryResult.created,
    registryUpdated: registryResult.updated,
    registrySkipped: registryResult.skipped,
    warnings,
  };
}

const REVISION_COLORS = ["white", "blue", "pink", "yellow", "green", "goldenrod", "buff", "salmon", "cherry"] as const;

function detectRevisionColor(fileName: string): string | null {
  const lower = fileName.toLowerCase();
  for (const color of REVISION_COLORS) {
    if (new RegExp(`\\b${color}\\b`, "i").test(lower)) {
      return color.charAt(0).toUpperCase() + color.slice(1);
    }
  }
  return null;
}

function deriveScriptTitle(fileName: string): string {
  return (
    fileName
      .replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "Untitled Script"
  );
}
