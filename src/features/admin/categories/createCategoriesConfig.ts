import { EntityConfig } from "@/features/admin/types";
import { Category } from "./CategoriesTypes";
import { CategoryCard } from "./CategoriesCard";

interface CategoriesConfigParams {
    data: Category[];
    isLoading?: boolean;
    error?: string | null;
    actions: {
        onUpdate?: (item: Category) => void;
        onDelete?: (id: number) => void;
        onCreate?: () => void;
        onRetry?: () => void;
        onChangeStatus?: (id: number, status: string) => void;
    };
}

export const createCategoriesConfig = ({
    data,
    isLoading = false,
    error = null,
    actions
}: CategoriesConfigParams): EntityConfig<Category> => ({
    entityName: 'Categoría',
    entityNamePlural: 'Categorías',
    description: 'Gestiona las categorías de productos',
    searchPlaceholder: 'Buscar categorías, descripción...',
    emptyStateEmoji: '🏷️',
    emptyStateTitle: 'No se encontraron categorías',
    emptyStateDescription: 'Intenta cambiar los filtros o el término de búsqueda',
    items: data,
    isLoading,
    error,
    ItemCard: CategoryCard,
    onUpdate: actions.onUpdate || (() => {}),
    onDelete: actions.onDelete || (() => {}),
    onCreate: actions.onCreate || (() => {}),
    onRetry: actions.onRetry || (() => {}),
    onChangeStatus: actions.onChangeStatus || (() => {}),
    searchFunction: (item, searchTerm) => {
        const term = searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(term);
    }
});
