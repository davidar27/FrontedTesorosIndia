export interface BaseEntity<TStatus extends string> {
    id?: number;
    name: string;
    status: TStatus;
    [key: string]: string | number | boolean | Date | null | undefined;
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
        onEdit: (item: T) => void;
        onDelete: (id: number) => void;
        onActivate: (id: number) => void;
        onDisable: (id: number) => void;
        onRetry?: () => void;
    }>;

    // Callbacks
    onEdit: (item: T) => void;
    onDelete: (id: number) => void;
    onCreate: () => void;
    onRetry?: () => void;
    onActivate: (id: number) => void;
    onDisable: (id: number) => void;   

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