import { EntityConfig, BaseEntity } from "@/components/admin/GenericManagent";

export const createPackagesConfig = <T extends BaseEntity & { price: number; description: string }>(
    items: T[],
    ItemCard: EntityConfig<T>['ItemCard'],
    callbacks: Pick<EntityConfig<T>, 'onEdit' | 'onDelete' | 'onView' | 'onCreate'>
): EntityConfig<T> => ({
    entityName: 'Paquete',
    entityNamePlural: 'Paquetes',
    description: 'Gestiona los paquetes de productos y sus precios',
    searchPlaceholder: 'Buscar paquetes, descripción...',
    emptyStateEmoji: '📦',
    emptyStateTitle: 'No se encontraron paquetes',
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