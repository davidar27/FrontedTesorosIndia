import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ZoomWithShift from '@/hooks/ZoomWithShift';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Experience } from '@/features/home/map/types/TouristRouteTypes';
import { MapPin } from 'lucide-react';
import { getExperienceTypeDetails } from '@/features/admin/experiences/experienceUtils';


delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;

interface ReusableMapProps {
    locations: Location[];
    initialCenter?: { lat: number; lng: number };
    initialZoom?: number;
    className?: string;
    style?: React.CSSProperties;
}

export interface Location {
    id: number;
    name: string;
    position: {
        lat: number;
        lng: number;
    };
    description: string;
    type: string;
}


L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

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
    className = '',
    style = {}
}) => {
    const [activeExperience, setActiveExperience] = useState<Experience | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [, setIsMapInteractive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { Icon: IconComponent, color } = getExperienceTypeDetails(activeExperience?.type ?? '');


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div
            className={`relative rounded-xl overflow-hidden shadow-lg ${className}`}
            onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={() => {
            }}
            style={{ height: isMobile ? '200px' : style?.height || '400px', width: '100%' }}

        >
            <MapContainer
                center={initialCenter}
                zoom={initialZoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                whenReady={() => setIsMapInteractive(true)}
            >

                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a> — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
                />
                <ZoomWithShift />

                <MapViewAdjuster locations={locations} />

                {locations.map(location => (
                    <Marker
                        key={location.id}
                        position={[location.position.lat, location.position.lng]}
                        eventHandlers={{
                            click: () => setActiveExperience(location as Experience),
                            mouseover: () => setActiveExperience(location as Experience)
                        }}
                    > <Popup >
                            {activeExperience && (<div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 hover:shadow-md transition-shadow w-max">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${color}`}>
                                        <IconComponent className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-green-700">{activeExperience.name}</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{activeExperience.description}</p>
                                {activeExperience && (
                                    <p className="text-xs text-gray-500 flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {activeExperience.location}
                                    </p>
                                )}
                            </div>
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default ReusableMap;