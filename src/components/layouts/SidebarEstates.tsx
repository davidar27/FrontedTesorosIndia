import React, { useState } from 'react';
import { TreePalm, Leaf, Mountain, Trees, Sprout, X } from 'lucide-react';

interface Estate {
    id: number;
    name: string;
    icon: React.ReactNode;
    featured?: boolean;
}

interface SidebarEstatesProps {
    isOpen: boolean;
    onClose: () => void;
}

const SidebarEstates: React.FC<SidebarEstatesProps> = ({ isOpen, onClose }) => {
    const [activeEstateId, setActiveEstateId] = useState<number | null>(null);

    const navigateToEstate = (id: number) => {
        setActiveEstateId(id);
        console.log(`Navegando a la finca con ID: ${id}`);
        onClose();
    };

    const estates: Estate[] = [
        {
            id: 1,
            name: 'Finca Paraíso Verde',
            icon: <TreePalm size={20} />,
            featured: true
        },
        {
            id: 2,
            name: 'Finca Los Alpes',
            icon: <Mountain size={20} />
        },
        {
            id: 3,
            name: 'Finca Bosque Nativo',
            icon: <Trees size={20} />
        },
        {
            id: 4,
            name: 'Finca Valle Fresco',
            icon: <Leaf size={20} />
        },
        {
            id: 5,
            name: 'Finca Nuevos Brotes',
            icon: <Sprout size={20} />
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed top-22 right-1 z-50 flex">
            {/* Barra lateral */}
            <div className="relative w-64 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg animate-slide-in-right">
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
                    <ul>
                        {estates.map((estate) => (
                            <li key={estate.id}>
                                <button
                                    onClick={() => navigateToEstate(estate.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${activeEstateId === estate.id
                                            ? 'bg-green-50'
                                            : 'hover:bg-gray-100'
                                        } ${estate.featured ? 'text-green-600 font-medium' : 'text-gray-700'
                                        }`}
                                >
                                    <span className={estate.featured ? 'text-green-500' : 'text-gray-500'}>
                                        {estate.icon}
                                    </span>
                                    <span className="truncate">{estate.name}</span>
                                    {estate.featured && (
                                        <span className="ml-auto">
                                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
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


export default SidebarEstates;