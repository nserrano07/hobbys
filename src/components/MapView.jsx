import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const STATUS_COLORS = {
  "Not Contacted": "#2563eb",
  Contacted: "#f59e0b",
  "Viewing Scheduled": "#9333ea",
  "Offer Made": "#16a34a",
  Rejected: "#94a3b8",
};

function anchorIcon(anchor) {
  return L.divIcon({
    html: `<div style="width:32px;height:32px;border-radius:9999px;background:${anchor.color};border:2px solid white;display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${anchor.icon}</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function propertyIcon(prop) {
  const color = STATUS_COLORS[prop.status] || "#2563eb";
  return L.divIcon({
    html: `<div style="width:28px;height:28px;border-radius:9999px;background:${color};border:2px solid white;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer;">£</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const DEFAULT_CENTER = [51.39, 0.05];

export default function MapView({
  anchors,
  properties,
  onSelectProperty,
  pickingLocation,
  onPickLocation,
  focusSignal,
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});
  const pickMarkerRef = useRef(null);
  const pickingRef = useRef(pickingLocation);
  const onPickRef = useRef(onPickLocation);

  pickingRef.current = pickingLocation;
  onPickRef.current = onPickLocation;

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current).setView(DEFAULT_CENTER, 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", (e) => {
      if (!pickingRef.current) return;
      const coords = [e.latlng.lat, e.latlng.lng];
      if (pickMarkerRef.current) map.removeLayer(pickMarkerRef.current);
      pickMarkerRef.current = L.marker(coords).addTo(map);
      onPickRef.current?.(coords);
    });

    mapInstance.current = map;
    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    anchors.forEach((anchor) => {
      const marker = L.marker(anchor.coords, { icon: anchorIcon(anchor) })
        .bindPopup(`<b>${anchor.name}</b><br/>${anchor.address}`)
        .addTo(map);
      markersRef.current[anchor.id] = marker;
    });

    properties
      .filter((p) => !p.isArchived && p.coords)
      .forEach((prop) => {
        const marker = L.marker(prop.coords, { icon: propertyIcon(prop) })
          .bindPopup(
            `<div><b>${prop.address || "Unnamed listing"}</b><br/>${
              prop.price ? `£${prop.price}/mo` : "Price not set"
            }<br/>Status: ${prop.status}</div>`
          )
          .addTo(map);
        marker.on("click", () => onSelectProperty?.(prop));
        markersRef.current[prop.id] = marker;
      });
  }, [anchors, properties, onSelectProperty]);

  useEffect(() => {
    if (!focusSignal || !mapInstance.current) return;
    const { coords, zoom, id } = focusSignal;
    if (!coords) return;
    mapInstance.current.setView(coords, zoom || 14);
    markersRef.current[id]?.openPopup();
  }, [focusSignal]);

  useEffect(() => {
    if (!pickingLocation && pickMarkerRef.current && mapInstance.current) {
      mapInstance.current.removeLayer(pickMarkerRef.current);
      pickMarkerRef.current = null;
    }
  }, [pickingLocation]);

  return (
    <div className="relative">
      <div ref={mapRef} className="h-96 w-full bg-slate-100" />
      {pickingLocation && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse z-[1000]">
          Click on the map to set the location
        </div>
      )}
    </div>
  );
}
