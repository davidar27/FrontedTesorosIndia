import React from 'react';
import { TreePalm, CheckCircle } from 'lucide-react';
import { RouteDescriptionProps } from '@/features/home/map/types/TouristRouteTypes';
import { RECOMMENDATIONS } from '@/features/home/map/constans/TouristRouteConstants';
import { Recommendation } from '@/features/home/map/components/Recommendation';

export const RouteDescription: React.FC<RouteDescriptionProps> = () => (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
            <TreePalm className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-green-800">Descubre la Ruta</h2>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">
            Esta ruta turística es perfecta para los amantes de la naturaleza, el café y la tranquilidad del campo.
            Disfruta de paisajes espectaculares, cultivos de café tradicional y la calidez de la gente local.
        </p>


        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Recomendaciones
            </h3>
            <ul className="space-y-3">
                {RECOMMENDATIONS.map((recommendation, index) => (
                    <Recommendation key={index} text={recommendation} />
                ))}
            </ul>
        </div>
    </div>
);