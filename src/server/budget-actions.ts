"use server";

import { revalidatePath } from "next/cache";

import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

const BUDGET_STATUSES = ["draft", "approved", "actualized"] as const;

function parseMoney(raw: string | number | undefined | null): number | null {
  if (raw === undefined || raw === null || raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(String(raw).replace(/[$,\s]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

type BudgetLineForm = {
  department: string;
  category: string;
  description: string;
  vendor?: string;
  quantity?: string | number;
  rate?: string | number;
  actualCost?: string | number;
  status?: string;
};

function validateLine(
  form: BudgetLineForm,
): { ok: true; values: Record<string, unknown> } | { ok: false; error: string } {
  const description = form.description?.trim();
  if (!description) return { ok: false, error: "Description is required." };

  const department = form.department?.trim();
  if (!department) return { ok: false, error: "Department is required." };

  const status = form.status?.trim() || "draft";
  if (!(BUDGET_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: `Invalid status: ${status}` };
  }

  const quantityRaw = parseMoney(form.quantity);
  const quantity = quantityRaw && quantityRaw > 0 ? quantityRaw : 1;
  const rate = parseMoney(form.rate) ?? 0;
  const actualCost = parseMoney(form.actualCost);

  return {
    ok: true,
    values: {
      department,
      category: form.category?.trim() || "Misc",
      description,
      vendor: form.vendor?.trim() || null,
      quantity,
      unit_cost: rate,
      estimated_cost: Math.round(quantity * rate * 100) / 100,
      actual_cost: actualCost,
      status,
    },
  };
}

export async function createBudgetLine(form: BudgetLineForm): Promise<ActionResult> {
  const validated = validateLine(form);
  if (!validated.ok) return validated;

  const showId = await getActiveProductionId();
  const supabase = createServiceClient();

  const { error } = await supabase.from("production_budget_lines").insert({
    show_id: showId,
    source_type: "manual",
    ...validated.values,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/budget");
  revalidatePath("/dashboard/live-budget");
  return { ok: true };
}

export async function updateBudgetLine(lineId: string, form: BudgetLineForm): Promise<ActionResult> {
  const validated = validateLine(form);
  if (!validated.ok) return validated;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("production_budget_lines")
    .update({ ...validated.values, updated_at: new Date().toISOString() })
    .eq("id", lineId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/budget");
  revalidatePath("/dashboard/live-budget");
  return { ok: true };
}

export async function deleteBudgetLine(lineId: string): Promise<ActionResult> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("production_budget_lines").delete().eq("id", lineId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/budget");
  revalidatePath("/dashboard/live-budget");
  return { ok: true };
}
