import { History } from "lucide-react";

import { SetSectionEmpty } from "./set-section-empty";

export function SetActivityTimeline() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium text-base tracking-tight">Recent activity</h2>
      <SetSectionEmpty
        icon={History}
        title="No recent activity"
        description="Asset, document, PO, and revision events will appear on a timeline when activity persistence is connected."
      />
    </section>
  );
}
