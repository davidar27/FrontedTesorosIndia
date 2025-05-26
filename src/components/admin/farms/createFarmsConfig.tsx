import { EntityConfig, BaseEntity } from "../GenericManagent";

export const createFarmsConfig = <T extends BaseEntity & { entrepreneur: string; location: string; cropType: string }>(
    items: T[],
    ItemCard: EntityConfig<T>['ItemCard'],
    callbacks: Pick<EntityConfig<T>, 'onEdit' | 'onDelete' | 'onView' | 'onCreate'>
): EntityConfig<T> => ({
    entityName: 'Finca',
    entityNamePlural: 'Fincas',
    description: 'Gestiona y monitorea las fincas de los emprendedores',
    searchPlaceholder: 'Buscar fincas, emprendedores...',
    emptyStateEmoji: '🏔️',
    emptyStateTitle: 'No se encontraron fincas',
    emptyStateDescription: 'Intenta cambiar los filtros o el término de búsqueda',
    items,
    ItemCard,
    ...callbacks,
    searchFunction: (item, searchTerm) => {
        const term = searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(term) ||
            item.entrepreneur.toLowerCase().includes(term) ||
            item.location.toLowerCase().includes(term);
    }
});
