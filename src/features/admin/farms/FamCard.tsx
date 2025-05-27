// components/admin/farms/FarmCard.tsx
import React from 'react';
import { Farm } from '@/features/admin/farms/FarmTypes';

interface FarmCardProps {
    item: Farm;
    onEdit: (farm: Farm) => void;
    onDelete: (id: number) => void;
    onView: (farm: Farm) => void;
}

const FarmCard: React.FC<FarmCardProps> = ({ item, onEdit, onDelete, onView }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Activa';
            case 'inactive':
                return 'Inactiva';
            case 'draft':
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
                <div className="flex space-x-2">
                    <button
                        onClick={() => onView(item)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Ver detalles"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                        title="Editar"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Emprendedor:</span>
                    <span className="ml-1">{item.entrepreneur}</span>
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
                        {item.cropType}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FarmCard;
