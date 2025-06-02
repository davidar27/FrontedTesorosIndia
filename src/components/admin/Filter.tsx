import { useState } from "react";
import { BaseEntity } from "@/features/admin/types";

export interface StatusFilter {
    id: string;
    label: string;
    count: number;
    bgColor: string;
    hoverBg: string;
    selectedBg: string;
    textColor: string;
    borderColor: string;
    hoverTextColor: string;
}

export const DefaultCustomFilters = <T extends BaseEntity>({
    items,
    onFilterChange
}: {
    items: T[];
    onFilterChange: (filteredItems: T[]) => void;
}) => {
    const [selectedStatus, setSelectedStatus] = useState('all');

    const statusFilters: StatusFilter[] = [
        { 
            id: 'all', 
            label: 'Todos', 
            count: items.length,
            bgColor: 'bg-white',
            hoverBg: 'hover:bg-white',
            selectedBg: 'bg-secondary',
            textColor: 'text-secondary',
            borderColor: 'border-secondary',
            hoverTextColor: 'hover:text-secondary'
        },
        { 
            id: 'active', 
            label: 'Activos', 
            count: items.filter(item => item.status === 'active').length,
            bgColor: 'bg-white',
            hoverBg: 'hover:bg-white',
            selectedBg: 'bg-primary',
            textColor: 'text-primary',
            borderColor: 'border-primary',
            hoverTextColor: 'hover:text-primary'
        },
        { 
            id: 'inactive', 
            label: 'Inactivos', 
            count: items.filter(item => item.status === 'inactive').length,
            bgColor: 'bg-white',
            hoverBg: 'hover:bg-white',
            selectedBg: 'bg-red-600',
            textColor: 'text-red-600',
            borderColor: 'border-red-600',
            hoverTextColor: 'hover:text-red-600'
        },
        { 
            id: 'pending', 
            label: 'Pendientes', 
            count: items.filter(item => item.status === 'pending').length,
            bgColor: 'bg-white',
            hoverBg: 'hover:bg-white',
            selectedBg: 'bg-yellow-500',
            textColor: 'text-yellow-500',
            borderColor: 'border-yellow-500',
            hoverTextColor: 'hover:text-yellow-500'
        }
    ];

    const handleStatusChange = (statusId: string) => {
        setSelectedStatus(statusId);
        const filtered = statusId === 'all'
            ? items
            : items.filter(item => item.status === statusId);
        onFilterChange(filtered);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 animate-fade-in-up delay-100">
            <h3 className="font-semibold text-gray-800 mb-4">Filtrar por estado</h3>
            <div className="flex flex-wrap gap-3">
                {statusFilters.map((filter) => {
                    const isSelected = selectedStatus === filter.id;
                    return (
                        <button
                            key={filter.id}
                            onClick={() => handleStatusChange(filter.id)}
                            className={`
                                px-4 py-2 rounded-xl font-medium transition-all duration-300 
                                flex items-center gap-2 border-2 cursor-pointer
                                ${isSelected 
                                    ? `${filter.selectedBg} text-white ${filter.borderColor} shadow-lg` 
                                    : `${filter.bgColor} ${filter.textColor} ${filter.borderColor} hover:bg-white hover:${filter.textColor}`
                                }
                                transform hover:scale-105 active:scale-95
                            `}
                        >
                            <span>{filter.label}</span>
                            <span className={`
                                text-xs px-2 py-1 rounded-full
                                ${isSelected ? 'bg-white/20' : 'bg-gray-100'}
                            `}>
                                {filter.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};