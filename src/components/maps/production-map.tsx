"use client";

/**
 * ProductionMap — reusable Google Maps surface for SyncOffset Web.
 *
 * Desktop parity with the mobile fleet map: same location concepts
 * (OperationalLocation / GeoCoordinate) and the same BC-bounds acceptance
 * guard (`src/lib/maps/geo-bounds.ts`, ported from the mobile fleet map).
 *
 * Phase 1 scope: render a map and drop a pin per existing location. Existing
 * `locations` rows store an address but no coordinates, so addresses are
 * geocoded client-side via the already-loaded Maps JS Geocoder. No routing,
 * transport, dispatch, or movement UI.
 */

import { useEffect, useMemo, useRef, useState } from "react";

import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";

import { acceptCoordinate, BC_THEATER_CENTER } from "@/lib/maps/geo-bounds";
import type { GeoCoordinate, OperationalLocation } from "@/types/operations/shared";

export type ProductionMapLocation = {
  id: string;
  name: string;
  address: string;
  region?: string | null;
};

type Pin = OperationalLocation & { coordinates: GeoCoordinate };

const MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const LOADER_ID = "syncoffset-google-maps";

const CONTAINER_STYLE = { width: "100%", height: "100%" } as const;

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  gestureHandling: "greedy",
};

function MapFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--desk-border)] bg-[var(--desk-surface-2)]">
      <div className="h-[360px] w-full">{children}</div>
    </div>
  );
}

function MapNotice({ title, body }: { title: string; body: string }) {
  return (
    <MapFrame>
      <div className="flex h-full flex-col items-center justify-center gap-1 px-6 text-center">
        <p className="font-extrabold text-[13px] tracking-[-0.01em]">{title}</p>
        <p className="max-w-md text-[11px] text-[var(--desk-text-dim)] leading-relaxed">{body}</p>
      </div>
    </MapFrame>
  );
}

export function ProductionMap({ locations, className }: { locations: ProductionMapLocation[]; className?: string }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: LOADER_ID,
    googleMapsApiKey: MAP_KEY,
  });

  const [pins, setPins] = useState<Pin[]>([]);
  const [geocoding, setGeocoding] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const geocodable = useMemo(() => locations.filter((loc) => loc.address.trim().length > 0), [locations]);

  useEffect(() => {
    if (!isLoaded || geocodable.length === 0) return;

    let cancelled = false;
    const geocoder = new google.maps.Geocoder();
    const cache = new Map<string, GeoCoordinate | null>();

    async function run() {
      setGeocoding(true);
      const resolved: Pin[] = [];

      for (const loc of geocodable) {
        const key = loc.address.trim().toLowerCase();
        let coord = cache.get(key);

        if (coord === undefined) {
          coord = null;
          try {
            const { results } = await geocoder.geocode({ address: loc.address.trim() });
            const top = results[0]?.geometry?.location;
            if (top) {
              const lat = top.lat();
              const lng = top.lng();
              if (acceptCoordinate(lat, lng)) {
                coord = { latitude: lat, longitude: lng };
              }
            }
          } catch {
            coord = null;
          }
          cache.set(key, coord);
        }

        if (coord) {
          resolved.push({
            id: loc.id,
            displayName: loc.name,
            region: loc.region ?? "",
            coordinates: coord,
            locationRef: loc.id,
          });
        }
      }

      if (!cancelled) {
        setPins(resolved);
        setGeocoding(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, geocodable]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || pins.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    for (const pin of pins) {
      bounds.extend({ lat: pin.coordinates.latitude, lng: pin.coordinates.longitude });
    }
    map.fitBounds(bounds, 64);
  }, [pins]);

  if (!MAP_KEY) {
    return (
      <div className={className}>
        <MapNotice
          title="Map not configured"
          body="Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the production map. Locations still appear in the list below."
        />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={className}>
        <MapNotice
          title="Map failed to load"
          body="Google Maps could not initialize. Check the API key and that the Maps JavaScript API is enabled."
        />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={className}>
        <MapNotice title="Loading map…" body="Initializing Google Maps." />
      </div>
    );
  }

  const selected = pins.find((pin) => pin.id === selectedId) ?? null;

  return (
    <div className={className}>
      <MapFrame>
        <GoogleMap
          mapContainerStyle={CONTAINER_STYLE}
          center={BC_THEATER_CENTER}
          zoom={9}
          options={MAP_OPTIONS}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onUnmount={() => {
            mapRef.current = null;
          }}
          onClick={() => setSelectedId(null)}
        >
          {pins.map((pin) => (
            <MarkerF
              key={pin.id}
              position={{ lat: pin.coordinates.latitude, lng: pin.coordinates.longitude }}
              title={pin.displayName}
              onClick={() => setSelectedId(pin.id)}
            />
          ))}
          {selected ? (
            <InfoWindowF
              position={{
                lat: selected.coordinates.latitude,
                lng: selected.coordinates.longitude,
              }}
              onCloseClick={() => setSelectedId(null)}
            >
              <div className="text-[12px] text-black">
                <p className="font-bold">{selected.displayName}</p>
                {selected.region ? <p className="text-[11px]">{selected.region}</p> : null}
              </div>
            </InfoWindowF>
          ) : null}
        </GoogleMap>
      </MapFrame>
      <p className="mt-1 text-[10px] text-[var(--desk-text-dim)]">
        {geocoding
          ? "Placing locations…"
          : `${pins.length} of ${geocodable.length} location${geocodable.length === 1 ? "" : "s"} placed on map`}
      </p>
    </div>
  );
}
