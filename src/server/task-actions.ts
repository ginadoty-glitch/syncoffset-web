"use server";

import { revalidatePath } from "next/cache";

import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function createTask(form: {
  title: string;
  notes?: string;
  status?: string;
  priority?: string;
  due_at?: string;
  assignee_name?: string;
}): Promise<ActionResult> {
  const title = form.title?.trim();
  if (!title) return { ok: false, error: "Title is required." };

  const showId = await getActiveProductionId();
  const supabase = createServiceClient();

  const { error } = await supabase.from("production_tasks").insert({
    show_id: showId,
    title,
    notes: form.notes?.trim() || null,
    status: form.status?.trim() || "open",
    priority: form.priority?.trim() || "normal",
    due_at: form.due_at?.trim() ? form.due_at : null,
    assignee_name: form.assignee_name?.trim() || null,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/tasks");
  return { ok: true };
}

export async function updateTask(
  taskId: string,
  form: {
    title?: string;
    notes?: string;
    status?: string;
    priority?: string;
    due_at?: string | null;
    assignee_name?: string;
  },
): Promise<ActionResult> {
  const supabase = createServiceClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (form.title !== undefined) {
    const trimmed = form.title.trim();
    if (!trimmed) return { ok: false, error: "Title cannot be empty." };
    updates.title = trimmed;
  }
  if (form.notes !== undefined) updates.notes = form.notes.trim() || null;
  if (form.status !== undefined) updates.status = form.status.trim() || "open";
  if (form.priority !== undefined) updates.priority = form.priority.trim() || "normal";
  if (form.due_at !== undefined) updates.due_at = form.due_at?.trim() ? form.due_at : null;
  if (form.assignee_name !== undefined) updates.assignee_name = form.assignee_name.trim() || null;

  const { error } = await supabase.from("production_tasks").update(updates).eq("id", taskId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/tasks");
  return { ok: true };
}
