import React, { useState, useMemo, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import Button from '../ui/buttons/Button';
import { DefaultCustomFilters } from './Filter';

// Tipos (mantener los mismos que ya tienes)
export interface BaseEntity {
    id: number;
    name: string;
    status: 'active' | 'inactive' | 'draft';
    [key: string]: string | number | boolean;
}

export interface EntityConfig<T extends BaseEntity> {
    // Solo la configuración específica de la entidad, sin sidebar
    entityName: string;
    entityNamePlural: string;
    searchPlaceholder: string;
    emptyStateEmoji: string;
    emptyStateTitle: string;
    emptyStateDescription: string;
    description: string;

    // Datos
    items: T[];

    // Componentes
    ItemCard: React.ComponentType<{
        item: T;
        onEdit: (item: T) => void;
        onDelete: (id: number) => void;
        onView: (item: T) => void;
    }>;

    // Callbacks
    onEdit: (item: T) => void;
    onDelete: (id: number) => void;
    onView: (item: T) => void;
    onCreate: () => void;

    // Filtros personalizados (opcional)
    customFilters?: React.ComponentType<{
        items: T[];
        onFilterChange: (filteredItems: T[]) => void;
    }>;

    // Función de búsqueda personalizada (opcional)
    searchFunction?: (item: T, searchTerm: string) => boolean;
}

interface SimplifiedManagementProps<T extends BaseEntity> {
    config: EntityConfig<T>;
}

// Función de búsqueda por defecto
const defaultSearchFunction = <T extends BaseEntity>(item: T, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase().trim();
    const searchableFields = [
        item.name,
        item.status,
        ...(item.description ? [item.description] : []),
        ...(item.email ? [item.email] : []),
        ...(item.phone ? [item.phone] : [])
    ];

    return searchableFields.some(field =>
        field && field.toString().toLowerCase().includes(term)
    );
};

export default function SimplifiedManagement<T extends BaseEntity>({
    config
}: SimplifiedManagementProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredByCustomFilters, setFilteredByCustomFilters] = useState<T[]>(config.items);

    const searchFunction = config.searchFunction || defaultSearchFunction;

    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return filteredByCustomFilters;

        return filteredByCustomFilters.filter(item =>
            searchFunction(item, searchTerm)
        );
    }, [searchTerm, filteredByCustomFilters, searchFunction]);

    const CustomFilters = config.customFilters || DefaultCustomFilters;

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    React.useEffect(() => {
        setFilteredByCustomFilters(config.items);
    }, [config.items]);


    return (
        <>
            {/* Barra de búsqueda y acciones */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder={config.searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white"
                        aria-label={`Buscar ${config.entityNamePlural.toLowerCase()}`}
                    />
                </div>

                {/* Add button */}
                <Button
                    onClick={config.onCreate}
                    type='button'
                    className='flex items-center gap-2 rounded-lg'
                    aria-label={`Crear nuevo ${config.entityName.toLowerCase()}`}
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">{`Nuevo ${config.entityName}`}</span>
                    <span className="sm:hidden">Nuevo</span>
                </Button>
            </div>

            {/* Custom Filters */}
            <CustomFilters
                items={config.items}
                onFilterChange={setFilteredByCustomFilters}
            />

            {/* Results */}
            <div className="mb-6">
                <p className="text-gray-600">
                    {filteredItems.length === config.items.length ? (
                        `${config.items.length} ${config.entityNamePlural.toLowerCase()}`
                    ) : (
                        `${filteredItems.length} de ${config.items.length} ${config.entityNamePlural.toLowerCase()}`
                    )}
                    {searchTerm && ` • Filtrado por "${searchTerm}"`}
                </p>
            </div>

            {/* Items grid */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4" role="img" aria-label={config.emptyStateEmoji}>
                        {config.emptyStateEmoji}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {config.emptyStateTitle}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-4">
                        {config.emptyStateDescription}
                    </p>
                    {searchTerm && (
                        <Button
                            onClick={() => setSearchTerm('')}
                            type='button'
                        >
                            Limpiar búsqueda
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredItems.map((item, index) => (
                        <div
                            key={`${item.id}-${item.name}`}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
                        >
                            <config.ItemCard
                                item={item}
                                onEdit={config.onEdit}
                                onDelete={config.onDelete}
                                onView={config.onView}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}