import React, { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { LocationCardProps } from '@/features/home/map/types/TouristRouteTypes';
import { getExperienceTypeDetails } from '@/features/admin/experiences/experienceUtils';

export const LocationCard: React.FC<LocationCardProps> = ({ location, index, onClick }) => {
    const [isActive] = useState(false);
    const { Icon: IconComponent, color } = useMemo(() => {
        return getExperienceTypeDetails(location.type ?? '');
    }, [location.type]);

    return (
        <div
            key={index}
            className="p-4 rounded-lg hover:bg-green-50 transition-colors cursor-pointer border border-gray-100 hover:border-green-200 hover:shadow-sm"
            onClick={onClick}
        >
            <div className="flex items-start space-x-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-lg transition-all duration-300 flex-shrink-0 bg-gradient-to-br ${color} shadow-lg`}>
                    <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white'}`} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-green-700 mb-1">{location.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{location.description}</p>
                    {location.location && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {location.location}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};