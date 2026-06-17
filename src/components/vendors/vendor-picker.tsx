"use client";

import { useMemo, useState, useTransition } from "react";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { VendorRow } from "@/lib/vendors/types";
import { createVendor } from "@/server/vendor-actions";

export type VendorSelection = {
  id: string;
  name: string;
};

export function VendorPicker({
  vendors,
  value,
  onChange,
  placeholder = "Search vendors…",
  allowQuickCreate = true,
  disabled = false,
}: {
  vendors: VendorRow[];
  value: VendorSelection | null;
  onChange: (next: VendorSelection | null) => void;
  placeholder?: string;
  allowQuickCreate?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const sorted = useMemo(() => [...vendors].sort((a, b) => a.name.localeCompare(b.name)), [vendors]);

  function quickCreate(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const result = await createVendor({ name: trimmed });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onChange({ id: result.id ?? trimmed, name: trimmed });
      setOpen(false);
      setQuery("");
      toast.success("Vendor added");
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled === true || isPending}
          className="h-9 w-full justify-between font-normal"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>{value?.name ?? placeholder}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search vendors…" value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>
              {allowQuickCreate && query.trim() ? (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => quickCreate(query)}
                >
                  <Plus className="size-4" />
                  Add &ldquo;{query.trim()}&rdquo;
                </button>
              ) : (
                <span className="px-3 py-2 text-muted-foreground text-sm">No vendors found.</span>
              )}
            </CommandEmpty>
            <CommandGroup>
              {sorted
                .filter((v) => {
                  const q = query.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    v.name.toLowerCase().includes(q) ||
                    (v.category ?? "").toLowerCase().includes(q) ||
                    (v.phone ?? "").includes(q)
                  );
                })
                .slice(0, 20)
                .map((v) => (
                  <CommandItem
                    key={v.id}
                    value={v.id}
                    onSelect={() => {
                      onChange({ id: v.id, name: v.name });
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <Check className={cn("mr-2 size-4", value?.id === v.id ? "opacity-100" : "opacity-0")} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{v.name}</p>
                      {(v.category || v.phone) && (
                        <p className="truncate text-muted-foreground text-xs">
                          {[v.category, v.phone].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
            {allowQuickCreate &&
            query.trim() &&
            sorted.some((v) => v.name.toLowerCase() === query.trim().toLowerCase()) === false ? (
              <CommandGroup>
                <CommandItem onSelect={() => quickCreate(query)}>
                  <Plus className="mr-2 size-4" />
                  Add vendor &ldquo;{query.trim()}&rdquo;
                </CommandItem>
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
