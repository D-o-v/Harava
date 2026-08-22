"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import("react-globe.gl").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full border border-gold/10 animate-pulse-soft" />
    </div>
  ),
});

type Hub = { lat: number; lng: number };

const HUBS: Record<string, Hub> = {
  // Africa
  lagos: { lat: 6.52, lng: 3.38 },
  nairobi: { lat: -1.28, lng: 36.82 },
  accra: { lat: 5.56, lng: -0.2 },
  joburg: { lat: -26.2, lng: 28.04 },
  cairo: { lat: 30.04, lng: 31.24 },
  // Europe
  london: { lat: 51.5, lng: -0.12 },
  paris: { lat: 48.85, lng: 2.35 },
  frankfurt: { lat: 50.11, lng: 8.68 },
  // North America
  nyc: { lat: 40.71, lng: -74.01 },
  toronto: { lat: 43.65, lng: -79.38 },
  // South America
  saopaulo: { lat: -23.55, lng: -46.63 },
  // Asia
  dubai: { lat: 25.2, lng: 55.27 },
  mumbai: { lat: 19.08, lng: 72.88 },
  singapore: { lat: 1.35, lng: 103.82 },
  tokyo: { lat: 35.68, lng: 139.69 },
  // Oceania
  sydney: { lat: -33.87, lng: 151.21 },
};

type ArcDef = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
};

const arc = (a: keyof typeof HUBS, b: keyof typeof HUBS): ArcDef => ({
  startLat: HUBS[a].lat,
  startLng: HUBS[a].lng,
  endLat: HUBS[b].lat,
  endLng: HUBS[b].lng,
});

const ARCS: ArcDef[] = [
  // Africa internal
  arc("lagos", "nairobi"),
  arc("lagos", "accra"),
  arc("lagos", "joburg"),
  arc("nairobi", "joburg"),
  arc("cairo", "nairobi"),
  // Africa to Europe
  arc("lagos", "london"),
  arc("lagos", "paris"),
  arc("cairo", "frankfurt"),
  arc("nairobi", "london"),
  // Africa to others
  arc("lagos", "dubai"),
  arc("nairobi", "dubai"),
  arc("lagos", "saopaulo"),
  // Europe
  arc("london", "paris"),
  arc("paris", "frankfurt"),
  // Europe to Americas
  arc("london", "nyc"),
  arc("london", "toronto"),
  // Europe to Asia
  arc("london", "dubai"),
  arc("frankfurt", "dubai"),
  arc("frankfurt", "mumbai"),
  // Americas
  arc("nyc", "toronto"),
  arc("nyc", "saopaulo"),
  // Asia
  arc("dubai", "mumbai"),
  arc("dubai", "singapore"),
  arc("mumbai", "singapore"),
  arc("singapore", "tokyo"),
  arc("tokyo", "sydney"),
  arc("singapore", "sydney"),
  // Trans-Pacific
  arc("nyc", "tokyo"),
  arc("london", "singapore"),
];

const HUB_POINTS: Hub[] = Object.values(HUBS);

const COUNTRIES_URL =
  "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson";

interface LoginGlobeProps {
  className?: string;
}

export function LoginGlobe({ className = "" }: LoginGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(undefined);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [countries, setCountries] = useState<{ features: any[] }>({ features: [] });

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch(COUNTRIES_URL)
      .then((r) => r.json())
      .then((data) => setCountries(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !ready) return;

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    globe.pointOfView({ lat: 8, lng: 20, altitude: 2.0 }, 0);
  }, [ready]);

  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: new THREE.Color("#0a1229"),
        emissive: new THREE.Color("#0f1a38"),
        specular: new THREE.Color("#182954"),
        shininess: 5,
        transparent: true,
        opacity: 0.95,
      }),
    []
  );

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    >
      {size.width > 0 && size.height > 0 ? (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor="#C19B3F"
          atmosphereAltitude={0.15}
          polygonsData={countries.features}
          polygonCapColor={() => "rgba(193,155,63,0.08)"}
          polygonSideColor={() => "transparent"}
          polygonStrokeColor={() => "rgba(193,155,63,0.3)"}
          polygonAltitude={0.001}
          arcsData={ARCS}
          arcColor={() => ["rgba(193,155,63,0.8)", "rgba(193,155,63,0.4)"]}
          arcDashLength={0.35}
          arcDashGap={0.15}
          arcDashAnimateTime={2000}
          arcStroke={0.5}
          arcAltitude={0.02}
          pointsData={HUB_POINTS}
          pointColor={() => "#C19B3F"}
          pointAltitude={0.008}
          pointRadius={0.4}
          pointsMerge={false}
        />
      ) : null}
    </div>
  );
}
