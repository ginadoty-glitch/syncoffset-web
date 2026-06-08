"use client";

import type { LucideIcon } from "lucide-react";
import { Box, Clapperboard, FileText, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { LinkDocumentDialog } from "./link-document-dialog";

type SetOption = {
  id: string;
  setNumber: string;
  setName: string;
};

type Props = {
  hasSet: boolean;
  currentSet: SetOption | null;
  allSets: SetOption[];
};

const PLACEHOLDER_ACTIONS: { label: string; icon: LucideIcon }[] = [
  { label: "Add Asset", icon: Box },
  { label: "Add Scene", icon: Clapperboard },
  { label: "Create Work Order", icon: Wrench },
];

export function SetOperationalActions({ hasSet, currentSet, allSets }: Props) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border/80 border-dashed bg-muted/10 px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-medium text-sm tracking-tight">Set operations</h2>
      </div>
      <p className="text-muted-foreground text-xs">
        Link constitutional <strong>Document</strong> records to this set. Upload still creates documents without a set
        until you link them here.
      </p>
      <div className="flex flex-wrap gap-2">
        {hasSet && currentSet ? (
          <LinkDocumentDialog defaultSetId={currentSet.id} sets={allSets} />
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" size="sm" disabled className="gap-1.5">
                <FileText className="size-3.5" />
                Link Document
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open a valid set to link documents</TooltipContent>
          </Tooltip>
        )}
        {PLACEHOLDER_ACTIONS.map((action) => (
          <Tooltip key={action.label}>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" size="sm" disabled className="gap-1.5">
                <action.icon className="size-3.5" />
                {action.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Coming soon</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </section>
  );
}
