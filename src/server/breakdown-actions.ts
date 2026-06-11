"use server";

import { revalidatePath } from "next/cache";

import { BREAKDOWN_ELEMENT_TYPES } from "@/lib/script-hub/breakdown-element-types";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function createBreakdownItem(form: {
  scriptId: string;
  sceneId: string;
  label: string;
  category: string;
  quantity?: number;
  notes?: string;
}): Promise<ActionResult> {
  const label = form.label?.trim();
  if (!label) return { ok: false, error: "Item description is required." };

  const element = BREAKDOWN_ELEMENT_TYPES.find((e) => e.category === form.category);
  if (!element) return { ok: false, error: `Unknown element type: ${form.category}` };

  const quantity = Number.isFinite(form.quantity) && (form.quantity ?? 0) > 0 ? Math.floor(form.quantity ?? 1) : 1;

  const supabase = createServiceClient();
  const { error } = await supabase.from("production_breakdown_items").insert({
    script_id: form.scriptId,
    scene_id: form.sceneId,
    label,
    category: element.category,
    department: element.department,
    status: "draft",
    quantity,
    notes: form.notes?.trim() || null,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/script-hub");
  revalidatePath("/dashboard/script-breakdown");
  return { ok: true };
}
