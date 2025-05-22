import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ZoomWithShift from '@/hooks/ZoomWithShift';


interface Location {
    id: number;
    name: string;
    position: { lat: number; lng: number };
    description: string;
    type: string;
}

interface ReusableMapProps {
    locations: Location[];
    initialCenter?: { lat: number; lng: number };
    initialZoom?: number;
    className?: string;
}


// Componente para ajustar la vista del mapa
const MapViewAdjuster = ({ locations }: { locations: Location[] }) => {
    const map = useMap();

    useEffect(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(
                locations.map(loc => [loc.position.lat, loc.position.lng])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [locations, map]);

    return null;
};

const ReusableMap: React.FC<ReusableMapProps> = ({
    locations,
    initialCenter = { lat: 4.676, lng: -75.655 },
    initialZoom = 13,
    className = ''
}) => {
    const [activeLocation, setActiveLocation] = useState<Location | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [, setIsMapInteractive] = useState(false);


    return (
        <div
            className={`relative rounded-xl overflow-hidden shadow-lg ${className}`}
            onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={() => {
            }}
            style={{ height: '500px', width: '100%' }}
        >
            <MapContainer
                center={initialCenter}
                zoom={initialZoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', zIndex: '1' }}
                whenReady={() => setIsMapInteractive(true)}

            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <ZoomWithShift />

                <MapViewAdjuster locations={locations} />

                {locations.map(location => (
                    <Marker
                        key={location.id}
                        position={[location.position.lat, location.position.lng]}
                        eventHandlers={{
                            click: () => setActiveLocation(location),
                            mouseover: () => setActiveLocation(location)
                        }}
                    > <Popup>
                            <div className="p-2">
                                <h3 className="font-bold text-lg">{location.name}</h3>
                                <p className="text-gray-600">{location.description}</p>
                                <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    {location.type}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {activeLocation && (
                <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md max-w-xs z-[1000]">
                    <h3 className="font-bold text-lg">{activeLocation.name}</h3>
                    <p className="text-gray-600">{activeLocation.description}</p>
                </div>
            )}
        </div>
    );
};

export default ReusableMap;