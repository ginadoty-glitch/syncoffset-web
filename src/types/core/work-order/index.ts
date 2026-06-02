/**
 * SyncOffset Work Order Authority — barrel export
 *
 * WorkOrder — formal inter-department production request (always on a Set)
 * WorkOrderTask — individual execution items
 * WorkOrderPackage — generated documentation only
 */

export type { WorkOrder } from "./work-order";
export type { WorkOrderPackage, WorkOrderPackageKind } from "./work-order-package";
export { WORK_ORDER_PACKAGE_KIND_REGISTRY } from "./work-order-package";
export type { WorkOrderPriority } from "./work-order-priority";
export { WORK_ORDER_PRIORITY_REGISTRY } from "./work-order-priority";
export {
  WORK_ORDER_CANONICAL_RELATIONSHIP_PATHS,
  WORK_ORDER_RELATIONSHIP_SCHEMA_REGISTRY,
  WORK_ORDER_RELATIONSHIP_TARGETS,
} from "./work-order-relationship-contracts";
export type { WorkOrderStatus, WorkOrderTaskStatus } from "./work-order-status";
export { WORK_ORDER_STATUS_REGISTRY, WORK_ORDER_TASK_STATUS_REGISTRY } from "./work-order-status";
export type { WorkOrderTask } from "./work-order-task";
