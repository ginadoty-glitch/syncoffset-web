import { Ruler } from "lucide-react";

import type { SetDocumentItem } from "@/lib/sets/workspace-types";
import type { DocumentCategory } from "@/types/core/document/document-category";

import { SetDocumentsPanel } from "./set-documents-panel";
import { SetSectionEmpty } from "./set-section-empty";

const DRAWING_CATEGORIES: readonly DocumentCategory[] = ["drawing", "map"];

const DRAWING_TYPES = ["Floor Plans", "Elevations", "CAD", "PDF", "Construction Notes"] as const;

export function SetDrawingsPanel({ documents, hasSet }: { documents: SetDocumentItem[]; hasSet: boolean }) {
  const drawings = documents.filter((d) => DRAWING_CATEGORIES.includes(d.category_id));

  if (!hasSet || drawings.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg tracking-tight">Technical drawings</h2>
        <SetSectionEmpty
          icon={Ruler}
          title="No drawings on file"
          description="Floor plans, elevations, CAD, PDF, and construction notes appear when linked as document records."
        />
        <div className="flex flex-wrap gap-2">
          {DRAWING_TYPES.map((t) => (
            <span key={t} className="rounded-md border border-dashed px-2 py-1 text-muted-foreground text-[10px]">
              {t}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium text-lg tracking-tight">Technical drawings</h2>
      <SetDocumentsPanel documents={drawings} hasSet={hasSet} />
    </section>
  );
}
