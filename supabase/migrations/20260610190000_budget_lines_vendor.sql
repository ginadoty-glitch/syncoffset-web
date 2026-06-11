-- Budget lines: vendor linkage for manual cost entry.
-- Additive, nullable — no behavior change for existing rows.

ALTER TABLE public.production_budget_lines
  ADD COLUMN IF NOT EXISTS vendor text;
