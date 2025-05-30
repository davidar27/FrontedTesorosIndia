import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import { DefaultCustomFilters } from '@/components/admin/Filter';
import { JSX } from 'react';

// Tipos
export interface BaseEntity<TStatus extends string = 'active' | 'inactive' | 'draft'> {
    id?: number;
    name: string;
    status: TStatus;
    [key: string]: string | number | boolean | Date | null | undefined;
}

export interface EntityConfig<T extends BaseEntity> {
    // Configuración específica de la entidad
    entityName: string;
    entityNamePlural: string;
    searchPlaceholder: string;
    emptyStateEmoji: string;
    emptyStateTitle: string;
    emptyStateDescription: string;
    description: string;

    // Datos
    items: T[];
    isLoading?: boolean;
    error?: string | null;

    // Componentes
    ItemCard: React.ComponentType<{
        item: T;
        onEdit: (item: T) => void;
        onDelete: (id: number) => void;
    }>;

    // Callbacks
    onEdit: (item: T) => void;
    onDelete: (id: number) => void;
    onCreate: () => void;
    onRetry?: () => void;

    // Filtros personalizados (opcional)
    customFilters?: React.ComponentType<{
        items: T[];
        onFilterChange: (filteredItems: T[]) => void;
    }>;

    // Función de búsqueda personalizada (opcional)
    searchFunction?: (item: T, searchTerm: string) => boolean;

    // Configuración adicional
    showResultsCount?: boolean;
    maxResults?: number;
    enableAnimations?: boolean;
}

interface SimplifiedManagementProps<T extends BaseEntity> {
    config: EntityConfig<T>;
}

// Función de búsqueda por defecto mejorada
const defaultSearchFunction = <T extends BaseEntity>(item: T, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase().trim();

    // Función helper para obtener valor como string seguro
    const getStringValue = (value: unknown): string => {
        if (value === null || value === undefined) return '';
        if (value instanceof Date) return value.toLocaleDateString();
        return String(value);
    };

    // Campos predeterminados + campos dinámicos del objeto
    const searchableFields = [
        getStringValue(item.name),
        getStringValue(item.status),
        // Campos opcionales comunes
        getStringValue(item.description),
        getStringValue(item.email),
        getStringValue(item.phone),
        getStringValue(item.category),
        getStringValue(item.type),
        // Buscar en todos los campos string del objeto
        ...Object.values(item)
            .filter(value => typeof value === 'string' && value.length < 200) // Evitar campos muy largos
            .map(value => getStringValue(value))
    ];

    return searchableFields.some(field =>
        field && field.toLowerCase().includes(term)
    );
};

// Componente de Loading
const LoadingState: React.FC<{ entityNamePlural: string }> = ({ entityNamePlural }) => (
    <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-500">Cargando {entityNamePlural.toLowerCase()}...</p>
    </div>
);

// Componente de Error
const ErrorState: React.FC<{
    error: string;
    onRetry?: () => void;
    entityNamePlural: string;
}> = ({ error, onRetry, entityNamePlural }) => (
    <div className="text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Error al cargar {entityNamePlural.toLowerCase()}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-4">{error}</p>
        {onRetry && (
            <Button onClick={onRetry} type="button">
                Reintentar
            </Button>
        )}
    </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GenericManagement<T extends BaseEntity<any>>({ 
    config 
}: SimplifiedManagementProps<T>): JSX.Element {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredByCustomFilters, setFilteredByCustomFilters] = useState<T[]>([]);

    const {
        showResultsCount = true,
        maxResults,
        enableAnimations = true,
        isLoading = false,
        error = null
    } = config;

    const searchFunction = config.searchFunction || defaultSearchFunction;

    // Filtrado por búsqueda
    const searchFilteredItems = useMemo(() => {
        if (!searchTerm.trim()) return filteredByCustomFilters;
        return filteredByCustomFilters.filter(item => searchFunction(item, searchTerm));
    }, [searchTerm, filteredByCustomFilters, searchFunction]);

    // Aplicar límite de resultados si está configurado
    const finalFilteredItems = useMemo(() => {
        // Asegurar que searchFilteredItems sea un array
        const safeSearchItems = Array.isArray(searchFilteredItems) ? searchFilteredItems : [];
        
        if (maxResults && safeSearchItems.length > maxResults) {
            return safeSearchItems.slice(0, maxResults);
        }
        return safeSearchItems;
    }, [searchFilteredItems, maxResults]);

    const CustomFilters = config.customFilters || DefaultCustomFilters;

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
    }, []);

    // Actualizar filtros cuando cambien los items
    useEffect(() => {
        setFilteredByCustomFilters(config.items);
    }, [config.items]);

    // Estados de carga y error
    if (isLoading) {
        return <LoadingState entityNamePlural={config.entityNamePlural} />;
    }

    if (error) {
        return (
            <ErrorState
                error={error}
                onRetry={config.onRetry}
                entityNamePlural={config.entityNamePlural}
            />
        );
    }

    const isShowingLimitedResults = maxResults && searchFilteredItems.length > maxResults;

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
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Limpiar búsqueda"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Add button */}
                <Button
                    onClick={config.onCreate}
                    type="button"
                    className="flex items-center gap-2 rounded-lg"
                    aria-label={`Crear nuevo ${config.entityName.toLowerCase()}`}
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">{`Crear ${config.entityName}`}</span>
                    <span className="sm:hidden">Crear</span>
                </Button>
            </div>

            {/* Custom Filters */}
            <CustomFilters
                items={config.items}
                onFilterChange={setFilteredByCustomFilters}
            />

            {/* Results */}
            {showResultsCount && (
                <div className="mb-6">
                    <p className="text-gray-600">
                        {finalFilteredItems.length === config.items.length ? (
                            `${config.items.length} ${config.entityNamePlural.toLowerCase()}`
                        ) : (
                            <>
                                {finalFilteredItems.length} de {config.items.length} {config.entityNamePlural.toLowerCase()}
                                {isShowingLimitedResults && (
                                    <span className="text-amber-600 ml-1">
                                        (mostrando primeros {maxResults})
                                    </span>
                                )}
                            </>
                        )}
                        {searchTerm && ` • Filtrado por "${searchTerm}"`}
                    </p>
                </div>
            )}

            {/* Items grid */}
            {finalFilteredItems.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4" role="img" aria-label={config.emptyStateEmoji}>
                        {config.emptyStateEmoji}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {searchTerm ? 'No se encontraron resultados' : config.emptyStateTitle}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-4">
                        {searchTerm
                            ? `No hay ${config.entityNamePlural.toLowerCase()} que coincidan con "${searchTerm}"`
                            : config.emptyStateDescription
                        }
                    </p>
                    {searchTerm && (
                        <Button onClick={clearSearch} type="button">
                            Limpiar búsqueda
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {finalFilteredItems.map((item, index) => (
                        <div
                            key={`${item.id}-${item.name}-${index}`}
                            className={enableAnimations ? "animate-fade-in-up" : ""}
                            style={enableAnimations ? {
                                animationDelay: `${Math.min(index * 0.05, 0.5)}s`
                            } : undefined}
                        >
                            <config.ItemCard
                                item={item}
                                onEdit={config.onEdit}
                                onDelete={config.onDelete}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Aviso de resultados limitados */}
            {isShowingLimitedResults && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800">
                        <strong>Nota:</strong> Se están mostrando solo los primeros {maxResults} resultados
                        de {searchFilteredItems.length} encontrados. Refina tu búsqueda para ver resultados más específicos.
                    </p>
                </div>
            )}
        </>
    );
}