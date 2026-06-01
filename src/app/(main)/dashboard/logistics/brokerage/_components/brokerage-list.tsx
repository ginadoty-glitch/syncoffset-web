"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { type BrokerageDoc, brokerageDocs, type DocType } from "./brokerage-data";
import { docTypeFilters, docTypeMeta, signalMeta, statusMeta } from "./brokerage-meta";

export type DocFilter = DocType | "all";

function DocRow({ doc, active, onSelect }: { doc: BrokerageDoc; active: boolean; onSelect: (id: string) => void }) {
  const TypeIcon = docTypeMeta[doc.type].icon;
  const status = statusMeta[doc.status];

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={(e) => {
        e.currentTarget.blur();
        onSelect(doc.id);
      }}
      className={cn(
        "relative w-full rounded border px-2.5 py-1.5 text-left transition-colors",
        "hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#bfd4ef]/20",
        active ? "border-[#bfd4ef]/30 bg-[#bfd4ef]/[0.04]" : "border-border/50 bg-transparent",
      )}
    >
      {!active && (doc.signal === "blocker" || doc.signal === "attention") && (
        <div className={cn("absolute inset-y-0 left-0 w-[2px] rounded-l", signalMeta[doc.signal].border)} />
      )}

      {/* Row 1: id · type → status */}
      <div className="flex items-center gap-1.5">
        <span className="shrink-0 font-mono text-[#bfd4ef]/70 text-[10px] tracking-wider">{doc.id}</span>
        <TypeIcon className="size-3 shrink-0 text-muted-foreground/45" />
        <span className="min-w-0 truncate text-[9px] text-muted-foreground/55 uppercase tracking-widest">
          {docTypeMeta[doc.type].short}
        </span>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2">
          {doc.priority && <span className="font-mono text-[#f2b90e] text-[9px]">▲</span>}
          <div className={cn("size-1.5 rounded-full", status.dot)} />
          <span className="font-mono text-[9px] text-muted-foreground/40 tabular-nums">{doc.updated}</span>
        </div>
      </div>

      {/* Row 2: title */}
      <div className="mt-0.5 truncate font-medium text-[#dbd5c5]/85 text-[10px]">{doc.title}</div>

      {/* Row 3: broker · linked order · value */}
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="min-w-0 truncate text-[9px] text-muted-foreground/55">{doc.broker.company}</span>
        {doc.linkedOrder && (
          <span className="shrink-0 rounded-sm border border-[#bfd4ef]/20 bg-[#bfd4ef]/[0.05] px-1 font-mono text-[#bfd4ef]/80 text-[8px] tracking-wider">
            {doc.linkedOrder}
          </span>
        )}
        {doc.valueDisplay && (
          <span className="ml-auto shrink-0 font-mono text-[9px] text-muted-foreground/60 tabular-nums">
            {doc.valueDisplay}
          </span>
        )}
      </div>
    </button>
  );
}

type BrokerageListProps = {
  filter: DocFilter;
  onFilterChange: (filter: DocFilter) => void;
  selectedDocId: string | null;
  onSelectDoc: (id: string) => void;
};

export function BrokerageList({ filter, onFilterChange, selectedDocId, onSelectDoc }: BrokerageListProps) {
  const docs = brokerageDocs.filter((d) => filter === "all" || d.type === filter);
  const actionable = brokerageDocs.filter((d) => d.signal === "blocker" || d.status === "awaiting-clearance").length;

  return (
    <Card className="h-full rounded-none ring-0">
      <CardHeader className="px-3 py-2">
        <CardTitle className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
          Brokerage Docs
          {actionable > 0 && (
            <span className="ml-2 rounded bg-[#f2b90e]/10 px-1.5 py-0.5 font-mono text-[#f2b90e] text-[8px] normal-case tracking-normal">
              {actionable} open
            </span>
          )}
        </CardTitle>
        <CardAction>
          <Button size="icon-sm" variant="ghost" className="size-6 text-[#bfd4ef]" disabled aria-label="New document">
            <Plus className="size-3.5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-1.5 overflow-hidden px-0">
        {/* Type filter */}
        <Tabs value={filter} onValueChange={(v) => onFilterChange(v as DocFilter)}>
          <TabsList className="h-7 w-full justify-start gap-0 overflow-x-auto border-b px-3" variant="line">
            {docTypeFilters.map((f) => (
              <TabsTrigger key={f.id} className="h-7 shrink-0 px-2 text-[10px]" value={f.id}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="px-3">
          <InputGroup className="h-6">
            <InputGroupInput
              className="h-6 text-[10px]"
              aria-label="Search brokerage documents"
              placeholder="Search docs, brokers, refs..."
            />
            <InputGroupAddon>
              <Search className="size-3" />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Document list */}
        <ScrollArea className="h-0 flex-1">
          <div className="flex flex-col gap-0.5 px-2.5 pb-3">
            {docs.length > 0 ? (
              docs.map((doc) => (
                <DocRow key={doc.id} doc={doc} active={doc.id === selectedDocId} onSelect={onSelectDoc} />
              ))
            ) : (
              <div className="px-2 py-6 text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                No documents
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
