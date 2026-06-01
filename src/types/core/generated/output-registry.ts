/**
 * SyncOffset Generated Output Registry
 *
 * Metadata only — describes output kinds and required provenance links.
 * No generation logic (Article VI foundation).
 */

import type { CoreObjectKind } from "../kinds";
import type { SourceDocumentKind } from "../source/source-document-kind";
import type { GeneratedOutputKind } from "./generated-output-kind";

export type GeneratedOutputRegistryEntry = {
  readonly outputKind: GeneratedOutputKind;
  readonly label: string;
  readonly isDerivedOnly: true;
  readonly typicalSourceDocumentKinds: ReadonlyArray<SourceDocumentKind>;
  readonly typicalSourceRecordKinds: ReadonlyArray<CoreObjectKind>;
};

export const GENERATED_OUTPUT_REGISTRY: Record<GeneratedOutputKind, GeneratedOutputRegistryEntry> = {
  callsheet: {
    outputKind: "callsheet",
    label: "Callsheet",
    isDerivedOnly: true,
    typicalSourceDocumentKinds: ["callsheet-revision", "shoot-schedule", "one-liner"],
    typicalSourceRecordKinds: ["shoot-day", "crew-member", "cast-member", "location"],
  },
  dood: {
    outputKind: "dood",
    label: "Day Out of Days Report",
    isDerivedOnly: true,
    typicalSourceDocumentKinds: ["dood", "shoot-schedule"],
    typicalSourceRecordKinds: ["shoot-day", "cast-member", "background-performer"],
  },
  "crew-list": {
    outputKind: "crew-list",
    label: "Crew List",
    isDerivedOnly: true,
    typicalSourceDocumentKinds: ["crew-list", "callsheet-revision"],
    typicalSourceRecordKinds: ["crew-member", "department", "shoot-day"],
  },
  "cast-list": {
    outputKind: "cast-list",
    label: "Cast List",
    isDerivedOnly: true,
    typicalSourceDocumentKinds: ["cast-list", "callsheet-revision"],
    typicalSourceRecordKinds: ["cast-member", "background-performer", "shoot-day"],
  },
  "department-report": {
    outputKind: "department-report",
    label: "Department Report",
    isDerivedOnly: true,
    typicalSourceDocumentKinds: ["callsheet-revision", "breakdown-package", "shoot-schedule"],
    typicalSourceRecordKinds: ["department", "shoot-day", "scene", "asset"],
  },
  "logistics-package": {
    outputKind: "logistics-package",
    label: "Logistics Package",
    isDerivedOnly: true,
    typicalSourceDocumentKinds: ["shoot-schedule", "one-liner", "callsheet-revision"],
    typicalSourceRecordKinds: ["transport-order", "shipment", "shoot-day", "asset"],
  },
  "brokerage-package": {
    outputKind: "brokerage-package",
    label: "Brokerage Package",
    isDerivedOnly: true,
    typicalSourceDocumentKinds: ["vendor-document", "permit"],
    typicalSourceRecordKinds: ["transport-order", "shipment", "vendor", "document"],
  },
};
