
import React from 'react';
import { MapPin } from 'lucide-react';
import { ExperienceCardProps } from '@/features/home/map/types/TouristRouteTypes';
import { getExperienceTypeDetails } from '@/features/admin/experiences/experienceUtils';

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ location }) => {
    const { Icon: IconComponent, color } = getExperienceTypeDetails(location.type ?? '');
    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 hover:shadow-md transition-shadow w-max">
            <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${color}`}>
                    <IconComponent className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-green-700">{location.name}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">{location.description}</p>
            {location.location && (
                <p className="text-xs text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location.location}
                </p>
            )}
        </div>
    );
};