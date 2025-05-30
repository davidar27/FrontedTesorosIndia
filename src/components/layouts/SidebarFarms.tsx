import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery';
import { farmsApi } from '@/services/admin/farms';
import { Farm } from '@/features/admin/farms/FarmTypes';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';

interface SidebarFarmsProps {
    isOpen: boolean;
    onClose: () => void;
}

const SidebarFarms: React.FC<SidebarFarmsProps> = ({ isOpen, onClose }) => {
    const [activeEstateId, setActiveEstateId] = useState<number | null>(null);
    const {
        data: farms = [],
        isLoading,
        error
    } = useAuthenticatedQuery<Farm[]>({
        queryKey: ['farms'],
        queryFn: () => farmsApi.getAllNames(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
    });

    const navigateToEstate = (id: number) => {
        setActiveEstateId(id);
        console.log(`Navegando a la finca con ID: ${id}`);
        onClose();
    };

    if (!isOpen) return null;

    if ( isLoading) {
        return (
            <div className="fixed top-22 right-1 z-50 flex">
                <div className="relative w-64 h-96 bg-white border-r border-gray-200 flex flex-col shadow-lg animate-slide-in-right">
                    <div className="flex justify-center items-center h-full">
                        <LoadingSpinner message="Cargando fincas..." />
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="fixed top-22 right-1 z-50 flex">
            <div className="relative w-64 h-96 bg-white border-r border-gray-200 flex flex-col shadow-lg animate-slide-in-right">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Nuestras Fincas</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Cerrar barra lateral"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-grow overflow-y-auto">
                    {error ? (
                        <div className="p-4 text-center text-red-600">
                            Error al cargar las fincas
                        </div>
                    ) : farms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                            <p className="text-lg font-medium">No hay fincas disponibles</p>
                            <p className="text-sm mt-2">Aún no se han registrado fincas en el sistema</p>
                        </div>
                    ) : (
                        <ul>
                            {farms.map((farm) => (
                                <li key={farm.id}>
                                    <button
                                        onClick={() => navigateToEstate(farm.id)}
                                        className={`w-full px-4 py-3 text-left transition-colors ${
                                            activeEstateId === farm.id
                                                ? 'bg-green-50 text-green-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="truncate block">{farm.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </nav>

                <div className="p-4 mt-auto border-t border-gray-200">
                    <button
                        className="w-full py-2 bg-green-50 text-green-600 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
                        onClick={() => {
                            console.log('Ver todas las fincas');
                            onClose();
                        }}
                    >
                        Ver todas las fincas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarFarms;