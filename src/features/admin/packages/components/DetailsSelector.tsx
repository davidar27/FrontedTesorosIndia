import React from 'react';
import { Star } from 'lucide-react';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';

interface Detail {
    detail_id: number;
    description: string;
}

interface DetailsSelectorProps {
    details: Detail[] | null;
    selectedDetails: number[];
    onToggle: (detailId: number) => void;
    loading?: boolean;
    error?: string;
}

export const DetailsSelector: React.FC<DetailsSelectorProps> = ({
    details,
    selectedDetails,
    onToggle,
    loading = false,
    error
}) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="mr-2 h-5 w-5 text-green-600" />
                Detalles *
            </h3>

            <div className="space-y-3">
                <div className="space-y-2">
                    {loading ? (
                        <LoadingSpinner message='Cargando detalles...' />
                    ) : (
                        details?.map((detail) => (
                            <label key={detail.detail_id} className="flex items-center space-x-3 cursor-pointer w-fit transition-all duration-300">
                                <input
                                    type="checkbox"
                                    checked={selectedDetails.includes(detail.detail_id)}
                                    onChange={() => onToggle(detail.detail_id)}
                                    className="w-4 h-4 border-2 border-primary/50 rounded-full appearance-none checked:bg-primary checked:border-primary cursor-pointer mr-2"
                                    aria-label={`Seleccionar detalle ${detail.description}`}
                                />
                                <span className="text-gray-700">{detail.description}</span>
                            </label>
                        ))
                    )}
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
};