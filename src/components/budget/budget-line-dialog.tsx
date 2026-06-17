"use client";

import { useState, useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VendorPicker, type VendorSelection } from "@/components/vendors/vendor-picker";
import { BUDGET_DEPARTMENTS } from "@/lib/budget/departments";
import type { ProductionBudgetLineRow } from "@/lib/live-budget/types";
import type { VendorRow } from "@/lib/vendors/types";
import { createBudgetLine, updateBudgetLine } from "@/server/budget-actions";

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs";

export function BudgetLineDialog({
  open,
  onOpenChange,
  line,
  defaultDepartment,
  vendors,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, dialog edits this row; otherwise creates a new one. */
  line?: ProductionBudgetLineRow | null;
  defaultDepartment?: string;
  vendors: VendorRow[];
}) {
  const isEdit = Boolean(line);
  const [isPending, startTransition] = useTransition();
  const [department, setDepartment] = useState(line?.department ?? defaultDepartment ?? "Art");
  const [category, setCategory] = useState(line?.category === "Misc" ? "" : (line?.category ?? ""));
  const [description, setDescription] = useState(line?.description ?? "");
  const [vendorSelection, setVendorSelection] = useState<VendorSelection | null>(() => {
    const name = line?.vendor?.trim();
    if (!name) return null;
    const match = vendors.find((v) => v.name.toLowerCase() === name.toLowerCase());
    return match ? { id: match.id, name: match.name } : { id: name, name };
  });
  const [quantity, setQuantity] = useState(line ? String(line.quantity) : "1");
  const [rate, setRate] = useState(line ? String(line.unit_cost) : "");
  const [actualCost, setActualCost] = useState(line?.actual_cost != null ? String(line.actual_cost) : "");
  const [status, setStatus] = useState(line?.status ?? "draft");
  const [error, setError] = useState<string | null>(null);

  const estPreview = (() => {
    const q = Number(quantity) || 0;
    const r = Number(String(rate).replace(/[$,\s]/g, "")) || 0;
    return q > 0 && r > 0 ? `$${(q * r).toFixed(2)}` : "—";
  })();

  function handleSubmit() {
    startTransition(async () => {
      const form = {
        department,
        category,
        description,
        vendor: vendorSelection?.name ?? "",
        quantity,
        rate,
        actualCost,
        status,
      };
      const result = line ? await updateBudgetLine(line.id, form) : await createBudgetLine(form);
      if (result.ok) {
        toast.success(line ? "Budget line saved" : "Budget line added");
        onOpenChange(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Budget Line" : "Add Budget Line"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update cost line detail." : "Manual cost entry — estimated cost is quantity × rate."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bl-department">Department *</Label>
              <select
                id="bl-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={selectClass}
              >
                {BUDGET_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bl-category">Category</Label>
              <Input
                id="bl-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Builds, Rentals, Labour"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bl-description">Description *</Label>
            <Input
              id="bl-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Barge pilothouse build — lumber package"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Vendor</Label>
              <VendorPicker vendors={vendors} value={vendorSelection} onChange={setVendorSelection} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bl-status">Status</Label>
              <select id="bl-status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="actualized">Actualized</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bl-quantity">Quantity</Label>
              <Input
                id="bl-quantity"
                type="number"
                min="0"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bl-rate">Rate</Label>
              <Input
                id="bl-rate"
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label>Estimated</Label>
              <p className="flex h-9 items-center text-sm tabular-nums">{estPreview}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bl-actual">Actual Cost</Label>
              <Input
                id="bl-actual"
                inputMode="decimal"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                placeholder="Blank until known"
              />
            </div>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !description.trim()}>
            {isPending ? "Saving…" : isEdit ? "Save Line" : "Add Line"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
