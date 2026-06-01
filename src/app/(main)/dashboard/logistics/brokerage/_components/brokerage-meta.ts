import { BookMarked, Briefcase, FileText, type LucideIcon, Mail, Package, ShieldCheck } from "lucide-react";

import type { DocStatus, DocType, Signal } from "./brokerage-data";

export const docTypeMeta: Record<DocType, { label: string; short: string; icon: LucideIcon }> = {
  "commercial-invoice": { label: "Commercial Invoice", short: "CI", icon: FileText },
  "hand-carry": { label: "Hand Carry", short: "Hand Carry", icon: Briefcase },
  carnet: { label: "Carnet", short: "Carnet", icon: BookMarked },
  "customs-package": { label: "Customs Package", short: "Customs", icon: Package },
  "broker-correspondence": { label: "Broker Correspondence", short: "Corr", icon: Mail },
  "clearance-record": { label: "Clearance Record", short: "Clearance", icon: ShieldCheck },
};

export const statusMeta: Record<DocStatus, { label: string; dot: string; badge: string }> = {
  draft: { label: "Draft", dot: "bg-muted-foreground/35", badge: "border-muted bg-muted/50 text-muted-foreground" },
  sent: { label: "Sent", dot: "bg-[#bfd4ef]", badge: "border-[#bfd4ef]/30 bg-[#bfd4ef]/10 text-[#bfd4ef]" },
  "awaiting-clearance": {
    label: "Awaiting Clearance",
    dot: "bg-[#f2b90e]",
    badge: "border-[#f2b90e]/30 bg-[#f2b90e]/10 text-[#f2b90e]",
  },
  held: { label: "Held", dot: "bg-[#d3410c]", badge: "border-[#d3410c]/30 bg-[#d3410c]/10 text-[#d3410c]" },
  cleared: { label: "Cleared", dot: "bg-[#47AE90]", badge: "border-[#47AE90]/30 bg-[#47AE90]/10 text-[#47AE90]" },
  amended: { label: "Amended", dot: "bg-[#4a7fa5]", badge: "border-[#4a7fa5]/30 bg-[#4a7fa5]/10 text-[#4a7fa5]" },
  archived: { label: "Archived", dot: "bg-border", badge: "border-border bg-muted/30 text-muted-foreground/70" },
};

export const signalMeta: Record<Signal, { tag: string; text: string; border: string; bg: string }> = {
  blocker: { tag: "■ BLOCKED", text: "text-[#d3410c]", border: "bg-[#d3410c]/55", bg: "bg-[#d3410c]/[0.04]" },
  attention: { tag: "▲ ATTN", text: "text-[#f2b90e]", border: "bg-[#f2b90e]/45", bg: "" },
  info: { tag: "→ INFO", text: "text-[#bfd4ef]", border: "bg-[#bfd4ef]/40", bg: "" },
  clear: { tag: "✓ CLEAR", text: "text-[#47AE90]", border: "bg-[#47AE90]/40", bg: "" },
};

export const attachmentKindLabel: Record<"pdf" | "doc" | "img" | "xls", string> = {
  pdf: "PDF",
  doc: "DOC",
  img: "IMG",
  xls: "XLS",
};

/** Filter tabs for the document list — "all" plus each doc type. */
export const docTypeFilters: { id: DocType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "commercial-invoice", label: "CI" },
  { id: "hand-carry", label: "Hand Carry" },
  { id: "carnet", label: "Carnet" },
  { id: "customs-package", label: "Customs" },
  { id: "broker-correspondence", label: "Corr" },
  { id: "clearance-record", label: "Clearance" },
];
