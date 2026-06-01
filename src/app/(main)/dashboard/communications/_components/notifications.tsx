"use client";

/**
 * Notifications — Production operations alert feed.
 *
 * Three-column operational shell mirroring Logistics:
 *   LEFT   — Category rail (Rush Orders / Clearance Delays / Driver Updates /
 *            Brokerage Responses / Production Alerts)
 *   CENTER — Filtered signal feed
 *   RIGHT  — Digest (by severity + needs-action)
 *
 * Frontend-only. No backend wiring.
 */

import * as React from "react";

import { type CategoryFilter, NotificationsCategories } from "./notifications-categories";
import { NotificationsDigest } from "./notifications-digest";
import { NotificationsFeed } from "./notifications-feed";

export function Notifications() {
  const [filter, setFilter] = React.useState<CategoryFilter>("all");

  return (
    <div
      data-content-padding="false"
      className="grid h-[calc(100dvh-var(--dashboard-header-height))] overflow-hidden lg:grid-cols-[240px_minmax(0,1fr)_240px] lg:divide-x"
    >
      <div className="h-full overflow-hidden">
        <NotificationsCategories selected={filter} onSelect={setFilter} />
      </div>

      <div className="hidden h-full overflow-hidden lg:block">
        <NotificationsFeed filter={filter} />
      </div>

      <div className="hidden h-full overflow-hidden lg:block">
        <NotificationsDigest />
      </div>
    </div>
  );
}
