'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { DealerData } from './DealerCard';

// Fix for default marker icons in Leaflet with Next.js
import 'leaflet/dist/leaflet.css';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [41, 41],
  className: 'selected-marker',
});

interface DealerMapProps {
  dealers: DealerData[];
  selectedDealer?: DealerData | null;
  onSelectDealer?: (dealer: DealerData) => void;
  center?: [number, number];
  zoom?: number;
}

// Component to handle map view updates when selectedDealer changes
function MapUpdater({ selectedDealer }: { selectedDealer?: DealerData | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedDealer) {
      map.setView([selectedDealer.latitude, selectedDealer.longitude], 14, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [map, selectedDealer]);

  return null;
}

export function DealerMap({
  dealers,
  selectedDealer,
  onSelectDealer,
  center = [20.5937, 78.9629], // Center of India
  zoom = 5,
}: DealerMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Calculate bounds if we have dealers
  const bounds = dealers.length > 0
    ? L.latLngBounds(dealers.map((d) => [d.latitude, d.longitude]))
    : undefined;

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={zoom}
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        className="w-full h-full"
        ref={mapRef}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater selectedDealer={selectedDealer} />

        {dealers.map((dealer) => (
          <Marker
            key={dealer.id}
            position={[dealer.latitude, dealer.longitude]}
            icon={selectedDealer?.id === dealer.id ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => onSelectDealer?.(dealer),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-text-primary mb-2">
                  {dealer.name}
                </h3>
                <p className="text-sm text-text-secondary mb-2">
                  {dealer.address}, {dealer.city}
                </p>
                <a
                  href={`tel:${dealer.phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {dealer.phone}
                </a>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.latitude},${dealer.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  >
                    Directions
                  </a>
                  <a
                    href={`/test-ride?dealer=${dealer.id}`}
                    className="text-xs px-3 py-1.5 bg-accent text-white rounded hover:bg-accent/90 transition-colors"
                  >
                    Book Test Ride
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default DealerMap;
