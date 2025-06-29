import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import { DefaultCustomFilters } from '@/components/admin/Filter';
import { BaseEntity, SimplifiedManagementProps } from '../../features/admin/types';
import { defaultSearchFunction } from './utils/searchUtils';
import { ErrorState } from './components/ErrorState';
import { SearchBar } from './components/SearchBar';
import { EmptyState } from './components/EmptyState';
import { ItemsGrid } from './components/ItemsGrid';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '../ui/display/LoadingSpinner';

export default function GenericManagement<T extends BaseEntity<string>>({
    config
}: SimplifiedManagementProps<T>): React.ReactElement {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredByCustomFilters, setFilteredByCustomFilters] = useState<T[]>([]);
    const location = useLocation();

    const {
        showResultsCount = true,
        maxResults,
        enableAnimations = true,
        isLoading = false,
        error = null,
        entityName,
        entityNamePlural,
        searchPlaceholder,
        emptyStateEmoji,
        emptyStateTitle,
        emptyStateDescription,
        items,
        ItemCard,
        onUpdate,
        onCreate,
        onRetry,
        onChangeStatus
    } = config;



    const searchFunction = config.searchFunction || defaultSearchFunction;

    // Filtrado por búsqueda
    const searchFilteredItems = useMemo(() => {
        if (!searchTerm.trim()) return filteredByCustomFilters;
        return filteredByCustomFilters.filter(item => searchFunction(item, searchTerm));
    }, [searchTerm, filteredByCustomFilters, searchFunction]);

    // Aplicar límite de resultados si está configurado
    const finalFilteredItems = useMemo(() => {
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

    useEffect(() => {
        setFilteredByCustomFilters(items);
    }, [items]);




    const handleUpdate = useCallback(
        async (item: T) => {
            await onUpdate(item);
        },
        [onUpdate]
    );

    if (isLoading) {
        return <LoadingSpinner message={`Cargando ${entityNamePlural.toLowerCase()}...`} />;
    }

    if (error) {
        return (
            <ErrorState
                error={error}
                onRetry={onRetry}
                entityNamePlural={entityNamePlural}
            />
        );
    }

    const isShowingLimitedResults = maxResults && searchFilteredItems.length > maxResults;

    return (
        <>
            {/* Barra de búsqueda y acciones */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
                <SearchBar
                    searchTerm={searchTerm}
                    placeholder={searchPlaceholder}
                    onSearchChange={handleSearchChange}
                    onClearSearch={clearSearch}
                    entityNamePlural={entityNamePlural}
                />
                {location.pathname === '/dashboard/experiencias' ? null : (
                    <Button
                        onClick={onCreate}
                        type="button"
                        className="flex items-center gap-2 rounded-lg"
                        aria-label={`Crear nuevo ${entityName.toLowerCase()}`}
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">{`Crear ${entityName}`}</span>
                        <span className="sm:hidden">Crear</span>
                    </Button>
                )}
            </div>

            {/* Custom Filters */}
            <CustomFilters
                items={items}
                onFilterChange={setFilteredByCustomFilters}
                type={entityName.toLowerCase() as 'category' | 'entrepreneur' | 'experience' | 'package'}
            />

            {/* Results count */}
            {showResultsCount && (
                <div className="mb-6 z-10">
                    <p className="text-gray-600 z-10">
                        {finalFilteredItems.length === items.length ? (
                            `${items.length} ${entityNamePlural.toLowerCase()}`
                        ) : (
                            <>
                                {finalFilteredItems.length} de {items.length} {entityNamePlural.toLowerCase()}
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

            {/* Content */}
            {finalFilteredItems.length === 0 ? (
                <EmptyState
                    emoji={emptyStateEmoji}
                    title={searchTerm ? 'No se encontraron resultados' : emptyStateTitle}
                    description={searchTerm
                        ? `No hay ${entityNamePlural.toLowerCase()} que coincidan con "${searchTerm}"`
                        : emptyStateDescription
                    }
                    searchTerm={searchTerm}
                    onClearSearch={clearSearch}
                />
            ) : (
                <ItemsGrid
                    items={finalFilteredItems}
                    ItemCard={ItemCard}
                    onUpdate={handleUpdate}
                    onChangeStatus={(id: number, status: string) => {
                        onChangeStatus(id, status);
                    }}
                    enableAnimations={enableAnimations}
                />
            )}

            {/* Limited results warning */}
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