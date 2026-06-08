"use client";

import Link from "next/link";

import { Upload, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

type CastRow = {
  id: string;
  name: string;
  department: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
};

export function CastListView({ cast, showName }: { cast: CastRow[]; showName?: string | null }) {
  if (cast.length === 0) {
    return (
      <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            {showName ? <h1 className="font-extrabold text-2xl tracking-tight">{showName}</h1> : null}
            <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
            {showName ? (
              <h2 className="text-xl tracking-tight">Cast Lists</h2>
            ) : (
              <h1 className="text-2xl tracking-tight">Cast Lists</h1>
            )}
          </div>
          <Button size="sm" asChild>
            <Link href="/ingestion/upload?kind=cast-list">
              <Upload className="mr-2 size-4" />
              Upload Cast List
            </Link>
          </Button>
        </header>
        <Empty className="min-h-[200px] border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No cast imported</EmptyTitle>
            <EmptyDescription>Upload a cast list to populate this workspace.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          {showName ? <h1 className="font-extrabold text-2xl tracking-tight">{showName}</h1> : null}
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Production</p>
          {showName ? (
            <h2 className="text-xl tracking-tight">Cast Lists</h2>
          ) : (
            <h1 className="text-2xl tracking-tight">Cast Lists</h1>
          )}
          <p className="mt-1 text-muted-foreground text-sm">{cast.length} cast members</p>
        </div>
        <Button size="sm" asChild>
          <Link href="/ingestion/upload?kind=cast-list">
            <Upload className="mr-2 size-4" />
            Upload Cast List
          </Link>
        </Button>
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
