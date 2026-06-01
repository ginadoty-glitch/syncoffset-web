"use client";

/**
 * Brokerage Docs — Central customs & brokerage document hub for SyncOffset.
 *
 * The document custody surface for cross-border production movement:
 *   commercial invoices · hand carries · ATA carnets · customs packages
 *   broker correspondence · clearance records
 *
 * Three-column operational shell (mirrors Logistics):
 *   LEFT   — Document list panel (type filter + search + custody rows)
 *   CENTER — Document detail with action bar, routing, fields, history
 *   RIGHT  — Brokerage intelligence rail (clearance, carnet expiry, threads)
 *
 * Frontend-only. No database integration. Actions are presentational.
 */

import * as React from "react";

import { brokerageDocs } from "./brokerage-data";
import { BrokerageDetail } from "./brokerage-detail";
import { BrokerageIntelligence } from "./brokerage-intelligence";
import { BrokerageList, type DocFilter } from "./brokerage-list";

// Surface order: blocked first, then awaiting clearance, then everything else;
// archived/cleared records sink. Lets coordinators land on the live custody risk.
const signalOrder = { blocker: 0, attention: 1, info: 2, clear: 3 } as const;
const sortedDocs = [...brokerageDocs].sort((a, b) => signalOrder[a.signal] - signalOrder[b.signal]);

export function BrokerageDocs() {
  const [filter, setFilter] = React.useState<DocFilter>("all");
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(sortedDocs[0]?.id ?? null);

  const selectedDoc = brokerageDocs.find((d) => d.id === selectedDocId) ?? null;

  return (
    <div
      data-content-padding="false"
      className="grid h-[calc(100dvh-var(--dashboard-header-height))] overflow-hidden lg:grid-cols-[300px_minmax(0,1fr)_248px] lg:divide-x"
    >
      {/* LEFT — Document list panel */}
      <div className="h-full overflow-hidden">
        <BrokerageList
          filter={filter}
          onFilterChange={setFilter}
          selectedDocId={selectedDocId}
          onSelectDoc={setSelectedDocId}
        />
      </div>

      {/* CENTER — Document detail with action bar */}
      <div className="hidden h-full overflow-hidden lg:block">
        <BrokerageDetail doc={selectedDoc} />
      </div>

      {/* RIGHT — Brokerage intelligence rail */}
      <div className="hidden h-full overflow-hidden lg:block">
        <BrokerageIntelligence selectedDocId={selectedDocId} onSelectDoc={setSelectedDocId} />
      </div>
    </div>
  );
}
