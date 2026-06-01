/**
 * SyncOffset Script Authority — scene (central graph node)
 *
 * Constitutional object: kind "scene"
 * Scenes connect script authority to schedule, creative, background, and operations.
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { SceneDayNight, SceneIntExt } from "./scene-type";

export type Scene = AuditableCoreObject & {
  readonly kind: "scene";
  readonly sceneNumber: string;
  readonly sceneName: string;
  readonly intExt: SceneIntExt;
  readonly dayNight: SceneDayNight;
  readonly pageCount: number;
  readonly scriptRevisionId: ObjectId;
  readonly episodeId?: ObjectId;
  readonly locationIds: ReadonlyArray<ObjectId>;
  /** @deprecated Prefer characterIds — legacy alias */
  readonly castIds: ReadonlyArray<ObjectId>;
  readonly characterIds: ReadonlyArray<ObjectId>;
  readonly castRequirementIds: ReadonlyArray<ObjectId>;
  readonly bgRequirementIds: ReadonlyArray<ObjectId>;
  readonly stuntRequirementIds: ReadonlyArray<ObjectId>;
  readonly vehicleRequirementIds: ReadonlyArray<ObjectId>;
  readonly propRequirementIds: ReadonlyArray<ObjectId>;
  readonly breakdownElementIds: ReadonlyArray<ObjectId>;
  readonly departmentPackageIds: ReadonlyArray<ObjectId>;
  readonly crewRequirementIds: ReadonlyArray<ObjectId>;
};
