"use client";

import { FileCheck2, FileText, Inbox, type LucideIcon, Search, Send, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { type EmailMessage, emails, type FolderId, folderCounts, folders } from "./email-data";
import { labelClasses } from "./email-meta";

const folderIcon: Record<FolderId, LucideIcon> = {
  inbox: Inbox,
  sent: Send,
  drafts: FileText,
  brokerage: FileCheck2,
  approvals: ShieldCheck,
};

function FolderRow({
  id,
  label,
  active,
  onSelect,
}: {
  id: FolderId;
  label: string;
  active: boolean;
  onSelect: (id: FolderId) => void;
}) {
  const Icon = folderIcon[id];
  const counts = folderCounts[id];
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={(e) => {
        e.currentTarget.blur();
        onSelect(id);
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded border px-2.5 py-1.5 text-left transition-colors",
        "hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#bfd4ef]/20",
        active ? "border-[#bfd4ef]/30 bg-[#bfd4ef]/[0.04]" : "border-transparent",
      )}
    >
      <Icon className={cn("size-3.5 shrink-0", active ? "text-[#bfd4ef]" : "text-muted-foreground/55")} />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[11px]",
          active ? "font-medium text-[#dbd5c5]" : "text-foreground/80",
        )}
      >
        {label}
      </span>
      {counts.unread > 0 ? (
        <span className="rounded bg-[#bfd4ef]/15 px-1 font-mono text-[#bfd4ef] text-[9px] tabular-nums">
          {counts.unread}
        </span>
      ) : (
        <span className="font-mono text-[9px] text-muted-foreground/35 tabular-nums">{counts.total}</span>
      )}
    </button>
  );
}

function MessageRow({
  email,
  active,
  onSelect,
}: {
  email: EmailMessage;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={(e) => {
        e.currentTarget.blur();
        onSelect(email.id);
      }}
      className={cn(
        "relative w-full rounded border px-2.5 py-1.5 text-left transition-colors",
        "hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#bfd4ef]/20",
        active ? "border-[#bfd4ef]/30 bg-[#bfd4ef]/[0.04]" : "border-border/50 bg-transparent",
      )}
    >
      {email.priority && !active && (
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[2px] rounded-l",
            email.priority === "rush" ? "bg-[#d3410c]/55" : "bg-[#f2b90e]/45",
          )}
        />
      )}
      <div className="flex items-center gap-1.5">
        {!email.read && <span className="size-1.5 shrink-0 rounded-full bg-[#bfd4ef]" />}
        <span
          className={cn(
            "min-w-0 truncate text-[11px]",
            email.read ? "text-foreground/75" : "font-medium text-[#dbd5c5]",
          )}
        >
          {email.from.name}
        </span>
        <span className="ml-auto shrink-0 font-mono text-[9px] text-muted-foreground/40 tabular-nums">
          {email.time}
        </span>
      </div>
      <div
        className={cn("mt-0.5 truncate text-[10px]", email.read ? "text-muted-foreground/75" : "text-foreground/85")}
      >
        {email.subject}
      </div>
      <div className="mt-0.5 truncate text-[9px] text-muted-foreground/55">{email.preview}</div>
      {email.labels.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {email.labels.map((label) => (
            <span
              key={label}
              className={cn(
                "rounded-sm border px-1 py-px font-mono text-[8px] uppercase tracking-wider",
                labelClasses[label],
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

type EmailListProps = {
  selectedFolder: FolderId;
  onSelectFolder: (id: FolderId) => void;
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
};

export function EmailList({ selectedFolder, onSelectFolder, selectedEmailId, onSelectEmail }: EmailListProps) {
  const folderEmails = emails.filter((e) => e.folder === selectedFolder);
  const totalUnread = emails.filter((e) => !e.read && e.folder === "inbox").length;

  return (
    <Card className="h-full rounded-none ring-0">
      <CardHeader className="px-3 py-2">
        <CardTitle className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
          Mail
          {totalUnread > 0 && (
            <span className="ml-2 rounded bg-[#bfd4ef]/10 px-1.5 py-0.5 font-mono text-[#bfd4ef] text-[8px] normal-case tracking-normal">
              {totalUnread} new
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-1.5 overflow-hidden px-0">
        {/* Folder nav */}
        <div className="flex flex-col gap-0.5 border-b px-2.5 pb-2">
          {folders.map((folder) => (
            <FolderRow
              key={folder.id}
              id={folder.id}
              label={folder.label}
              active={folder.id === selectedFolder}
              onSelect={onSelectFolder}
            />
          ))}
        </div>

        {/* Search */}
        <div className="px-3">
          <InputGroup className="h-6">
            <InputGroupInput className="h-6 text-[10px]" aria-label="Search mail" placeholder="Search mail..." />
            <InputGroupAddon>
              <Search className="size-3" />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Message list */}
        <ScrollArea className="h-0 flex-1">
          <div className="flex flex-col gap-0.5 px-2.5 pb-3">
            {folderEmails.length > 0 ? (
              folderEmails.map((email) => (
                <MessageRow
                  key={email.id}
                  email={email}
                  active={email.id === selectedEmailId}
                  onSelect={onSelectEmail}
                />
              ))
            ) : (
              <div className="px-2 py-6 text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                No messages
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
