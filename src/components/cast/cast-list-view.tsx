"use client";

import { Users } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

type CastRow = {
  id: string;
  name: string;
  department: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
};

export function CastListView({ cast }: { cast: CastRow[] }) {
  if (cast.length === 0) {
    return (
      <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <header>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
          <h1 className="text-2xl tracking-tight">Cast Lists</h1>
        </header>
        <Empty className="min-h-[200px] border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No cast imported</EmptyTitle>
            <EmptyDescription>Import production data to populate cast information.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
        <h1 className="text-2xl tracking-tight">Cast Lists</h1>
        <p className="text-muted-foreground mt-1 text-sm">{cast.length} cast members</p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b bg-muted/30 text-left text-muted-foreground text-xs uppercase tracking-wider">
              <th className="px-3 py-2.5 font-medium">#</th>
              <th className="px-3 py-2.5 font-medium">Name</th>
              <th className="px-3 py-2.5 font-medium">Role</th>
              <th className="px-3 py-2.5 font-medium">Phone</th>
              <th className="px-3 py-2.5 font-medium">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cast.map((c, idx) => (
              <tr key={c.id} className="hover:bg-muted/20">
                <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs tabular-nums">{idx + 1}</td>
                <td className="whitespace-nowrap px-3 py-2.5 font-medium">{c.name}</td>
                <td className="max-w-[300px] truncate px-3 py-2.5 text-muted-foreground">{c.position ?? "—"}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{c.phone ?? "—"}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{c.email ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
