/**
 * SyncOffset Production Accounting Authority — generated report documentation only
 *
 * Constitutional object: kind "cost-report-package"
 *
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type CostReportPackageKind =
  | "cost-report-package"
  | "department-cost-package"
  | "variance-package"
  | "producer-package";

export type CostReportPackageKindDefinition = {
  readonly packageKind: CostReportPackageKind;
  readonly label: string;
};

export const COST_REPORT_PACKAGE_KIND_REGISTRY: Record<CostReportPackageKind, CostReportPackageKindDefinition> = {
  "cost-report-package": { packageKind: "cost-report-package", label: "Cost Report Package" },
  "department-cost-package": { packageKind: "department-cost-package", label: "Department Cost Package" },
  "variance-package": { packageKind: "variance-package", label: "Variance Package" },
  "producer-package": { packageKind: "producer-package", label: "Producer Package" },
};

export type CostReportPackage = AuditableCoreObject & {
  readonly kind: "cost-report-package";
  readonly costReportId: ObjectId;
  readonly packageKind: CostReportPackageKind;
  readonly generatedAt: Timestamp;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
