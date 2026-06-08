"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import {
  Archive,
  ArchiveRestore,
  Building2,
  Check,
  Clapperboard,
  ExternalLink,
  FileText,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Radio,
  Tag,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  archiveProduction,
  createProduction,
  type ProductionRow,
  switchActiveProduction,
  unarchiveProduction,
  updateProduction,
} from "@/server/production-actions";

export function ProductionsWorkspace({
  productions,
  activeProductionId,
}: {
  productions: ProductionRow[];
  activeProductionId: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProductionRow | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editType, setEditType] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const visible = showArchived ? productions : productions.filter((p) => !p.archived_at);
  const archivedCount = productions.filter((p) => p.archived_at).length;

  function openEdit(p: ProductionRow) {
    setEditTarget(p);
    setEditName(p.name);
    setEditCode(p.code ?? "");
    setEditCompany(p.production_company ?? "");
    setEditLocation(p.location ?? "");
    setEditType(p.production_type ?? "");
    setEditNotes(p.notes ?? "");
    setEditError(null);
  }

  function handleOpen(showId: string) {
    startTransition(async () => {
      await switchActiveProduction(showId);
      toast.success("Production opened");
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
      toast.success("Production created");
      setCreateOpen(false);
      setName("");
      setCode("");
      setCompany("");
      setLocation("");
      router.refresh();
    });
  }

  function handleSaveEdit() {
    if (!editTarget) return;
    if (!editName.trim()) {
      setEditError("Production name is required");
      return;
    }
    setEditError(null);
    startTransition(async () => {
      const result = await updateProduction(editTarget.id, {
        name: editName,
        code: editCode,
        productionCompany: editCompany,
        location: editLocation,
        productionType: editType,
        notes: editNotes,
      });
      if (!result.ok) {
        setEditError(result.error);
        return;
      }
      toast.success("Production updated");
      setEditTarget(null);
      router.refresh();
    });
  }

  function handleArchive(showId: string) {
    startTransition(async () => {
      const result = await archiveProduction(showId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Production archived");
      router.refresh();
    });
  }

  function handleUnarchive(showId: string) {
    startTransition(async () => {
      const result = await unarchiveProduction(showId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Production restored");
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
            {visible.length} production{visible.length !== 1 ? "s" : ""}
            {archivedCount > 0 && !showArchived ? ` · ${archivedCount} archived` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {archivedCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setShowArchived(!showArchived)}>
              <Archive className="mr-1.5 size-3.5" />
              {showArchived ? "Hide Archived" : "Show Archived"}
            </Button>
          )}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Create Production
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px]">
              <DialogHeader>
                <DialogTitle>Create Production</DialogTitle>
                <DialogDescription>Add a new production to SyncOffset.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  icon={Clapperboard}
                  label="Production Name"
                  required
                  id="create-name"
                  value={name}
                  onChange={setName}
                  placeholder="e.g. Runaway"
                  onEnter={handleCreate}
                  autoFocus
                />
                <FormField
                  icon={Tag}
                  label="Production Code"
                  id="create-code"
                  value={code}
                  onChange={setCode}
                  placeholder="e.g. RUNAWAY"
                />
                <FormField
                  icon={Building2}
                  label="Production Company"
                  id="create-company"
                  value={company}
                  onChange={setCompany}
                  placeholder="e.g. Stage 49 Ltd."
                />
                <FormField
                  icon={MapPin}
                  label="Location"
                  id="create-location"
                  value={location}
                  onChange={setLocation}
                  placeholder="e.g. Vancouver, BC"
                  onEnter={handleCreate}
                />
                {error ? <p className="text-destructive text-sm">{error}</p> : null}
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={isPending || !name.trim()}>
                  {isPending ? "Creating…" : "Create Production"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
              <th className="w-40 px-3 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((p) => {
              const isActive = p.id === activeProductionId;
              const isArchived = !!p.archived_at;
              return (
                <tr key={p.id} className={isActive ? "bg-primary/5" : isArchived ? "opacity-50" : ""}>
                  <td className="px-3 py-2.5 text-center">
                    {isActive ? <Radio className="inline size-4 text-primary" /> : null}
                  </td>
                  <td className="px-3 py-2.5 font-medium">
                    {p.name}
                    {isArchived ? <span className="ml-2 text-muted-foreground text-xs">(archived)</span> : null}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground text-xs">{p.code ?? "—"}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{p.production_company ?? "—"}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{p.location ?? "—"}</td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground text-xs">
                    {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 font-medium text-primary text-xs">
                          <Check className="size-3" />
                          Active
                        </span>
                      ) : isArchived ? null : (
                        <Button variant="outline" size="sm" onClick={() => handleOpen(p.id)} disabled={isPending}>
                          <ExternalLink className="mr-1.5 size-3" />
                          Open
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="size-8 p-0">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!isActive && !isArchived && (
                            <DropdownMenuItem onClick={() => handleOpen(p.id)}>
                              <ExternalLink className="mr-2 size-4" />
                              Open Production
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openEdit(p)}>
                            <Pencil className="mr-2 size-4" />
                            Edit Production
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {isArchived ? (
                            <DropdownMenuItem onClick={() => handleUnarchive(p.id)}>
                              <ArchiveRestore className="mr-2 size-4" />
                              Restore Production
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleArchive(p.id)} disabled={isActive}>
                              <Archive className="mr-2 size-4" />
                              Archive Production
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                  {showArchived ? "No productions found." : "No active productions. Create one to get started."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Production</DialogTitle>
            <DialogDescription>Update production details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormField
              icon={Clapperboard}
              label="Production Name"
              required
              id="edit-name"
              value={editName}
              onChange={setEditName}
              placeholder="Production name"
              onEnter={handleSaveEdit}
              autoFocus
            />
            <FormField
              icon={Tag}
              label="Production Code"
              id="edit-code"
              value={editCode}
              onChange={setEditCode}
              placeholder="e.g. RUNAWAY"
            />
            <FormField
              icon={Building2}
              label="Production Company"
              id="edit-company"
              value={editCompany}
              onChange={setEditCompany}
              placeholder="Company name"
            />
            <FormField
              icon={MapPin}
              label="Location"
              id="edit-location"
              value={editLocation}
              onChange={setEditLocation}
              placeholder="City, Province"
            />
            <FormField
              icon={FileText}
              label="Production Type"
              id="edit-type"
              value={editType}
              onChange={setEditType}
              placeholder="e.g. Feature Film, Series"
            />
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                placeholder="Production notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
              />
            </div>
            {editError ? <p className="text-destructive text-sm">{editError}</p> : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isPending || !editName.trim()}>
              {isPending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormField({
  icon: Icon,
  label,
  required,
  id,
  value,
  onChange,
  placeholder,
  onEnter,
  autoFocus,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  required?: boolean;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onEnter?: () => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <div className="flex items-center gap-2">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onEnter ? (e) => e.key === "Enter" && onEnter() : undefined}
          autoFocus={autoFocus}
        />
      </div>
    </div>
  );
}
