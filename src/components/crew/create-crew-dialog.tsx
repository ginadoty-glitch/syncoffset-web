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
import { createCrewContact } from "@/server/crew-actions";

export function CreateCrewDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setDepartment("");
    setPosition("");
    setPhone("");
    setEmail("");
    setCompany("");
    setNotes("");
    setError(null);
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await createCrewContact({ name, department, position, phone, email, company, notes });
      if (result.ok) {
        toast.success("Crew contact added");
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
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Add Crew
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Crew Contact</DialogTitle>
          <DialogDescription>Add a crew member, vendor contact, or department head.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="crew-name">Name *</Label>
            <Input id="crew-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="crew-dept">Department</Label>
              <Input
                id="crew-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Art, Transport"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crew-pos">Position</Label>
              <Input
                id="crew-pos"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Key Grip"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="crew-phone">Phone</Label>
              <Input
                id="crew-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 604-000-0000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crew-email">Email</Label>
              <Input
                id="crew-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="crew-company">Company</Label>
            <Input
              id="crew-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company or vendor name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="crew-notes">Notes</Label>
            <Textarea
              id="crew-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
              rows={2}
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !name.trim()}>
            {isPending ? "Adding…" : "Add Contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
