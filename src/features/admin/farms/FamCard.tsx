// components/admin/farms/FarmCard.tsx
import React from 'react';
import { Farm } from '@/features/admin/farms/FarmTypes';
import { Edit } from 'lucide-react';
import { Trash2 } from 'lucide-react';

interface FarmCardProps {
    item: Farm;
    onEdit: (farm: Farm) => void;
    onDelete: (id: number) => void;
}

const FarmCard: React.FC<FarmCardProps> = ({ item, onEdit, onDelete }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Publicada':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Inactiva':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Borrador':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Public':
                return 'Publicada';
            case 'Inactive':
                return 'Inactiva';
            case 'Draft':
                return 'Borrador';
            default:
                return status;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Emprendedor:</span>
                    <span className="ml-1">{item.emprendedor_id}</span>
                </div>

                <div className="flex items-start text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                        <span className="font-medium">Ubicación:</span>
                        <p className="ml-1 text-gray-500 mt-1 leading-relaxed">
                            {item.location.length > 80
                                ? `${item.location.substring(0, 80)}...`
                                : item.location
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="font-medium">Cultivo:</span>
                    <span className="ml-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                        {item.type?.toString()}
                    </span>
                </div>
            </div>
            {/* Actions */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => onEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200"
                >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Editar</span>
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default FarmCard;
