import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Issue } from "../lib/types";
import { DEFAULT_CENTER } from "../lib/constants";
import ReactDOMServer from "react-dom/server";
import { AlertCircle, Trash2, Droplets, Droplet, Lightbulb, TrafficCone, AlertTriangle, Check, SearchX } from "lucide-react";

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "POTHOLE": return <AlertCircle size={20} className="text-white" />;
    case "GARBAGE": return <Trash2 size={20} className="text-white" />;
    case "ROAD_DAMAGE": return <TrafficCone size={20} className="text-white" />;
    case "DRAINAGE": return <Droplets size={20} className="text-white" />;
    case "WATER_LEAK": return <Droplet size={20} className="text-white" />;
    case "STREETLIGHT": return <Lightbulb size={20} className="text-white" />;
    case "TRAFFIC_SIGNAL": return <AlertTriangle size={20} className="text-white" />;
    default: return <AlertCircle size={20} className="text-white" />;
  }
};

function createCustomIcon(issue: Issue) {
  let innerBg = "bg-[#FF4B4B]";
  let haloBg = "bg-red-500/30";
  let checkHtml = "";
  
  if (issue.status === "SOLVED") {
    innerBg = "bg-[#00B873]";
    haloBg = "bg-emerald-500/0"; // No halo for solved
    const checkIconString = ReactDOMServer.renderToString(<Check size={12} className="text-white" />);
    checkHtml = `<div class="absolute -top-1 -right-1 bg-[#00B873] rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">${checkIconString}</div>`;
  } else if (issue.status === "WIP") {
    innerBg = "bg-[#F59E0B]";
    haloBg = "bg-amber-500/30";
  }

  const iconString = ReactDOMServer.renderToString(getCategoryIcon(issue.category));

  // Base size
  let size = 36;
  let haloSize = 64;
  
  if (issue.severity === "CRITICAL") {
    size = 44;
    haloSize = 80;
  } else if (issue.severity === "HIGH") {
    size = 40;
    haloSize = 72;
  }

  // Offset calculations to center the halo and inner circle
  const innerOffset = (haloSize - size) / 2;

  const html = `
    <div style="width: ${haloSize}px; height: ${haloSize}px" class="relative">
      ${issue.status !== "SOLVED" ? `<div class="absolute inset-0 rounded-full ${haloBg} animate-ping" style="animation-duration: 3s;"></div>` : ''}
      <div class="absolute inset-0 rounded-full ${haloBg}"></div>
      <div style="width: ${size}px; height: ${size}px; top: ${innerOffset}px; left: ${innerOffset}px" class="absolute flex items-center justify-center shadow-lg rounded-full border-[3px] border-white ${innerBg}">
        ${iconString}
        ${checkHtml}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-leaflet-icon",
    iconSize: [haloSize, haloSize],
    iconAnchor: [haloSize/2, haloSize/2],
  });
}

function FlyToMe({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13.5);
  }, [center, map]);
  return null;
}

export function MapView({ issues, onSelectIssue }: { issues: Issue[]; onSelectIssue: (id: string) => void }) {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={13.5}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <FlyToMe center={center} />

        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.lat, issue.lng]}
            icon={createCustomIcon(issue)}
            eventHandlers={{
              click: () => onSelectIssue(issue.id),
            }}
          />
        ))}

        {/* User Marker */}
        <Marker
          position={center}
          icon={L.divIcon({
            html: `
              <div class="relative w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-xl border-2 border-slate-100">
                <span class="text-2xl">🐯</span>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>`,
            className: "",
            iconSize: [48, 48],
            iconAnchor: [24, 24],
          })}
        />
      </MapContainer>

      {issues.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-11/12 max-w-sm pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-slate-100 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4 shadow-inner border border-slate-200">
              <SearchX size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">No Issues Found</h3>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              There are no issues reported in your current map view.
            </p>
            <div className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl text-xs font-bold border border-indigo-100 inline-block pointer-events-auto shadow-sm">
              Be the first to report an issue and earn coins!
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-medium">Use the + button below</div>
          </div>
        </div>
      )}
    </div>
  );
}
