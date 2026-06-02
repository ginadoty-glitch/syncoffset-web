/**
 * SyncOffset Scene Authority — scene (central production unit)
 *
 * Constitutional object: kind "scene"
 * All scheduling, budgeting, breakdown, location, cast, background, crew, and shoot day
 * planning derives from Scene — not from Set.
 *
 * @see docs/SYNCOFFSET_SCENE_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { InteriorExterior, SceneRevisionColor, TimeOfDay } from "./scene-production";

export type Scene = AuditableCoreObject & {
  readonly kind: "scene";

  // —— Constitutional production fields (required) ——
  readonly sceneNumber: string;
  readonly interiorExterior: InteriorExterior;
  readonly timeOfDay: TimeOfDay;
  /** Script page count for this scene (typically in eighths of a page). */
  readonly scriptPages: number;
  readonly setId: ObjectId;
  readonly locationId: ObjectId;
  readonly episodeNumber: string;
  readonly revisionColor: SceneRevisionColor;
  readonly notes: string;

  // —— Script authority linkage ——
  readonly scriptRevisionId: ObjectId;
  readonly episodeId?: ObjectId;

  // —— Graph membership (downstream requirements) ——
  readonly breakdownElementIds: ReadonlyArray<ObjectId>;
  readonly budgetRequirementIds: ReadonlyArray<ObjectId>;
  readonly castRequirementIds: ReadonlyArray<ObjectId>;
  readonly bgRequirementIds: ReadonlyArray<ObjectId>;
  readonly crewRequirementIds: ReadonlyArray<ObjectId>;
  readonly locationRequirementIds: ReadonlyArray<ObjectId>;
  readonly characterIds: ReadonlyArray<ObjectId>;
  readonly departmentPackageIds: ReadonlyArray<ObjectId>;
  readonly stuntRequirementIds: ReadonlyArray<ObjectId>;
  /** @deprecated Assets belong to Sets — use setId / ProductionSet.assetIds */
  readonly vehicleRequirementIds: ReadonlyArray<ObjectId>;
  /** @deprecated Assets belong to Sets — use setId / ProductionSet.assetIds */
  readonly propRequirementIds: ReadonlyArray<ObjectId>;

  /** @deprecated Prefer locationId — multi-location assignments use location-assignment */
  readonly locationIds: ReadonlyArray<ObjectId>;
  /** @deprecated Prefer characterIds */
  readonly castIds: ReadonlyArray<ObjectId>;
  /** @deprecated Prefer interiorExterior */
  readonly intExt?: InteriorExterior;
  /** @deprecated Prefer timeOfDay */
  readonly dayNight?: TimeOfDay;
  /** @deprecated Prefer scriptPages */
  readonly pageCount?: number;
  /** @deprecated Display label only — not constitutional */
  readonly sceneName?: string;
};
