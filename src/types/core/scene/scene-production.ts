/**
 * SyncOffset Scene Authority — constitutional production fields
 *
 * Required on every Scene record. Not optional metadata.
 * @see docs/SYNCOFFSET_SCENE_AUTHORITY.md
 */

import type { ScriptRevisionColor } from "../script/script-status";

/** Slating: INT · EXT · INT/EXT */
export type InteriorExterior = "INT" | "EXT" | "INT/EXT";

/** Slating: DAY · NIGHT · DAWN · DUSK */
export type TimeOfDay = "DAY" | "NIGHT" | "DAWN" | "DUSK" | "CONTINUOUS";

export type SceneRevisionColor = ScriptRevisionColor;

/** @deprecated Use InteriorExterior — legacy script slating values */
export type SceneIntExt = "int" | "ext" | "int-ext";

/** @deprecated Use TimeOfDay — legacy script slating values */
export type SceneDayNight = "day" | "night" | "dawn" | "dusk" | "continuous";
