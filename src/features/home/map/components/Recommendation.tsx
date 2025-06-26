import React from 'react';
import { CheckCircle } from 'lucide-react';
import { RecommendationProps } from '@/features/home/map/types/TouristRouteTypes';

export const Recommendation: React.FC<RecommendationProps> = ({ text }) => (
    <li className="flex items-start space-x-2">
        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
        <span className="text-gray-700">{text}</span>
    </li>
);