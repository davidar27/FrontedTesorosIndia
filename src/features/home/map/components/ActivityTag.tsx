import React from 'react';
import { ActivityTagProps } from '../types/TouristRouteTypes';

export const ActivityTag: React.FC<ActivityTagProps> = ({ activity }) => (
    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
        {activity}
    </span>
);
