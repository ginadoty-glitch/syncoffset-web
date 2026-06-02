/**
 * SyncOffset Document Authority — category vocabulary (registry only)
 * @see docs/SYNCOFFSET_DOCUMENT_AUTHORITY.md
 */

export type DocumentCategory =
  | "script"
  | "script-revision"
  | "one-liner"
  | "calendar"
  | "callsheet"
  | "budget"
  | "cost-report"
  | "purchase-order"
  | "vendor-quote"
  | "commercial-invoice"
  | "packing-list"
  | "bill-of-lading"
  | "customs-form"
  | "pod"
  | "receipt"
  | "permit"
  | "insurance"
  | "location-agreement"
  | "reference"
  | "photo"
  | "drawing"
  | "map"
  | "contract"
  | "memo"
  | "other";

export type DocumentCategoryDefinition = {
  readonly categoryId: DocumentCategory;
  readonly label: string;
};

export const DOCUMENT_CATEGORY_REGISTRY: Record<DocumentCategory, DocumentCategoryDefinition> = {
  script: { categoryId: "script", label: "Script" },
  "script-revision": { categoryId: "script-revision", label: "Script Revision" },
  "one-liner": { categoryId: "one-liner", label: "One-Liner" },
  calendar: { categoryId: "calendar", label: "Calendar" },
  callsheet: { categoryId: "callsheet", label: "Callsheet" },
  budget: { categoryId: "budget", label: "Budget" },
  "cost-report": { categoryId: "cost-report", label: "Cost Report" },
  "purchase-order": { categoryId: "purchase-order", label: "Purchase Order" },
  "vendor-quote": { categoryId: "vendor-quote", label: "Vendor Quote" },
  "commercial-invoice": { categoryId: "commercial-invoice", label: "Commercial Invoice" },
  "packing-list": { categoryId: "packing-list", label: "Packing List" },
  "bill-of-lading": { categoryId: "bill-of-lading", label: "Bill of Lading" },
  "customs-form": { categoryId: "customs-form", label: "Customs Form" },
  pod: { categoryId: "pod", label: "Proof of Delivery" },
  receipt: { categoryId: "receipt", label: "Receipt" },
  permit: { categoryId: "permit", label: "Permit" },
  insurance: { categoryId: "insurance", label: "Insurance" },
  "location-agreement": { categoryId: "location-agreement", label: "Location Agreement" },
  reference: { categoryId: "reference", label: "Reference" },
  photo: { categoryId: "photo", label: "Photo" },
  drawing: { categoryId: "drawing", label: "Drawing" },
  map: { categoryId: "map", label: "Map" },
  contract: { categoryId: "contract", label: "Contract" },
  memo: { categoryId: "memo", label: "Memo" },
  other: { categoryId: "other", label: "Other" },
};
