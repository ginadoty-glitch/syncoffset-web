/**
 * SyncOffset Relationship Graph — allowed edge schema (registry integration)
 *
 * Documents which relationship kinds may connect which object kinds.
 * Validation logic is future work — this registry is normative metadata only.
 */

import type { CoreObjectKind } from "../kinds";
import type { RelationshipKind } from "./relationship-kind";

export type RelationshipSchemaEntry = {
  readonly kind: RelationshipKind;
  readonly fromKind: CoreObjectKind | "source-document";
  readonly toKind: CoreObjectKind | "source-document";
  readonly label: string;
};

/**
 * Representative edges for constitutional problem statement + core registry.
 * Not exhaustive — extend as objects are implemented.
 */
export const RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "scheduled-on", fromKind: "scene", toKind: "shoot-day", label: "Scene on Shoot Day" },
  { kind: "occurs-at", fromKind: "shoot-day", toKind: "location", label: "Shoot Day at Location" },
  { kind: "scheduled-on", fromKind: "company-move", toKind: "shoot-day", label: "Company Move on Shoot Day" },
  { kind: "attached-to", fromKind: "media", toKind: "location", label: "Media at Location" },
  { kind: "attached-to", fromKind: "media", toKind: "shoot-day", label: "Media on Shoot Day" },
  { kind: "occurs-at", fromKind: "scene", toKind: "location", label: "Scene at Location" },
  { kind: "assigned-to", fromKind: "cast-member", toKind: "scene", label: "Cast on Scene" },
  { kind: "requires", fromKind: "scene", toKind: "asset", label: "Scene requires Asset" },
  { kind: "attached-to", fromKind: "permit", toKind: "location", label: "Permit for Location" },
  { kind: "generated-from", fromKind: "generated-output", toKind: "document", label: "Output from Source" },
  { kind: "references", fromKind: "generated-output", toKind: "shoot-day", label: "Output references Shoot Day" },
  { kind: "depends-on", fromKind: "transport-order", toKind: "shoot-day", label: "Transport depends on Shoot Day" },
  {
    kind: "derived-from",
    fromKind: "shoot-day",
    toKind: "document",
    label: "Shoot Day extracted from Schedule Source",
  },
  { kind: "impacts", fromKind: "company-move", toKind: "shoot-day", label: "Company Move impacts Shoot Day" },
  // Background authority layer — see src/types/core/background/bg-relationship-contracts.ts
  {
    kind: "derived-from",
    fromKind: "element",
    toKind: "bg-requirement",
    label: "BG Requirement from Breakdown Element",
  },
  {
    kind: "requires",
    fromKind: "bg-requirement",
    toKind: "bg-assignment",
    label: "BG Requirement fulfilled by Assignment",
  },
  {
    kind: "assigned-to",
    fromKind: "background-performer",
    toKind: "bg-assignment",
    label: "Performer on BG Assignment",
  },
  { kind: "scheduled-on", fromKind: "bg-assignment", toKind: "shoot-day", label: "BG Assignment on Shoot Day" },
  { kind: "references", fromKind: "bg-assignment", toKind: "scene", label: "BG Assignment for Scene" },
  // Creative authority — see src/types/core/creative/creative-relationship-contracts.ts
  { kind: "derived-from", fromKind: "script-revision", toKind: "director-note", label: "Director Note from Script" },
  // Script authority — see src/types/core/script/script-relationship-contracts.ts
  { kind: "derived-from", fromKind: "script-revision", toKind: "revision-change", label: "Revision Change" },
  { kind: "derived-from", fromKind: "script-revision", toKind: "scene", label: "Scenes in Script Revision" },
  { kind: "impacts", fromKind: "revision-change", toKind: "scene", label: "Revision Change impacts Scene" },
  { kind: "derived-from", fromKind: "scene", toKind: "breakdown-element", label: "Breakdown Element from Scene" },
  {
    kind: "derived-from",
    fromKind: "breakdown-element",
    toKind: "bg-requirement",
    label: "BG Requirement from Breakdown",
  },
  {
    kind: "derived-from",
    fromKind: "breakdown-element",
    toKind: "department-package",
    label: "Department Package from Breakdown",
  },
  {
    kind: "derived-from",
    fromKind: "director-note",
    toKind: "department-package",
    label: "Department Package from Note",
  },
  { kind: "derived-from", fromKind: "department-package", toKind: "tech-pack", label: "Tech Pack from Package" },
  {
    kind: "attached-to",
    fromKind: "department-package",
    toKind: "creative-reference",
    label: "Creative Reference on Package",
  },
  { kind: "attached-to", fromKind: "tech-pack", toKind: "media", label: "Tech Pack Media" },
  // Cast authority — see src/types/core/cast/cast-relationship-contracts.ts
  { kind: "derived-from", fromKind: "script-revision", toKind: "character", label: "Character from Script" },
  { kind: "derived-from", fromKind: "character", toKind: "cast-requirement", label: "Cast Requirement" },
  { kind: "requires", fromKind: "cast-requirement", toKind: "scene", label: "Cast Requirement on Scene" },
  { kind: "assigned-to", fromKind: "cast-member", toKind: "cast-assignment", label: "Cast Assignment" },
  { kind: "assigned-to", fromKind: "character", toKind: "cast-assignment", label: "Character on Assignment" },
  { kind: "scheduled-on", fromKind: "cast-assignment", toKind: "shoot-day", label: "Cast Assignment on Day" },
  // Crew authority — see src/types/core/crew/crew-relationship-contracts.ts
  { kind: "derived-from", fromKind: "scene", toKind: "crew-requirement", label: "Crew Requirement from Scene" },
  {
    kind: "derived-from",
    fromKind: "breakdown-element",
    toKind: "crew-requirement",
    label: "Crew Requirement from Breakdown Element",
  },
  {
    kind: "derived-from",
    fromKind: "department-package",
    toKind: "crew-requirement",
    label: "Crew Requirement from Package",
  },
  { kind: "assigned-to", fromKind: "crew-requirement", toKind: "department", label: "Requirement in Department" },
  { kind: "assigned-to", fromKind: "crew-member", toKind: "crew-assignment", label: "Crew Assignment" },
  { kind: "scheduled-on", fromKind: "crew-assignment", toKind: "shoot-day", label: "Crew Assignment on Day" },
];
