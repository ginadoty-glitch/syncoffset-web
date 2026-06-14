/**
 * Schedule revision mirror — ported from expo/services/scheduleShadowMirror.ts.
 * Writes parsed ShootDay[] into production_schedule_revisions + production_schedule_days.
 * Embeds SYNCO_SHADOW_JSON:v2: in notes for calendar round-tripping.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ShootDay } from "@/types/schedule";

export type ScheduleRevisionSource = "smart_import" | "csv" | "manual" | "scriptation" | "movie_magic" | "unknown";

export type MirrorScheduleInput = {
  showId: string;
  shootDays: ShootDay[];
  revisionSource: ScheduleRevisionSource;
  sourceFingerprint: string;
  /** FK to production_documents (mobile documents layer) — not web source_documents. */
  sourceDocumentId?: string | null;
  /** Web ingestion source_documents.id — stored as text key, no FK. */
  externalSourceDocumentKey?: string | null;
  replaceStripboard: boolean;
  importedBy?: string | null;
  notes?: string;
};

function mapRowsForMirror(
  showId: string,
  revisionId: string,
  shootDays: ShootDay[],
  importedBy: string | null,
  importedAt: string,
): Record<string, unknown>[] {
  return shootDays.map((d, idx) => {
    const iso = Number.isFinite(d.date) ? new Date(d.date).toISOString() : new Date(importedAt).toISOString();

    const setupNames = d.setups.map((s) => s.setName).filter(Boolean);
    const title = [d.location, ...setupNames.slice(0, 2)].filter(Boolean).join(" · ").slice(0, 500) || "Shoot day";

    const v2Payload = JSON.stringify({
      v: 2,
      setups: d.setups,
      units: d.units,
      markers: d.markers ?? [],
      events: d.events ?? [],
      zone: d.zone ?? null,
      companyMove: d.companyMove ?? false,
      companyMoveDestination: d.companyMoveDestination ?? null,
      secondaryLocation: d.secondaryLocation ?? null,
      totalPages: d.totalPages ?? null,
      splitDay: d.splitDay ?? false,
      workPeriods: d.workPeriods ?? [],
      preLightNotes: d.preLightNotes ?? [],
      vfxElements: d.vfxElements ?? [],
      omittedScenes: d.omittedScenes ?? [],
      blockId: d.blockId,
      localId: d.id,
    });

    const bodyNotes = [(d.notes ?? "").trim(), `SYNCO_SHADOW_JSON:v2:${v2Payload}`].filter(Boolean).join("\n\n");

    const primaryIntExt = d.setups[0]?.intExt ?? d.intExt ?? null;

    return {
      revision_id: revisionId,
      show_id: showId.trim(),
      strip_position: idx,
      shoot_day: iso,
      day_type: d.calendarDayType ?? primaryIntExt,
      title,
      notes: bodyNotes.slice(0, 49_000) || null,
      meeting_url: d.meetingJoinUrl?.trim() || null,
      map_url: d.locationMapUrl?.trim() || null,
      production_document_source_id: null,
      imported_at: importedAt,
      created_by: importedBy,
    };
  });
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function shootDaysLabel(days: ShootDay[]): string {
  if (days.length === 0) return "0 strips";
  return `${days.length} strips`;
}

export async function mirrorScheduleRevision(
  supabase: SupabaseClient,
  input: MirrorScheduleInput,
): Promise<{ ok: true; revisionId: string } | { ok: false; error: string }> {
  const showId = input.showId?.trim();
  if (!showId) return { ok: false, error: "Missing show id." };

  const importedAt = new Date().toISOString();
  const importedBy = input.importedBy ?? "ingestion@syncoffset.local";
  const revisionName = `[${input.revisionSource}] ${shootDaysLabel(input.shootDays)} · imported ${new Date(importedAt).toLocaleString()}`;

  const { data: prevHead } = await supabase
    .from("production_schedule_revisions")
    .select("id")
    .eq("show_id", showId)
    .order("imported_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: revRow, error: revErr } = await supabase
    .from("production_schedule_revisions")
    .insert({
      show_id: showId,
      revision_name: revisionName.slice(0, 490),
      revision_source: input.revisionSource,
      revision_scope: "shared_draft",
      imported_by: importedBy,
      imported_at: importedAt,
      source_document_id: input.sourceDocumentId ?? null,
      external_source_document_key: input.externalSourceDocumentKey ?? null,
      source_fingerprint: input.sourceFingerprint.trim().slice(0, 490) || null,
      import_merge_kind: input.replaceStripboard ? "replaced" : "initial",
      notes: input.notes?.slice(0, 8000) ?? null,
    })
    .select("id")
    .single();

  if (revErr || !revRow?.id) {
    return {
      ok: false,
      error: revErr?.message ?? "Could not insert production_schedule_revisions.",
    };
  }

  const revisionId = revRow.id as string;

  const dayChunks = chunk(mapRowsForMirror(showId, revisionId, input.shootDays, importedBy, importedAt), 80);
  for (const chunkRows of dayChunks) {
    const { error: dErr } = await supabase.from("production_schedule_days").insert(chunkRows);
    if (dErr) {
      await supabase.from("production_schedule_revisions").delete().eq("id", revisionId);
      return { ok: false, error: dErr.message ?? "Day insert failed." };
    }
  }

  if (prevHead?.id) {
    await supabase.from("production_schedule_lineage").insert({
      parent_revision_id: prevHead.id,
      child_revision_id: revisionId,
      relationship_type: input.replaceStripboard ? "replaced" : "imported_from",
    });
  }

  return { ok: true, revisionId };
}
