import Link from "next/link";

import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SetDocumentItem } from "@/lib/sets/workspace-types";
import type { DocumentCategory } from "@/types/core/document/document-category";
import { DOCUMENT_CATEGORY_REGISTRY } from "@/types/core/document/document-category";

import { SetSectionEmpty } from "./set-section-empty";

const DOCUMENT_SECTIONS: ReadonlyArray<{
  title: string;
  categories: readonly DocumentCategory[];
}> = [
  { title: "Commercial Invoices", categories: ["commercial-invoice"] },
  { title: "Purchase Orders", categories: ["purchase-order"] },
  { title: "Receipts", categories: ["receipt"] },
  { title: "Reference Photos", categories: ["photo", "reference"] },
  { title: "Drawings", categories: ["drawing", "map"] },
  { title: "Approvals", categories: ["permit", "insurance", "contract", "memo"] },
];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function SetDocumentsPanel({ documents, hasSet }: { documents: SetDocumentItem[]; hasSet: boolean }) {
  if (!hasSet || documents.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-base tracking-tight">Documents</h2>
        <SetSectionEmpty
          icon={FileText}
          title="No documents linked"
          description="Use Link Document above to assign constitutional Document records to this set. Upload alone does not set set_id."
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium text-base tracking-tight">Documents</h2>
      <ScrollArea className="h-[min(420px,50vh)] pr-3">
        <div className="flex flex-col gap-5">
          {DOCUMENT_SECTIONS.map((section) => {
            const items = documents.filter((d) => section.categories.includes(d.category_id));
            if (items.length === 0) return null;
            return (
              <div key={section.title} className="flex flex-col gap-2">
                <h3 className="text-[10px] text-muted-foreground uppercase tracking-widest">{section.title}</h3>
                <ul className="flex flex-col gap-2">
                  {items.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex flex-col gap-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-2"
                    >
                      <Link
                        href={`/dashboard/documents/${doc.id}`}
                        className="font-medium text-sm leading-snug hover:underline"
                      >
                        {doc.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {doc.status_id}
                        </Badge>
                        <span className="text-muted-foreground">{formatDate(doc.uploadDate)}</span>
                        <span className="text-muted-foreground">
                          {DOCUMENT_CATEGORY_REGISTRY[doc.category_id]?.label ?? doc.category_id}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </section>
  );
}
