/**
 * SyncOffset Creative Authority — creative reference material
 *
 * Mood boards, look books, scout stills, concept art, etc.
 * Constitutional object: kind "creative-reference"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CreativeReferenceType } from "./creative-category";

/**
 * `characterId` links to `Character` authority records (`kind: "character"`).
 */
export type CreativeReference = AuditableCoreObject & {
  readonly kind: "creative-reference";
  readonly title: string;
  readonly referenceType: CreativeReferenceType;
  readonly scriptRevisionId?: ObjectId;
  readonly sceneIds: ReadonlyArray<ObjectId>;
  readonly locationIds: ReadonlyArray<ObjectId>;
  readonly characterId?: ObjectId;
  readonly shootDayId?: ObjectId;
  readonly departmentPackageId?: ObjectId;
  readonly mediaAssetIds: ReadonlyArray<ObjectId>;
  readonly sourceDocumentId?: ObjectId;
  readonly description?: string;
};
