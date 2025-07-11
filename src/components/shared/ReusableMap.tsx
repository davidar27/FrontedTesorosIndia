/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ZoomWithShift from '@/hooks/ZoomWithShift';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Experience } from '@/features/home/map/types/TouristRouteTypes';
import { MapPin, Navigation } from 'lucide-react';
import { getExperienceTypeDetails } from '@/features/admin/experiences/experienceUtils';
import Picture from '../ui/display/Picture';
import { getImageUrl } from '@/utils/getImageUrl';
import Button from '@/components/ui/buttons/Button';
import { useNavigate, useLocation } from 'react-router-dom';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;

interface ReusableMapProps {
    locations: Location[];
    initialCenter?: { lat: number; lng: number };
    initialZoom?: number;
    className?: string;
    style?: React.CSSProperties;
    selectedLocation?: Experience | null;
    showControls?: boolean;
    theme?: 'light' | 'dark';
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
    rating?: number;
    reviewCount?: number;
    duration?: string;
    price?: number;
    imageUrl?: string;
    isPopular?: boolean;
}

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Marcador personalizado con mejor diseño
const createCustomIcon = (type: string, isActive: boolean = false, isExperiencesRoute: boolean = false) => {
    const { color } = getExperienceTypeDetails(type);
    // En la ruta de experiencias, usar tamaño fijo sin efectos de hover
    const iconSize = isExperiencesRoute ? 35 : (isActive ? 45 : 35);

    return L.divIcon({
        html: `
            <div class="custom-marker ${isActive ? 'active' : ''}" style="
                width: ${iconSize}px;
                height: ${iconSize}px;
                background: linear-gradient(135deg, ${color.replace('from-', '').replace('to-', '')});
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border: 3px solid white;
                position: relative;
                transform: ${isActive ? 'scale(1.1)' : 'scale(1)'};
                transition: all 0.3s ease;
            ">
                <div style="color: white; font-size: ${iconSize * 0.4}px;">
                    📍
                </div>
            </div>
        `,
        className: 'custom-marker-wrapper',
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize],
        popupAnchor: [0, -iconSize],
    });
};

const MapViewAdjuster = ({ locations, selectedLocation }: { locations: Location[]; selectedLocation?: Experience | null }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedLocation) {
            map.setView(
                [selectedLocation.position.lat, selectedLocation.position.lng],
                16,
                { animate: true, duration: 1 }
            );
        } else if (locations.length > 0) {
            const bounds = L.latLngBounds(
                locations.map(loc => [loc.position.lat, loc.position.lng])
            );
            map.fitBounds(bounds, {
                padding: [60, 60],
                maxZoom: 15
            });
        }
    }, [locations, map, selectedLocation]);

    return null;
};

const MapControls = ({ onZoomIn, onZoomOut, onCenter, theme }: {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onCenter: () => void;
    theme: 'light' | 'dark';
}) => (
    <div className={`absolute top-4 right-4 z-[1000] flex flex-col gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'
        }`}>
        <button
            onClick={onZoomIn}
            className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center font-bold text-lg transition-all hover:scale-105 ${theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
        >
            +
        </button>
        <button
            onClick={onZoomOut}
            className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center font-bold text-lg transition-all hover:scale-105 ${theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
        >
            -
        </button>
        <button
            onClick={onCenter}
            className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center transition-all hover:scale-105 ${theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
        >
            <Navigation className="w-4 h-4" />
        </button>
    </div>
);

const MapControlsInternal = ({ locations, theme }: { locations: Location[]; theme: 'light' | 'dark' }) => {
    const map = useMap();

    const handleZoomIn = () => map.zoomIn();
    const handleZoomOut = () => map.zoomOut();
    const handleCenter = () => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(
                locations.map(loc => [loc.position.lat, loc.position.lng])
            );
            map.fitBounds(bounds, { padding: [60, 60] });
        }
    };

    return (
        <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onCenter={handleCenter}
            theme={theme}
        />
    );
};

const EnhancedPopup = ({ experience, theme }: { experience: Experience; theme: 'light' | 'dark' }) => {
    const { Icon: IconComponent } = getExperienceTypeDetails(experience.type ?? '');
    const navigate = useNavigate();
    const location = useLocation();

    // No mostrar el popup si estamos en la página de experiencias
    if (location.pathname.includes('/experiencias')) {
        return null;
    }
    return (
        <div className={`max-w-xs rounded-2xl overflow-hidden shadow-xl border ${theme === 'dark'
            ? 'bg-gray-800 border-gray-600'
            : 'bg-white border-gray-100'
            }`}>
            {/* Header con imagen de fondo */}
            <div className="relative h-32 p-4">
                <Picture
                    src={getImageUrl(experience.image)}
                    alt={experience.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 flex items-start justify-between">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-white font-bold text-lg leading-tight">{experience.name}</h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Ubicación */}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {experience.location}
                    </span>
                </div>

                {/* Botón de acción */}
                <Button
                    variant="success"
                    className="w-full"
                    onClick={() => {
                        navigate(`/experiencias/${experience.experienceId}`);
                    }}
                >
                    Ver detalles
                </Button>
            </div>
        </div >
    );
};

const ReusableMap: React.FC<ReusableMapProps> = ({
    locations,
    initialCenter = { lat: 4.676, lng: -75.655 },
    initialZoom = 13,
    className = '',
    style = {},
    selectedLocation,
    showControls = true,
    theme = 'light'
}) => {
    const [activeExperience, setActiveExperience] = useState<Experience | null>(null);
    const [hoveredExperience, setHoveredExperience] = useState<Experience | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isMapInteractive, setIsMapInteractive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const isExperiencesRoute = location.pathname.includes('/experiencias');

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            className={`relative rounded-2xl overflow-hidden shadow-2xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                } ${className}`}
            style={{
                height: isMobile ? '250px' : style?.height || '500px',
                width: '100%'
            }}
        >
            {/* Overlay de carga */}
            {!isMapInteractive && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-[1001]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                        <p className="text-gray-600 text-sm">Cargando mapa...</p>
                    </div>
                </div>
            )}

            <MapContainer
                center={initialCenter}
                zoom={initialZoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                whenReady={() => {
                    setIsMapInteractive(true);
                }}
                className={`${theme === 'dark' ? 'dark-map' : ''}`}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <ZoomWithShift />
                <MapViewAdjuster locations={locations} selectedLocation={selectedLocation} />
                {showControls && <MapControlsInternal locations={locations} theme={theme} />}

                {locations.map(location => (
                    <Marker
                        key={location.id}
                        position={[location.position.lat, location.position.lng]}
                        icon={createCustomIcon(location.type, hoveredExperience?.experienceId === location.id, isExperiencesRoute)}
                        eventHandlers={isExperiencesRoute ? {
                            click: () => setActiveExperience(location as unknown as Experience)
                        } : {
                            click: () => setActiveExperience(location as unknown as Experience),
                            mouseover: () => {
                                setHoveredExperience(location as unknown as Experience);
                                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                            },
                            mouseout: () => {
                                timeoutRef.current = setTimeout(() => {
                                    setHoveredExperience(null);
                                }, 300);
                            }
                        }}
                    >
                        <Popup
                            closeButton={true}
                            autoClose={false}
                            className={`custom-popup ${theme === 'dark' ? 'dark' : ''}`}
                        >
                            {activeExperience && (
                                <EnhancedPopup experience={activeExperience} theme={theme} />
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>



            {/* Contador de ubicaciones */}
            <div className={`absolute bottom-4 left-4 z-[1000] px-3 py-2 rounded-full shadow-lg ${theme === 'dark'
                ? 'bg-gray-800/90 text-white border border-gray-600'
                : 'bg-white/90 text-gray-700 border border-gray-200'
                } backdrop-blur-sm`}>
                <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">
                        {locations.length} {locations.length === 1 ? 'experiencia' : 'experiencias'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ReusableMap;