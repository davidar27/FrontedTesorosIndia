import React from 'react';
import ReusableMap from '@/components/shared/ReusableMap';
import { MapSectionProps } from '@/features/home/map/types/TouristRouteTypes';
import { MAP_CENTER } from '@/features/home/map/constans/TouristRouteConstants';
import { useMapContext } from '@/features/home/map/context/MapContext';

export const MapSection: React.FC<MapSectionProps> = ({ locations }) => {
    const { selectedLocation } = useMapContext();
    
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <ReusableMap
                locations={locations.map(loc => ({
                    ...loc,
                    type: loc.type ?? '',
                    id: loc.experienceId
                }))}
                initialCenter={MAP_CENTER}
                selectedLocation={selectedLocation}
            />
        </div>
    );
};