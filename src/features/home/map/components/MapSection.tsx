import React from 'react';
import ReusableMap from '@/components/shared/ReusableMap';
import { MapSectionProps } from '@/features/home/map/types/TouristRouteTypes';
import { MAP_CENTER } from '@/features/home/map/constans/TouristRouteConstants';

export const MapSection: React.FC<MapSectionProps> = ({ locations }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <ReusableMap
            locations={locations.map(loc => ({
                ...loc,
                type: loc.type ?? ''
            }))}
            initialCenter={MAP_CENTER}
        />
    </div>
);