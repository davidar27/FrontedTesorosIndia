import { EntityConfig } from "@/features/admin/types";
import { CategoriesFilter } from "./CategoriesFilter";
import { Category } from "./CategoriesTypes";


interface CategoriesConfigParams {
    data: Category[];
    CardComponent: React.ComponentType<{
        item: Category;
        onUpdate: (item: Category) => void;
        onChangeStatus: (id: string, status: string) => void;
        onRetry?: () => void;
    }>;
    actions: {
        onUpdate?: (item: Category) => void;
        onCreate?: () => void;
        onChangeStatus?: (id: string, status: string) => void;
        onRetry?: () => void;
    };
}

const statusPriority = {
    active: 1,
    inactive: 2
};

function sortByStatus(a: Category, b: Category) {
    const getStatus = (e: Category) => {
        const s = (e.status || '').toLowerCase();
        if (s === 'activo' || s === 'active') return 'active';
        if (s === 'inactivo' || s === 'inactive') return 'inactive';
        return 'inactive';
    };
    return statusPriority[getStatus(a)] - statusPriority[getStatus(b)];
}

export const CategoriesConfig = ({
    data,
    CardComponent,
    actions
}: CategoriesConfigParams): EntityConfig<Category> => ({
    entityName: "Categoría",
    entityNamePlural: "Categorías",
    searchPlaceholder: "Buscar categorías...",
    emptyStateEmoji: "👥",
    ItemCard: CardComponent,
    emptyStateTitle: "No hay categorías",
    emptyStateDescription: "Crea la primera categoría para comenzar",
    description: "Gestiona categorías",
    items: data.sort(sortByStatus),
    isLoading: false,
    error: null,
    maxResults: 50,
    enableAnimations: true,
    showResultsCount: true,
    customFilters: CategoriesFilter,
    searchFunction: (item, searchTerm) => {
        const searchLower = searchTerm.toLowerCase();
        const category = item as Category;
        return (
            category.name?.toLowerCase().includes(searchLower)
        );
    },
    onUpdate: actions.onUpdate || (() => {}),
    onCreate: actions.onCreate || (() => {}),
    onRetry: actions.onRetry || (() => {}),
    onChangeStatus: actions.onChangeStatus || (() => {}),
});