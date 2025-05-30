import { useState, useEffect } from 'react';
import { Entrepreneur } from './EntrepreneursTypes';
import Button from '@/components/ui/buttons/Button';

interface EntrepreneursFilterProps {
    items: Entrepreneur[];
    onFilterChange: (filteredItems: Entrepreneur[]) => void;
}

interface StatusFilterOption {
    id: 'all' | 'active' | 'inactive' | 'pending';
    label: string;
    bgColor: string;
    textColor: string;
    hoverBg: string;
    selectedBg: string;
    selectedText: string;
}

export function EntrepreneursFilter({ items, onFilterChange }: EntrepreneursFilterProps) {
    const [selectedStatus, setSelectedStatus] = useState<StatusFilterOption['id']>('all');

    const statusFilters: StatusFilterOption[] = [
        {
            id: 'all',
            label: 'Todos',
            bgColor: 'bg-secondary',
            textColor: 'text-gray-600',
            hoverBg: 'hover:bg-gray-200',
            selectedBg: 'bg-gradient-to-r from-gray-700 to-gray-800',
            selectedText: 'text-white'
        },
        {
            id: 'active',
            label: 'Activos',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            hoverBg: 'hover:bg-green-100',
            selectedBg: 'bg-gradient-to-r from-green-600 to-green-700',
            selectedText: 'text-white'
        },
        {
            id: 'inactive',
            label: 'Inactivos',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
            hoverBg: 'hover:bg-red-100',
            selectedBg: 'bg-gradient-to-r from-red-600 to-red-700',
            selectedText: 'text-white'
        },
        {
            id: 'pending',
            label: 'Pendientes',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600',
            hoverBg: 'hover:bg-yellow-100',
            selectedBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
            selectedText: 'text-white'
        }
    ];

    useEffect(() => {
        if (selectedStatus === 'all') {
            onFilterChange(items);
            return;
        }
        
        const filtered = items.filter(item => item.status === selectedStatus);
        onFilterChange(filtered);
    }, [selectedStatus, items, onFilterChange]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 animate-fade-in-up delay-100">
            <h3 className="font-semibold text-gray-800 mb-4">Filtrar por estado</h3>
            <div className="flex flex-wrap gap-3">
                {statusFilters.map((filter) => {
                    const count = filter.id === 'all' 
                        ? items.length 
                        : items.filter(item => item.status === filter.id).length;
                    
                    const isSelected = selectedStatus === filter.id;
                    const baseClasses = "px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2";
                    const dynamicClasses = isSelected
                        ? `${filter.selectedBg} ${filter.selectedText} shadow-lg`
                        : `${filter.bgColor} ${filter.textColor} ${filter.hoverBg}`;

                    return (
                        <Button
                            key={filter.id}
                            onClick={() => setSelectedStatus(filter.id)}
                            className={`${baseClasses} ${dynamicClasses}`}
                            bgColor={filter.bgColor}
                            textColor={filter.textColor}
                            hoverBg={filter.hoverBg}
                        >
                            <span>{filter.label}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                isSelected ? 'bg-white/20' : 'bg-white'
                            }`}>
                                {count}
                            </span>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
} 