import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, markers]);
  return null;
}

export default function ItineraryMap({ days }) {
  const markers = useMemo(() => {
    if (!days || !Array.isArray(days)) return [];
    const pts = [];
    days.forEach(day => {
      day.activities?.forEach(act => {
        if (typeof act.lat === 'number' && typeof act.lng === 'number') {
          pts.push({
            lat: act.lat,
            lng: act.lng,
            title: act.activity,
            description: act.description,
            time: act.time,
            day: day.day
          });
        }
      });
    });
    return pts;
  }, [days]);

  if (markers.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-2xl border border-slate-800">
        <p className="text-slate-400 text-sm">No map locations available for this itinerary.</p>
      </div>
    );
  }

  // Default center if bounds fail for some reason
  const defaultCenter = [markers[0].lat, markers[0].lng];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-800 relative shadow-inner z-0">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, idx) => (
          <Marker key={idx} position={[m.lat, m.lng]}>
            <Popup className="custom-popup">
              <div className="font-sans">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1 block">
                  Day {m.day} {m.time ? `• ${m.time}` : ''}
                </span>
                <p className="font-bold text-slate-900 text-sm mb-1">{m.title}</p>
                {m.description && <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{m.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
        <FitBounds markers={markers} />
      </MapContainer>
    </div>
  );
}
