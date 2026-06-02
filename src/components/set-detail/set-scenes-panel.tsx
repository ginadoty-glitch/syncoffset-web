import { Clapperboard } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SceneRow } from "@/lib/sets/workspace-types";

import { SetSectionEmpty } from "./set-section-empty";

export function SetScenesPanel({ scenes, hasSet }: { scenes: SceneRow[]; hasSet: boolean }) {
  if (!hasSet || scenes.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-base tracking-tight">Scene usage</h2>
        <SetSectionEmpty
          icon={Clapperboard}
          title="No scene usage available"
          description="Scenes linked to this set surface here when scene persistence is populated."
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium text-base tracking-tight">Scene usage</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {scenes.map((scene) => (
          <Card
            key={scene.id}
            className="cursor-default border-border/60 bg-card/50 transition-colors hover:bg-card/80"
          >
            <CardHeader className="pb-1">
              <span className="font-mono text-muted-foreground text-xs tabular-nums">Scene {scene.scene_number}</span>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <p className="line-clamp-3 text-[#dbd5c5] text-xs leading-relaxed">
                {scene.description.trim() || "No description"}
              </p>
              <div className="flex gap-4 text-muted-foreground text-[11px]">
                <span>Cast {scene.cast_count}</span>
                <span>Assets {scene.asset_count}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
