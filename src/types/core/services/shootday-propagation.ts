/**
 * @deprecated Superseded by `src/types/core/shootday/`. See SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md
 *
 * Documents how calendar authority changes fan out to consumers.
 * Distinct from logistics/propagation.ts until unified in a future phase.
 *
 * @see CANONICAL_RELATIONSHIP_PATHS in relationships/relationship-path.ts
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { GeneratedOutputKind } from "../generated/generated-output-kind";
import type { SourceDocumentKind } from "../source/source-document-kind";

/** Inbound triggers that may create or revise a ShootDay (sources → authority). */
export type ShootDayPropagationTrigger = "schedule-revision" | "one-liner-revision";

/** Outbound consumers that derive operational state from a ShootDay (authority → consumers). */
export type ShootDayPropagationTarget = "callsheet" | "company-move" | "transport-order" | "generated-output";

export type ShootDayInboundPropagationSpec = {
  readonly trigger: ShootDayPropagationTrigger;
  readonly sourceDocumentKind: Extract<SourceDocumentKind, "shoot-schedule" | "one-liner">;
  readonly relationshipKind: "derived-from";
  readonly description: string;
};

export type ShootDayOutboundPropagationSpec = {
  readonly target: ShootDayPropagationTarget;
  readonly generatedOutputKind?: GeneratedOutputKind;
  readonly relationshipKind: "scheduled-on" | "depends-on" | "generated-from";
  readonly description: string;
};

/**
 * Canonical inbound / outbound propagation matrix — specification only.
 */
export const SHOOTDAY_PROPAGATION_SPECS: {
  readonly inbound: ReadonlyArray<ShootDayInboundPropagationSpec>;
  readonly outbound: ReadonlyArray<ShootDayOutboundPropagationSpec>;
} = {
  inbound: [
    {
      trigger: "schedule-revision",
      sourceDocumentKind: "shoot-schedule",
      relationshipKind: "derived-from",
      description: "Schedule Revision → ShootDay (calendar authority receives extracted day state).",
    },
    {
      trigger: "one-liner-revision",
      sourceDocumentKind: "one-liner",
      relationshipKind: "derived-from",
      description: "One-Liner Revision → ShootDay.",
    },
  ],
  outbound: [
    {
      target: "callsheet",
      generatedOutputKind: "callsheet",
      relationshipKind: "generated-from",
      description: "ShootDay → Callsheet (generated output and operational calls).",
    },
    {
      target: "company-move",
      relationshipKind: "scheduled-on",
      description: "ShootDay → Company Move.",
    },
    {
      target: "transport-order",
      relationshipKind: "depends-on",
      description: "ShootDay → Transport Order.",
    },
    {
      target: "generated-output",
      relationshipKind: "generated-from",
      description: "ShootDay → Generated Outputs (DOOD, crew/cast lists, department reports, packages).",
    },
  ],
};

/** Planned propagation after a ShootDay mutation — no side effects executed. */
export type ShootDayPropagationPlan = {
  readonly planId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly trigger: ShootDayPropagationTrigger | "shoot-day-revision" | "shoot-day-supersede";
  readonly plannedAt: Timestamp;
  readonly inboundSourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly outboundTargets: ReadonlyArray<{
    readonly target: ShootDayPropagationTarget;
    readonly affectedRecordIds?: ReadonlyArray<ObjectId>;
  }>;
};

export type PlanShootDayPropagationInput = {
  readonly productionId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly trigger: ShootDayPropagationPlan["trigger"];
  readonly sourceDocumentIds?: ReadonlyArray<ObjectId>;
};

/**
 * Future propagation planner — plans only; execution belongs to downstream services.
 */
export type ShootDayPropagationService = {
  plan(input: PlanShootDayPropagationInput): Promise<ShootDayPropagationPlan>;
};
