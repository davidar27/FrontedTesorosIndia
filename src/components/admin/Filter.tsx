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
    textColorSelected: string;
    borderColor: string;
    hoverTextColor: string;
    showFor?: ('entrepreneur' | 'experience' | 'category')[];
}

export const DefaultCustomFilters = <T extends BaseEntity<string>>({
    items,
    onFilterChange,
    type
}: {
    items: T[];
    onFilterChange: (filteredItems: T[]) => void;
    type: 'entrepreneur' | 'experience' | 'category';
}) => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    
    const statusFilters: StatusFilter[] = [
        { 
            id: 'all', 
            label: 'Todos', 
            count: items.length,
            bgColor: 'bg-transparent',
            hoverBg: 'hover:bg-white',
            selectedBg: 'bg-secondary',
            textColor: 'text-secondary',
            textColorSelected: 'text-white',
            borderColor: 'border-secondary',
            hoverTextColor: 'hover:text-secondary',
            showFor: ['entrepreneur', 'experience', 'category']
        },
        { 
            id: 'active', 
            label: 'Activos', 
            count: items.filter(item => item.status === 'active').length,
            bgColor: 'bg-transparent',
            hoverBg: 'hover:bg-white',
            selectedBg: 'bg-primary',
            textColor: 'text-primary',
            textColorSelected: 'text-white',
            borderColor: 'border-primary',
            hoverTextColor: 'hover:text-primary',
            showFor: ['entrepreneur', 'category']
        },
        {
            id: 'published',
            label: 'Publicados',
            count: items.filter(item => item.status === 'published').length,
            bgColor: 'bg-transparent',
            hoverBg: 'hover:bg-white',
            selectedBg: 'bg-green-600',
            textColor: 'text-green-600',
            textColorSelected: 'text-white',
            borderColor: 'border-green-600',
            hoverTextColor: 'hover:text-green-600',
            showFor: ['experience']
        },
        {
            id: 'draft',
            label: 'Borradores',
            count: items.filter(item => item.status === 'draft').length,
            bgColor: 'bg-transparent',
            hoverBg: 'hover:bg-white',
            selectedBg: 'bg-yellow-500',
            textColor: 'text-yellow-500',
            textColorSelected: 'text-white',
            borderColor: 'border-yellow-500',
            hoverTextColor: 'hover:text-yellow-500',
            showFor: ['experience']
        },
        { 
            id: 'inactive', 
            label: 'Inactivos', 
            count: items.filter(item => item.status === 'inactive').length,
            bgColor: 'bg-transparent',
            hoverBg: 'hover:bg-white',
            selectedBg: 'bg-red-600',
            textColor: 'text-red-600',
            textColorSelected: 'text-white',
            borderColor: 'border-red-600',
            hoverTextColor: 'hover:text-red-600',
            showFor: ['entrepreneur', 'category']
        }
    ];

    const handleStatusChange = (statusId: string) => {
        setSelectedStatus(statusId);
        const filtered = statusId === 'all'
            ? items
            : items.filter(item => item.status === statusId);
        onFilterChange(filtered);
    };

    const visibleFilters = statusFilters.filter(filter => 
        !filter.showFor || filter.showFor.includes(type)
    );

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 animate-fade-in-up delay-100">
            <h3 className="font-semibold text-gray-800 mb-4">Filtrar por estado</h3>
            <div className="flex flex-wrap gap-3">
                {visibleFilters.map((filter) => {
                    const isSelected = selectedStatus === filter.id;
                    return (
                        <button
                            key={filter.id}
                            onClick={() => handleStatusChange(filter.id)}
                            className={`
                                px-4 py-2 rounded-xl font-medium transition-all duration-300 
                                flex items-center gap-2 border-2 cursor-pointer
                                ${isSelected 
                                    ? `${filter.selectedBg} ${filter.textColorSelected} ${filter.borderColor} shadow-lg` 
                                    : `${filter.bgColor} ${filter.textColor} ${filter.borderColor} ${filter.hoverBg} ${filter.hoverTextColor}`
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