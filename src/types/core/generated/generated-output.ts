/**
 * SyncOffset Generated Outputs — derived product contracts (Article VI)
 *
 * Every output references originating source documents and operational records.
 * Outputs must not replace or mutate immutable sources.
 */

import type { ObjectId, RefCode, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject, CoreObjectStatus } from "../base";
import type { CoreObjectKind } from "../kinds";
import type { RecordProvenance } from "../source/provenance";
import type { GeneratedOutputKind } from "./generated-output-kind";

export type GeneratedOutputStatus = Extract<
  CoreObjectStatus,
  "draft" | "active" | "issued" | "superseded" | "archived" | "cancelled"
>;

/**
 * Links to operational core records used when generating this output.
 */
export type GeneratedOutputRecordRef = {
  readonly recordId: ObjectId;
  readonly recordKind: CoreObjectKind;
  readonly role?: string;
};

/**
 * Optional artifact produced alongside the logical output (PDF, package zip).
 */
export type GeneratedOutputArtifact = {
  readonly storageRef: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly generatedAt: Timestamp;
};

/**
 * Base contract for all generated outputs.
 */
export type GeneratedOutput = AuditableCoreObject & {
  readonly kind: "generated-output";
  readonly outputKind: GeneratedOutputKind;
  readonly status: GeneratedOutputStatus;
  readonly provenance: RecordProvenance;
  readonly sourceRecordRefs: ReadonlyArray<GeneratedOutputRecordRef>;
  readonly ref?: RefCode;
  readonly artifact?: GeneratedOutputArtifact;
};

// ─── Typed outputs ─────────────────────────────────────────────────────────────

export type CallsheetGeneratedOutput = GeneratedOutput & {
  readonly outputKind: "callsheet";
  readonly shootDayId: ObjectId;
  readonly callsheetRevisionSourceDocumentId?: ObjectId;
};

export type DoodGeneratedOutput = GeneratedOutput & {
  readonly outputKind: "dood";
  readonly episodeId?: ObjectId;
  readonly doodSourceDocumentId?: ObjectId;
};

export type CrewListGeneratedOutput = GeneratedOutput & {
  readonly outputKind: "crew-list";
  readonly departmentId?: ObjectId;
  readonly shootDayId?: ObjectId;
};

export type CastListGeneratedOutput = GeneratedOutput & {
  readonly outputKind: "cast-list";
  readonly shootDayId?: ObjectId;
  readonly episodeId?: ObjectId;
};

export type DepartmentReportGeneratedOutput = GeneratedOutput & {
  readonly outputKind: "department-report";
  readonly departmentId: ObjectId;
  readonly shootDayId?: ObjectId;
  readonly reportSubtype?: string;
};

export type LogisticsPackageGeneratedOutput = GeneratedOutput & {
  readonly outputKind: "logistics-package";
  readonly transportOrderIds: ReadonlyArray<ObjectId>;
  readonly shootDayId?: ObjectId;
};

export type BrokeragePackageGeneratedOutput = GeneratedOutput & {
  readonly outputKind: "brokerage-package";
  readonly transportOrderId?: ObjectId;
  readonly vendorId?: ObjectId;
};

/** Discriminated union of all generated output types. */
export type TypedGeneratedOutput =
  | CallsheetGeneratedOutput
  | DoodGeneratedOutput
  | CrewListGeneratedOutput
  | CastListGeneratedOutput
  | DepartmentReportGeneratedOutput
  | LogisticsPackageGeneratedOutput
  | BrokeragePackageGeneratedOutput;

export type GeneratedOutputByKind = {
  readonly callsheet: CallsheetGeneratedOutput;
  readonly dood: DoodGeneratedOutput;
  readonly "crew-list": CrewListGeneratedOutput;
  readonly "cast-list": CastListGeneratedOutput;
  readonly "department-report": DepartmentReportGeneratedOutput;
  readonly "logistics-package": LogisticsPackageGeneratedOutput;
  readonly "brokerage-package": BrokeragePackageGeneratedOutput;
};

export function isGeneratedOutputKind(value: string): value is GeneratedOutputKind {
  const kinds: GeneratedOutputKind[] = [
    "callsheet",
    "dood",
    "crew-list",
    "cast-list",
    "department-report",
    "logistics-package",
    "brokerage-package",
  ];
  return kinds.includes(value as GeneratedOutputKind);
}
