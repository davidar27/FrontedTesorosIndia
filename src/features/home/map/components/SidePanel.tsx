import React from 'react';
import { MapPin } from 'lucide-react';
import { Experience, SidePanelProps } from '@/features/home/map/types/TouristRouteTypes';
import { LocationCard } from './LocationCard';
import { useMapContext } from '@/features/home/map/context/MapContext';

export const SidePanel: React.FC<SidePanelProps> = ({ locations, onLocationClick }) => {
    const { centerOnLocation } = useMapContext();

    const handleLocationClick = (location: Experience) => {
        centerOnLocation(location);
        onLocationClick?.(location);
    };

    return (
        <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-18 border border-gray-100">
                <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-bold text-green-800">Puntos de Interés</h2>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {locations.map((location, index) => (
                        <LocationCard
                            key={location.experienceId || index}
                            location={location}
                            index={index}
                            onClick={() => handleLocationClick(location)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
