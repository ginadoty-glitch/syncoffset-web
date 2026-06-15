/**
 * Coordinate acceptance guard — ported verbatim in spirit from the mobile
 * fleet map (`expo/utils/fleetMapStopPlacement.ts`) so desktop and mobile
 * accept/reject the same pins. This is reuse, not a new mapping system.
 *
 * Rejects coordinates outside the mainland BC / Fraser Valley operating
 * theater, plus common Georgia Strait ocean pins that still fall inside the
 * coarse lng/lat envelope.
 */

const BC_LAT_MIN = 49.0;
const BC_LAT_MAX = 49.6;
const BC_LNG_MIN = -123.4;
const BC_LNG_MAX = -121.2;

export function passesBcMainlandBounds(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= BC_LAT_MIN &&
    lat <= BC_LAT_MAX &&
    lng >= BC_LNG_MIN &&
    lng <= BC_LNG_MAX
  );
}

/** Reject common Georgia Strait ocean pins still inside the coarse BC envelope. */
function passesVancouverMetroWaterReject(lat: number, lng: number): boolean {
  if (lng < -123.32 && lat > 49.33) return false;
  if (lng < -123.45) return false;
  return true;
}

export function acceptCoordinate(lat: number, lng: number): boolean {
  if (!passesBcMainlandBounds(lat, lng)) return false;
  if (!passesVancouverMetroWaterReject(lat, lng)) return false;
  return true;
}

/** Default map framing — mainland BC theater (matches mobile VAN_REGION center). */
export const BC_THEATER_CENTER = { lat: 49.2827, lng: -123.1207 } as const;
