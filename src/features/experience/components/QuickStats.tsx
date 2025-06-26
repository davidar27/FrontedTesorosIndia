import React from 'react';
import { Users, ShoppingCart, Award } from 'lucide-react';

interface QuickStatsProps {
    membersCount: number;
    productsCount: number;
    averageRating: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({
    membersCount,
    productsCount,
    averageRating
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 -mt-16 relative z-10">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {membersCount || 'No hay integrantes disponibles'}
                        </p>
                        <p className="text-gray-600 text-sm">Integrantes</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {productsCount || 'No hay productos disponibles'}
                        </p>
                        <p className="text-gray-600 text-sm">Productos</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {averageRating.toFixed(1) || 'No hay calificaciones disponibles'}
                        </p>
                        <p className="text-gray-600 text-sm">Calificación</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickStats;