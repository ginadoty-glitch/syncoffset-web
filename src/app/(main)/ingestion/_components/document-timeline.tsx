import { Badge } from "@/components/ui/badge";
import type { DocumentTimeline as DocumentTimelineData } from "@/lib/ingestion/queries";
import { cn } from "@/lib/utils";

export function DocumentTimelineView({ timeline }: { timeline: DocumentTimelineData }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-medium text-sm">Document timeline</h2>
        <p className="text-muted-foreground text-xs">
          {timeline.sourceKindLabel} · {timeline.documentTitle}
        </p>
      </div>
      <ol className="relative border-border border-l pl-6">
        {timeline.entries.map((entry, index) => {
          const isLast = index === timeline.entries.length - 1;
          return (
            <li key={entry.revisionId} className={cn("pb-6", isLast && "pb-0")}>
              <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full border-2 border-background bg-primary" />
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-sm">{entry.label}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {entry.ingestionStatus}
                  </Badge>
                </div>
                <span className="text-muted-foreground text-xs">{entry.fileName}</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {entry.uploadedBy} · {new Date(entry.uploadedAt).toLocaleString()}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
