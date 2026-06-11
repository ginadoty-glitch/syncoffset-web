"use client";

import { useState, useTransition } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BREAKDOWN_ELEMENT_TYPES } from "@/lib/script-hub/breakdown-element-types";
import { createBreakdownItem } from "@/server/breakdown-actions";

export function CreateBreakdownItemDialog({
  scriptId,
  sceneId,
  sceneLabel,
}: {
  scriptId: string;
  sceneId: string;
  sceneLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<string>("Prop");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setLabel("");
    setCategory("Prop");
    setQuantity("1");
    setNotes("");
    setError(null);
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await createBreakdownItem({
        scriptId,
        sceneId,
        label,
        category,
        quantity: parseInt(quantity, 10) || 1,
        notes,
      });
      if (result.ok) {
        toast.success(`Breakdown item added · Scene ${sceneLabel}`);
        reset();
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 size-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Breakdown Item</DialogTitle>
          <DialogDescription>Scene {sceneLabel}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bd-category">Element Type</Label>
              <select
                id="bd-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                {BREAKDOWN_ELEMENT_TYPES.map((e) => (
                  <option key={e.category} value={e.category}>
                    {e.category}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bd-quantity">Quantity</Label>
              <Input
                id="bd-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bd-label">Description *</Label>
            <Input
              id="bd-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Hero duffel bag — weathered"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bd-notes">Notes</Label>
            <Textarea
              id="bd-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Continuity, sourcing, vendor, build notes…"
              rows={3}
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !label.trim()}>
            {isPending ? "Adding…" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
