export interface BaseEntity<TStatus extends string, TId = number> {
    id?: TId;
    name: string;
    status: TStatus;
    [key: string]: string | number | boolean | Date | null | undefined | TId | string[] | number[] | object[];
}

export interface EntityConfig<T extends BaseEntity<string>> {
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
        onCreate?: () => void;
        onUpdate: (item: T) => void;
        onChangeStatus: (id: number, status: string) => void;
        onRetry?: () => void;
        onView?: (item: T) => void;
    }>;

    // Callbacks
    onUpdate: (item: T) => void;
    onCreate?: () => void;
    onRetry?: () => void;
    onChangeStatus: (id: number, status: string) => void;
    onView?:(item : T) => void;


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

export interface SimplifiedManagementProps<T extends BaseEntity<string>> {
    config: EntityConfig<T>;
} 