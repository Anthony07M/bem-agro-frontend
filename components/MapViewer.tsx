"use client";

import { useEffect, useRef } from "react";
import Map, {
  Marker,
  NavigationControl,
  type MapRef,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

interface MapViewerProps {
  latitude: number | null;
  longitude: number | null;
  label?: string;
}

const DEFAULT_CENTER = { latitude: -14.235, longitude: -51.9253, zoom: 3 };

export function MapViewer({ latitude, longitude, label }: MapViewerProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<MapRef>(null);
  const hasCoords = latitude !== null && longitude !== null;

  useEffect(() => {
    if (!hasCoords || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom: 13,
      essential: true,
    });
  }, [latitude, longitude, hasCoords]);

  if (!token) {
    return (
      <div className="flex h-full min-h-72 flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-surface p-6 text-center sm:min-h-96">
        <p className="font-headline text-base font-semibold text-ink">
          Mapbox indisponível
        </p>
        <p className="text-sm text-ink-muted">
          Configure <code className="rounded bg-surface-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code> no .env.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-72 overflow-hidden rounded-3xl shadow-sm sm:min-h-96">
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        initialViewState={
          hasCoords
            ? { latitude, longitude, zoom: 13 }
            : DEFAULT_CENTER
        }
        // mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        style={{ width: "100%", height: "100%" }}
      >
        {hasCoords ? (
          <Marker latitude={latitude} longitude={longitude} anchor="bottom">
            <div className="flex -translate-y-1 flex-col items-center gap-1">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary/90 text-white shadow-lg">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              {label ? (
                <span className="max-w-40 truncate rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-ink shadow">
                  {label}
                </span>
              ) : null}
            </div>
          </Marker>
        ) : null}
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>

      {!hasCoords ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/30">
          <p className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-ink shadow">
            Consulte uma cidade para visualizar no mapa
          </p>
        </div>
      ) : null}
    </div>
  );
}
