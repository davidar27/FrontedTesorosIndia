// pages/FarmsManagement.tsx
import { useState, useMemo } from 'react';
import GenericManagement from '@/components/admin/GenericManagent';
import FarmCard from '@/features/admin/farms/FamCard';
import { createFarmsConfig } from '@/features/admin/farms/createFarmsConfig';
import { Farm } from '@/features/admin/farms/FarmTypes';

// Datos de ejemplo más completos
const initialFarms: Farm[] = [
    {
        id: 1,
        name: "Puerto Arturo",
        entrepreneur: "Arturo Ocampo",
        location: "La finca Rillera del Guarriak se halla ubicada en la vereda San José, municipio de Planadas, Tolima",
        Type: "Café Arábigo",
        status: "active",
        establishedDate: "2018-03-15"
    },
    {
        id: 2,
        name: "El Mirador",
        entrepreneur: "María González",
        location: "Vereda El Mirador, Ibagué, Tolima",
        Type: "Cacao",
        status: "active",
        establishedDate: "2020-01-10"
    },
    {
        id: 3,
        name: "La Esperanza",
        entrepreneur: "Carlos Ruiz",
        location: "Corregimiento La Esperanza, Chaparral, Tolima",
        Type: "Café Robusta",
        status: "draft",
        establishedDate: "2017-06-22"
    }
];


export default function FarmsManagement() {
    const [farms, setFarms] = useState<Farm[]>(initialFarms);
    const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

    const handleEdit = (farm: Farm) => {
        console.log('Editing farm:', farm);
        // Aquí implementarías la lógica para abrir un modal de edición
        // o navegar a una página de edición
    };

    const handleDelete = (farmId: number) => {
        setShowDeleteModal(farmId);
    };

    const confirmDelete = () => {
        if (showDeleteModal) {
            setFarms(prev => prev.filter(farm => farm.id !== showDeleteModal));
            setShowDeleteModal(null);
            console.log('Farm deleted:', showDeleteModal);
        }
    };

    const handleCreate = () => {
        console.log('Creating new farm');
        // Aquí implementarías la lógica para crear una nueva finca
    };

    const config = useMemo(() => createFarmsConfig(
        farms,
        FarmCard,
        {
            onEdit: handleEdit,
            onDelete: handleDelete,
            onCreate: handleCreate
        }
    ), [farms]);

   

    return (
        <>
            <GenericManagement config={config} />

            {/* Modal de confirmación de eliminación */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Confirmar eliminación
                        </h3>
                        <p className="text-gray-600 mb-4">
                            ¿Estás seguro de que deseas eliminar esta finca? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex space-x-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}