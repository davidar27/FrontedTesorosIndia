import { EntityConfig, BaseEntity } from "@/components/admin/GenericManagent";
export const createCategoriesConfig = <T extends BaseEntity & { description: string }>(
    items: T[],
    ItemCard: EntityConfig<T>['ItemCard'],
    callbacks: Pick<EntityConfig<T>, 'onEdit' | 'onDelete' | 'onView' | 'onCreate'>
): EntityConfig<T> => ({
    entityName: 'Categoría',
    entityNamePlural: 'Categorías',
    description: 'Gestiona las categorías de productos',
    searchPlaceholder: 'Buscar categorías, descripción...',
    emptyStateEmoji: '🏷️',
    emptyStateTitle: 'No se encontraron categorías',
    emptyStateDescription: 'Intenta cambiar los filtros o el término de búsqueda',
    items,
    ItemCard,
    ...callbacks,
    searchFunction: (item, searchTerm) => {
        const term = searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term);
    }
});
