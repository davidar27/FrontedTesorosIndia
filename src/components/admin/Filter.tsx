import { useState } from "react";
import { BaseEntity, StatusFilter } from "./GenericManagent";


export const DefaultCustomFilters = <T extends BaseEntity>({
    items,
    onFilterChange
}: {
    items: T[];
    onFilterChange: (filteredItems: T[]) => void;
}) => {
    const [selectedStatus, setSelectedStatus] = useState('all');

    const statusFilters: StatusFilter[] = [
        { id: 'all', label: 'Todas', count: items.length },
        { id: 'active', label: 'Activas', count: items.filter(item => item.status === 'active').length },
        { id: 'inactive', label: 'Inactivas', count: items.filter(item => item.status === 'inactive').length },
        { id: 'draft', label: 'Borrador', count: items.filter(item => item.status === 'draft').length }
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
                {statusFilters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => handleStatusChange(filter.id)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${selectedStatus === filter.id
                            ? 'bg-gradient-to-r from-primary to-[#81c9c1] text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-primary'
                            }`}
                    >
                        <span>{filter.label}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${selectedStatus === filter.id
                            ? 'bg-white/20'
                            : 'bg-white text-gray-500'
                            }`}>
                            {filter.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};