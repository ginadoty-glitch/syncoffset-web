import type { EmailAttachment, EmailLabel } from "./email-data";

/** Label chip classes — aligned with the Logistics semantic palette. */
export const labelClasses: Record<EmailLabel, string> = {
  Brokerage: "border-[#bfd4ef]/30 bg-[#bfd4ef]/[0.07] text-[#bfd4ef]",
  Approval: "border-[#47AE90]/30 bg-[#47AE90]/[0.08] text-[#47AE90]",
  Rush: "border-[#d3410c]/30 bg-[#d3410c]/[0.08] text-[#d3410c]",
  Clearance: "border-[#f2b90e]/30 bg-[#f2b90e]/[0.07] text-[#f2b90e]",
  Transport: "border-border bg-muted/50 text-muted-foreground",
  Locations: "border-[#4a7fa5]/40 bg-[#4a7fa5]/[0.08] text-[#4a7fa5]",
};

export const attachmentKindLabel: Record<EmailAttachment["kind"], string> = {
  pdf: "PDF",
  doc: "DOC",
  img: "IMG",
  sheet: "XLS",
};
