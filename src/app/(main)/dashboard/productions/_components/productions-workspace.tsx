"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Building2, Check, Clapperboard, MapPin, Plus, Radio, Tag } from "lucide-react";

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
import { createProduction, type ProductionRow, switchActiveProduction } from "@/server/production-actions";

export function ProductionsWorkspace({
  productions,
  activeProductionId,
}: {
  productions: ProductionRow[];
  activeProductionId: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSwitch(showId: string) {
    startTransition(async () => {
      await switchActiveProduction(showId);
      router.refresh();
    });
  }

  function handleCreate() {
    if (!name.trim()) {
      setError("Production name is required");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createProduction({
        name,
        code: code || undefined,
        productionCompany: company || undefined,
        location: location || undefined,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDialogOpen(false);
      setName("");
      setCode("");
      setCompany("");
      setLocation("");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex shrink-0 items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">System</p>
          <h1 className="font-extrabold text-2xl tracking-tight">Productions</h1>
          <p className="text-muted-foreground text-sm">
            {productions.length} production{productions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Create Production
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle>Create Production</DialogTitle>
              <DialogDescription>
                Add a new production. You can switch to it immediately after creation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="prod-name">
                  Production Name <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Clapperboard className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    id="prod-name"
                    placeholder="e.g. Runaway"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    autoFocus
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prod-code">Production Code</Label>
                <div className="flex items-center gap-2">
                  <Tag className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    id="prod-code"
                    placeholder="e.g. RUNAWAY"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prod-company">Production Company</Label>
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    id="prod-company"
                    placeholder="e.g. Stage 49 Ltd."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prod-location">Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    id="prod-location"
                    placeholder="e.g. Vancouver, BC"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                </div>
              </div>
              {error ? <p className="text-destructive text-sm">{error}</p> : null}
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={isPending || !name.trim()}>
                {isPending ? "Creating…" : "Create Production"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b bg-muted/30 text-left text-muted-foreground text-xs uppercase tracking-wider">
              <th className="w-10 px-3 py-2.5 font-medium" />
              <th className="px-3 py-2.5 font-medium">Name</th>
              <th className="px-3 py-2.5 font-medium">Code</th>
              <th className="px-3 py-2.5 font-medium">Company</th>
              <th className="px-3 py-2.5 font-medium">Location</th>
              <th className="px-3 py-2.5 font-medium">Updated</th>
              <th className="w-32 px-3 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {productions.map((p) => {
              const isActive = p.id === activeProductionId;
              return (
                <tr key={p.id} className={isActive ? "bg-primary/5" : ""}>
                  <td className="px-3 py-2.5 text-center">
                    {isActive ? <Radio className="inline size-4 text-primary" /> : null}
                  </td>
                  <td className="px-3 py-2.5 font-medium">{p.name}</td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground text-xs">{p.code ?? "—"}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{p.production_company ?? "—"}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{p.location ?? "—"}</td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground text-xs">
                    {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 font-medium text-primary text-xs">
                        <Check className="size-3" />
                        Active
                      </span>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleSwitch(p.id)} disabled={isPending}>
                        Make Active
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {productions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                  No productions found. Create one to get started.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
